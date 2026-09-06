/**
 * Generates a clean, minimalist, modern HTML email layout for IndiPostCollect.
 * Emphasizes whitespace, crisp typography, subtle borders, and maximum deliverability.
 */
export const buildEmailHtml = ({
  title,
  preheader,
  greeting = "Hello,",
  bodyParagraphs = [],
  ctaButton = null, // { text, url, color }
  infoText = null,
  fallbackUrl = null,
  footerNote = "Marketplace for Philatelists & Postal Heritage",
}) => {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .email-card {
        width: 100% !important;
        border-radius: 0 !important;
        border-left: none !important;
        border-right: none !important;
      }
      .email-body {
        padding: 32px 20px !important;
      }
      .email-header {
        padding: 24px 20px !important;
      }
      .email-footer {
        padding: 24px 20px !important;
      }
      .btn-cta {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #111827; word-spacing: normal;">

  <!-- Hidden Preheader text for inbox preview snippet -->
  <div style="display: none; font-size: 1px; color: #f9fafb; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader || title}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; padding: 40px 12px;">
    <tr>
      <td align="center">
        
        <!-- Minimalist Card Container -->
        <table role="presentation" class="email-card" border="0" cellpadding="0" cellspacing="0" width="540" style="max-width: 540px; width: 100%; background-color: #ffffff; border-radius: 10px; border: 1px solid #e5e7eb; overflow: hidden;">
          
          <!-- Header: Clean Brand Identity -->
          <tr>
            <td class="email-header" style="padding: 32px 40px 24px; border-bottom: 1px solid #f3f4f6;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.4px; text-decoration: none;">
                      IndiPostCollect<span style="color: #dc2626;">.</span>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body: Core Content -->
          <tr>
            <td class="email-body" style="padding: 36px 40px;">
              
              <!-- Title -->
              <h1 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #111827; letter-spacing: -0.3px; line-height: 1.4;">
                ${title}
              </h1>

              <!-- Greeting -->
              <p style="margin: 0 0 16px; font-size: 14px; color: #6b7280; line-height: 1.5;">
                ${greeting}
              </p>

              <!-- Body Paragraphs -->
              ${bodyParagraphs.map(paragraph => `
                <p style="margin: 0 0 16px; font-size: 14px; color: #374151; line-height: 1.6;">
                  ${paragraph}
                </p>
              `).join("")}

              <!-- Minimalist CTA Button -->
              ${ctaButton ? `
                <div style="margin: 28px 0 24px;">
                  <!--[if mso]>
                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${ctaButton.url}" style="height:44px;v-text-anchor:middle;width:200px;" arcsize="12%" stroke="f" fillcolor="${ctaButton.color || '#111827'}">
                    <w:anchorlock/>
                    <center style="color:#ffffff;font-family:sans-serif;font-size:14px;font-weight:600;">${ctaButton.text}</center>
                  </v:roundrect>
                  <![endif]-->
                  <!--[if !mso]><!-->
                  <a href="${ctaButton.url}" target="_blank" class="btn-cta" style="background-color: ${ctaButton.color || '#111827'}; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 14px; display: inline-block; letter-spacing: 0.1px;">
                    ${ctaButton.text} &rarr;
                  </a>
                  <!--<![endif]-->
                </div>
              ` : ""}

              <!-- Info / Expiry Notice Box -->
              ${infoText ? `
                <div style="background-color: #f9fafb; border-left: 2px solid #9ca3af; padding: 12px 16px; margin: 24px 0 16px; border-radius: 0 4px 4px 0;">
                  <p style="margin: 0; font-size: 12.5px; color: #4b5563; line-height: 1.5;">
                    ${infoText}
                  </p>
                </div>
              ` : ""}

              <!-- Fallback Direct URL -->
              ${fallbackUrl ? `
                <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
                  <p style="margin: 0 0 6px; font-size: 12px; color: #9ca3af;">
                    If the button above does not work, copy and paste this link into your browser:
                  </p>
                  <p style="margin: 0; word-break: break-all; font-size: 12px; color: #2563eb;">
                    <a href="${fallbackUrl}" style="color: #2563eb; text-decoration: underline;">${fallbackUrl}</a>
                  </p>
                </div>
              ` : ""}

            </td>
          </tr>

          <!-- Footer: Minimal Disclaimers -->
          <tr>
            <td class="email-footer" style="padding: 24px 40px; background-color: #fafafa; border-top: 1px solid #f3f4f6;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #6b7280;">
                IndiPostCollect &mdash; ${footerNote}
              </p>
              <p style="margin: 0; font-size: 11px; color: #9ca3af; line-height: 1.5;">
                This is an automated notification. If you did not make this request, no action is needed and you can safely ignore this email. &copy; ${currentYear} IndiPostCollect.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
