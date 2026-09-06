import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const authUser = process.env.AUTH_MAIL || process.env.EMAIL_USER || process.env.SMTP_USER;
  const authPass = process.env.AUTH_PASS || process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (authUser && authPass) {
    transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: authUser,
        pass: authPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  return transporter;
};

// Generic mail sender with safe fallback to development logging
export const sendMail = async ({ to, subject, html, text }) => {
  try {
    const mailer = getTransporter();
    const authUser = process.env.AUTH_MAIL || process.env.EMAIL_USER || process.env.SMTP_USER;
    const fromAddress = process.env.EMAIL_FROM || (authUser ? `"IndiPostCollect" <${authUser}>` : '"IndiPostCollect Philatelic Bureau" <registry@indipostcollect.in>');

    if (!mailer) {
      console.log(`\n========================================`);
      console.log(`[MAIL NOTIFICATION (Local Mock)]:`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Text summary: ${text || "(HTML Email)"}`);
      console.log(`========================================\n`);
      return { success: true, mocked: true };
    }

    const info = await mailer.sendMail({
      from: fromAddress,
      to,
      subject,
      text: text || subject,
      html,
    });

    console.log(`[MAIL SENT] ID: ${info.messageId} to: ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[MAIL ERROR] Failed to send email:", error.message);
    return { success: false, error: error.message };
  }
};

const formatShortId = (id) => {
  if (!id) return "ORD";
  const str = typeof id === "object" && id.toString ? id.toString() : String(id);
  return str.slice(-8).toUpperCase();
};

// Template 1: Order Confirmation & Invoice Summary
export const sendOrderConfirmationEmail = async ({ to, fullName, orderId, totalPrice, items = [] }) => {
  const shortId = formatShortId(orderId);
  const subject = `Order Confirmed: #IPC-${shortId} - IndiPostCollect Philatelic Bureau`;

  const itemsHtml = items.map((it) => {
    const title = it.productId?.title || "Philatelic Stamp";
    const price = it.productId?.price || 0;
    const qty = it.quantity || 1;
    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-size: 13px;">${title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: center; font-size: 13px;">${qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: right; font-size: 13px; font-weight: bold;">₹${(price * qty).toFixed(2)}</td>
      </tr>
    `;
  }).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; color: #18181b;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; border-top: 4px solid #244855;">
        <!-- Header -->
        <div style="padding: 24px; border-bottom: 1px solid #e4e4e7; background-color: #fafafa;">
          <div style="font-size: 20px; font-weight: bold; font-family: Georgia, serif; color: #244855;">IndiPostCollect.</div>
          <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #71717a;">Certified National Philatelic Registry</p>
        </div>

        <!-- Body -->
        <div style="padding: 28px;">
          <h2 style="font-size: 18px; margin-top: 0; color: #09090b;">Payment Confirmed & Order Registered</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #52525b;">
            Dear <strong>${fullName || "Collector"}</strong>,<br/>
            Your acquisition has been safely recorded in our central philatelic vault. Our preservation curating team is currently preparing your specimens for archival dispatch.
          </p>

          <div style="margin: 20px 0; padding: 14px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-size: 12px; font-family: monospace;">
            <p style="margin: 2px 0;"><strong>Consignment ID:</strong> #IPC-${shortId}</p>
            <p style="margin: 2px 0;"><strong>Total Settled:</strong> ₹${Number(totalPrice || 0).toFixed(2)}</p>
            <p style="margin: 2px 0;"><strong>Dispatch Mode:</strong> Registered Speed Post (Enclosed Glassine)</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <thead>
              <tr style="background-color: #f4f4f5; text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; color: #71717a;">
                <th style="padding: 8px 10px; text-align: left;">Stamp Description</th>
                <th style="padding: 8px 10px; text-align: center;">Qty</th>
                <th style="padding: 8px 10px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div style="padding: 16px 24px; background-color: #fafafa; border-top: 1px solid #e4e4e7; font-size: 11px; text-align: center; color: #a1a1aa;">
          <p style="margin: 0;">Preserving India's Postally Certified Heritage since 1854.</p>
          <p style="margin: 4px 0 0 0;">IndiPostCollect Central Vault, New Delhi - 110001</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to,
    subject,
    html,
    text: `Your IndiPostCollect order #IPC-${shortId} for ₹${Number(totalPrice || 0).toFixed(2)} has been confirmed.`
  });
};

// Template 2: Dispatch & Consignment Tracking Alert
export const sendDispatchNotificationEmail = async ({ to, fullName, orderId, carrier, trackingNumber }) => {
  const shortId = formatShortId(orderId);
  const subject = `Dispatched: Your Stamp Consignment #IPC-${shortId} is in Transit`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; color: #18181b;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; border-top: 4px solid #3B82F6;">
        <div style="padding: 24px; border-bottom: 1px solid #e4e4e7; background-color: #fafafa;">
          <div style="font-size: 20px; font-weight: bold; font-family: Georgia, serif; color: #244855;">IndiPostCollect.</div>
          <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #71717a;">Consignment Dispatch Bureau</p>
        </div>

        <div style="padding: 28px;">
          <h2 style="font-size: 18px; margin-top: 0; color: #09090b;">Package Handed Over for Delivery</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #52525b;">
            Dear <strong>${fullName || "Collector"}</strong>,<br/>
            Your philatelic order <strong>#IPC-${shortId}</strong> has been carefully sealed in protective archival glassine and handed over to the courier.
          </p>

          <div style="margin: 20px 0; padding: 16px; background-color: #eff6ff; border: 1px solid #bfdbfe; font-size: 13px;">
            <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; font-weight: bold; color: #1e40af;">Tracking Telemetry</p>
            <p style="margin: 4px 0; color: #1e293b;"><strong>Carrier:</strong> ${carrier || "India Post (Speed Post Philatelic Bureau)"}</p>
            <p style="margin: 4px 0; color: #1e293b;"><strong>Tracking Number:</strong> <span style="font-family: monospace; font-weight: bold; color: #1e40af;">${trackingNumber || "Pending Courier Scan"}</span></p>
          </div>
        </div>

        <div style="padding: 16px 24px; background-color: #fafafa; border-top: 1px solid #e4e4e7; font-size: 11px; text-align: center; color: #a1a1aa;">
          <p style="margin: 0;">IndiPostCollect • Secure Philatelic Transit Package</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to,
    subject,
    html,
    text: `Your order #IPC-${shortId} has been dispatched via ${carrier || "India Post"}. Tracking Number: ${trackingNumber}`
  });
};

// Template 3: Processing & Packaging Notification
export const sendOrderProcessingEmail = async ({ to, fullName, orderId, totalPrice, items = [] }) => {
  const shortId = formatShortId(orderId);
  const subject = `Order Processing & Curation: #IPC-${shortId} - IndiPostCollect`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; color: #18181b;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; border-top: 4px solid #F59E0B;">
        <div style="padding: 24px; border-bottom: 1px solid #e4e4e7; background-color: #fafafa;">
          <div style="font-size: 20px; font-weight: bold; font-family: Georgia, serif; color: #244855;">IndiPostCollect.</div>
          <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #71717a;">Specimen Curation & Archival Packaging</p>
        </div>

        <div style="padding: 28px;">
          <h2 style="font-size: 18px; margin-top: 0; color: #09090b;">Curation Underway</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #52525b;">
            Dear <strong>${fullName || "Collector"}</strong>,<br/>
            Your order <strong>#IPC-${shortId}</strong> is now being actively processed by our philatelic curation team. Each specimen is undergoing inspection, verification of condition, and placement into certified archival glassine enclosures.
          </p>

          <div style="margin: 20px 0; padding: 14px; background-color: #fffbeb; border: 1px solid #fef3c7; font-size: 12px; font-family: monospace;">
            <p style="margin: 2px 0;"><strong>Consignment Reference:</strong> #IPC-${shortId}</p>
            <p style="margin: 2px 0;"><strong>Current Stage:</strong> Curation & Archival Packaging</p>
            <p style="margin: 2px 0;"><strong>Items Count:</strong> ${items.length || 1} philatelic specimen(s)</p>
          </div>
          <p style="font-size: 13px; color: #71717a; line-height: 1.5;">
            You will receive another notification with your carrier consignment tracking number as soon as the package is dispatched.
          </p>
        </div>

        <div style="padding: 16px 24px; background-color: #fafafa; border-top: 1px solid #e4e4e7; font-size: 11px; text-align: center; color: #a1a1aa;">
          <p style="margin: 0;">IndiPostCollect • Central Philatelic Bureau</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to,
    subject,
    html,
    text: `Your order #IPC-${shortId} is now being curated and packed for dispatch.`
  });
};

