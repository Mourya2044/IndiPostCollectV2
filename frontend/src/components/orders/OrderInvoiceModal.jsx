import React, { useState } from 'react';
import { Printer, X, ShieldCheck, Stamp as StampIcon, Download, FileText, Loader } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

const OrderInvoiceModal = ({ order, isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!isOpen || !order) return null;

  const invoiceNumber = `IPC-INV-${(order.orderId || order._id).slice(-8).toUpperCase()}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("printable-invoice");
    if (!element) return;
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`IndiPostCollect_Invoice_${(order.orderId || order._id).slice(-8).toUpperCase()}.pdf`);
      toast.success("PDF Invoice downloaded successfully!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF. Using print dialog instead.");
      window.print();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-background border border-border w-full max-w-3xl overflow-hidden shadow-2xl my-8 print:border-none print:shadow-none print:my-0 print:max-w-none">

        {/* Modal Actions Bar (Hidden in Print) */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20 print:hidden">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-IPCprimary" /> Philatelic Dispatch Invoice
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPDF ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              {isGeneratingPDF ? "Generating PDF…" : "Download PDF"}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border text-foreground text-xs font-semibold uppercase tracking-widest hover:border-IPCprimary hover:text-IPCprimary transition-all cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" /> Print Slip
            </button>
            <button
              onClick={onClose}
              className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 sm:p-12 space-y-8 print:p-6 bg-white text-neutral-900" id="printable-invoice">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-neutral-900 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold tracking-tight text-neutral-950 font-serif">IndiPostCollect.</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 border border-neutral-900 bg-neutral-100">
                  Official Bureau
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono">Philatelic Division & Certified Stamp Registry</p>
              <p className="text-xs text-neutral-500 font-mono">Postal Heritage Center, New Delhi - 110001</p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">TAX INVOICE / DISPATCH SLIP</span>
              <p className="text-base font-bold font-mono text-neutral-900">{invoiceNumber}</p>
              <p className="text-xs text-neutral-600 font-mono">Date: {orderDate}</p>
              <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                order.status === 'complete'
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                  : 'border-amber-700 bg-amber-50 text-amber-800'
              }`}>
                Payment: {order.status === 'complete' ? 'Settled & Verified' : order.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Addresses Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div className="space-y-1.5 border border-neutral-200 p-4 bg-neutral-50/50">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                Dispatched To (Collector)
              </span>
              <p className="font-bold text-neutral-900">{user?.fullName || "Valued Collector"}</p>
              <p className="text-neutral-600">{user?.email}</p>
              {user?.address?.locality ? (
                <div className="text-neutral-600 pt-1 leading-relaxed">
                  <p>{user.address.locality}</p>
                  <p>{user.address.city}, {user.address.district}</p>
                  <p>{user.address.state} - {user.address.pin}</p>
                </div>
              ) : (
                <p className="text-neutral-400 italic">Address recorded in account profile.</p>
              )}
            </div>

            <div className="space-y-1.5 border border-neutral-200 p-4 bg-neutral-50/50">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                Fulfillment & Dispatch
              </span>
              <p className="font-bold text-neutral-900">IndiPostCollect Central Vault</p>
              <p className="text-neutral-600">Secure Philatelic Transit Package</p>
              <p className="text-neutral-600">Protective Glassine & Mount Encapsulation</p>
              <p className="text-neutral-600 font-mono text-[11px] pt-1">Dispatch Mode: Registered Speed Post</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-neutral-300 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-300 text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Stamp Description</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-mono">
                {order.items.map((item, i) => {
                  const stamp = item.productId;
                  const unitPrice = stamp?.price || 0;
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <tr key={i} className="hover:bg-neutral-50">
                      <td className="py-3 px-4 text-neutral-400">{i + 1}</td>
                      <td className="py-3 px-4 font-sans font-medium text-neutral-900">
                        {stamp?.title || "Philatelic Stamp"}
                        {stamp?.year && (
                          <span className="text-[10px] text-neutral-500 font-mono block">
                            Year: {stamp.year} • {stamp.country || "India"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-sans text-neutral-600">
                        <span className="px-1.5 py-0.5 border border-neutral-300 text-[10px] uppercase font-bold">
                          {stamp?.condition || "Mint"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-neutral-800">{item.quantity}</td>
                      <td className="py-3 px-4 text-right text-neutral-800">₹{unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-bold text-neutral-950">₹{itemTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals & Philatelic Seal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Authenticity Certificate Stamp */}
            <div className="border border-dashed border-neutral-400 p-4 flex items-center gap-4 bg-neutral-50">
              <div className="w-12 h-12 border-2 border-neutral-900 rounded-full flex items-center justify-center text-neutral-900 shrink-0 font-serif font-bold text-lg">
                IPC
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-900 uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                  Authenticity Verified
                </div>
                <p className="text-[10px] text-neutral-500 leading-tight">
                  Guaranteed genuine philatelic artifact inspected for perforation, watermark, and preservation status.
                </p>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>₹{order.totalPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Postal Packaging & Insurance</span>
                <span className="text-emerald-700 uppercase font-bold text-[10px]">Free / Included</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Applicable GST / Philatelic Duties</span>
                <span>₹0.00 (Inclusive)</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-neutral-950 pt-2 border-t-2 border-neutral-900">
                <span className="font-sans uppercase tracking-widest text-xs">Total Settled</span>
                <span>₹{order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="border-t border-neutral-200 pt-6 text-[10px] text-neutral-400 text-center space-y-1">
            <p>Thank you for supporting philatelic heritage conservation.</p>
            <p className="font-mono">Generated electronically by IndiPostCollect. Valid without signature under IT Act 2000.</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderInvoiceModal;