// Template 4: Delivery Confirmation
export const sendOrderDeliveredEmail = async ({ to, fullName, orderId, carrier, trackingNumber }) => {
  const shortId = formatShortId(orderId);
  const subject = `Delivered: Stamp Consignment #IPC-${shortId} has Arrived`;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; color: #18181b;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; border-top: 4px solid #10B981;">
        <div style="padding: 24px; border-bottom: 1px solid #e4e4e7; background-color: #fafafa;">
          <div style="font-size: 20px; font-weight: bold; font-family: Georgia, serif; color: #244855;">IndiPostCollect.</div>
          <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #71717a;">Certified Delivery Bureau</p>
        </div>

        <div style="padding: 28px;">
          <h2 style="font-size: 18px; margin-top: 0; color: #065f46;">Consignment Delivered</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #52525b;">
            Dear <strong>${fullName || "Collector"}</strong>,<br/>
            Your consignment <strong>#IPC-${shortId}</strong> has been officially marked as delivered by <strong>${carrier || "India Post"}</strong>.
          </p>

          <div style="margin: 20px 0; padding: 14px; background-color: #ecfdf5; border: 1px solid #a7f3d0; font-size: 12px; font-family: monospace;">
            <p style="margin: 2px 0;"><strong>Consignment ID:</strong> #IPC-${shortId}</p>
            <p style="margin: 2px 0;"><strong>Tracking Number:</strong> ${trackingNumber || "Delivered"}</p>
            <p style="margin: 2px 0;"><strong>Carrier:</strong> ${carrier || "India Post Speed Post"}</p>
          </div>

          <div style="margin: 24px 0; padding: 16px; background-color: #f8fafc; border: 1px dashed #cbd5e1; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; color: #1e293b;">Preserve your specimen in your Virtual Album</p>
            <a href="${frontendUrl}/profile?tab=album" style="display: inline-block; padding: 10px 20px; background-color: #244855; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">
              Open Digital Binder
            </a>
          </div>
        </div>

        <div style="padding: 16px 24px; background-color: #fafafa; border-top: 1px solid #e4e4e7; font-size: 11px; text-align: center; color: #a1a1aa;">
          <p style="margin: 0;">Thank you for preserving India's philatelic heritage with IndiPostCollect.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to,
    subject,
    html,
    text: `Your IndiPostCollect consignment #IPC-${shortId} has been successfully delivered via ${carrier || "India Post"}.`
  });
};

// Template 5: Order Cancellation
export const sendOrderCancelledEmail = async ({ to, fullName, orderId, totalPrice }) => {
  const shortId = formatShortId(orderId);
  const subject = `Order Cancelled: #IPC-${shortId} - IndiPostCollect Philatelic Bureau`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; color: #18181b;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; border-top: 4px solid #EF4444;">
        <div style="padding: 24px; border-bottom: 1px solid #e4e4e7; background-color: #fafafa;">
          <div style="font-size: 20px; font-weight: bold; font-family: Georgia, serif; color: #244855;">IndiPostCollect.</div>
          <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #71717a;">Registry Notice</p>
        </div>

        <div style="padding: 28px;">
          <h2 style="font-size: 18px; margin-top: 0; color: #991b1b;">Order Cancelled</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #52525b;">
            Dear <strong>${fullName || "Collector"}</strong>,<br/>
            This is to confirm that your order <strong>#IPC-${shortId}</strong> has been cancelled.
          </p>

          <div style="margin: 20px 0; padding: 14px; background-color: #fef2f2; border: 1px solid #fecaca; font-size: 12px; font-family: monospace;">
            <p style="margin: 2px 0;"><strong>Consignment ID:</strong> #IPC-${shortId}</p>
            <p style="margin: 2px 0;"><strong>Status:</strong> Cancelled</p>
            <p style="margin: 2px 0;"><strong>Order Amount:</strong> ₹${Number(totalPrice || 0).toFixed(2)}</p>
          </div>

          <p style="font-size: 13px; color: #71717a; line-height: 1.5;">
            The items have been returned to registry availability. If a payment was previously settled, any applicable refund will be routed per standard banking timelines.
          </p>
        </div>

        <div style="padding: 16px 24px; background-color: #fafafa; border-top: 1px solid #e4e4e7; font-size: 11px; text-align: center; color: #a1a1aa;">
          <p style="margin: 0;">IndiPostCollect Central Philatelic Vault</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to,
    subject,
    html,
    text: `Your IndiPostCollect order #IPC-${shortId} has been cancelled.`
  });
};

// Template 6: Event Registration Reminder
export const sendEventReminderEmail = async ({ to, fullName, eventTitle, eventDate, location }) => {
  const subject = `Philatelic Event Reminder: ${eventTitle} - IndiPostCollect`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; color: #18181b;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; border-top: 4px solid #874F41;">
        <div style="padding: 24px; border-bottom: 1px solid #e4e4e7; background-color: #fafafa;">
          <div style="font-size: 20px; font-weight: bold; font-family: Georgia, serif; color: #244855;">IndiPostCollect.</div>
          <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #71717a;">Philatelic Society & Exhibitions</p>
        </div>

        <div style="padding: 28px;">
          <h2 style="font-size: 18px; margin-top: 0; color: #09090b;">Upcoming Philatelic Event</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #52525b;">
            Hello <strong>${fullName || "Collector"}</strong>,<br/>
            This is a reminder for your registered attendance at <strong>${eventTitle}</strong>.
          </p>

          <div style="margin: 20px 0; padding: 14px; background-color: #fef3c7; border: 1px solid #fde68a; font-size: 13px;">
            <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${eventDate || "Upcoming Schedule"}</p>
            <p style="margin: 4px 0;"><strong>Location:</strong> ${location || "National Philatelic Hall"}</p>
          </div>
        </div>

        <div style="padding: 16px 24px; background-color: #fafafa; border-top: 1px solid #e4e4e7; font-size: 11px; text-align: center; color: #a1a1aa;">
          <p style="margin: 0;">IndiPostCollect Philatelic Society</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to,
    subject,
    html,
    text: `Reminder: You are registered for ${eventTitle} on ${eventDate}.`
  });
};
