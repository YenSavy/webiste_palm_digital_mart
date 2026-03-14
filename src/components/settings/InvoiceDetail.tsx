import React from "react";
import { ArrowLeft, Printer, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";

interface InvoiceItem {
  description: string;
  price: number;
}

interface InvoiceDetailProps {
  invoiceId?: string;
  status?: "Paid" | "Unpaid" | "Overdue";
  dateGenerated?: string;
  dueDate?: string;
  customerName?: string;
  customerCompany?: string;
  customerAddress?: string;
  customerCity?: string;
  items?: InvoiceItem[];
  subtotal?: number;
  tax?: number;
  onBack?: () => void;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({
  invoiceId = "#4424458",
  status = "Paid",
  dateGenerated = "2026-02-21",
  dueDate = "2026-03-07",
  customerName = "Van Sochan",
  customerCompany = "NGO-GIZ",
  customerAddress = "#9G, Plov Lum, Trapeng Lvea, Sangkat Kakab Khan Por Senchey",
  customerCity = "Phnom Penh, Cambodia 12406, KH",
  items = [
    {
      description:
        "EcoSite Premium (EUROPE) - moh-dhs.com (2026-03-07 - 2026-04-06)",
      price: 26.95,
    },
  ],
  subtotal,
  tax = 0,
  onBack,
}) => {
  const theme = useThemeStore((state) => state.getTheme());

  const computedSubtotal = subtotal ?? items.reduce((sum, i) => sum + i.price, 0);
  const grandTotal = computedSubtotal + tax;

  const statusConfig = {
    Paid: { bg: "#22c55e", icon: <CheckCircle2 size={14} />, label: "Paid" },
    Unpaid: { bg: "#f59e0b", icon: null, label: "Unpaid" },
    Overdue: { bg: "#ef4444", icon: null, label: "Overdue" },
  }[status];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Back + Print */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70",
            theme.textSecondary
          )}
          style={{ color: theme.accent }}
        >
          <ArrowLeft size={15} />
          Back to Invoices
        </button>

        <button
          onClick={() => window.print()}
          className={cn(
            `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-opacity hover:opacity-80`,
            theme.border,
            theme.text
          )}
          style={{ backgroundColor: `${theme.accent}0f` }}
        >
          <Printer size={14} />
          Print
        </button>
      </div>

      {/* Invoice Header Card */}
      <div
        className={cn(`rounded-2xl border p-6`, theme.border)}
        style={{ backgroundColor: `${theme.accent}06` }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className={cn("text-2xl font-bold", theme.text)}>
            Invoice {invoiceId}
          </h1>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: statusConfig.bg }}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        </div>

        <div className="mt-4 space-y-1">
          <p className={cn("text-sm", theme.textSecondary)}>
            <span className="font-semibold" style={{ color: theme.accent }}>
              Date Generated:
            </span>{" "}
            <span className={theme.text}>{dateGenerated}</span>
          </p>
          <p className={cn("text-sm", theme.textSecondary)}>
            <span className="font-semibold" style={{ color: theme.accent }}>
              Due Date:
            </span>{" "}
            <span className={theme.text}>{dueDate}</span>
          </p>
        </div>
      </div>

      {/* Address Card */}
      <div
        className={cn(
          `rounded-2xl border p-6 grid grid-cols-1 sm:grid-cols-2 gap-6`,
          theme.border
        )}
        style={{ backgroundColor: `${theme.accent}06` }}
      >
        {/* Customer Address */}
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: theme.accent }}
          >
            Customer Address:
          </p>
          <div className={cn("space-y-0.5 text-sm", theme.text)}>
            <p className="font-semibold">{customerName}</p>
            {customerCompany && <p>{customerCompany}</p>}
            <p>{customerAddress}</p>
            <p>{customerCity}</p>
          </div>
        </div>

        {/* Payable To */}
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: theme.accent }}
          >
            Payable to:
          </p>
          <div className={cn("space-y-0.5 text-sm", theme.text)}>
            <p className="font-semibold">GreenGeeks LLC</p>
            <p>3411 Silverside Rd</p>
            <p>Tatnall Building #104</p>
            <p>Wilmington, DE 19810, USA.</p>
            <p>
              <span className="font-semibold">Tax ID:</span> 85-3680919
            </p>
          </div>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div
        className={cn(`rounded-2xl border overflow-hidden`, theme.border)}
        style={{ backgroundColor: `${theme.accent}06` }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className={cn("border-b", theme.border)}
              style={{ backgroundColor: `${theme.accent}10` }}
            >
              <th
                className={cn(
                  "px-6 py-3 text-left text-xs font-bold uppercase tracking-wide",
                  theme.textSecondary
                )}
              >
                Description
              </th>
              <th
                className={cn(
                  "px-6 py-3 text-right text-xs font-bold uppercase tracking-wide",
                  theme.textSecondary
                )}
              >
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={i}
                className={cn("border-b", theme.border)}
                style={{
                  backgroundColor:
                    i % 2 === 0 ? `${theme.accent}03` : "transparent",
                }}
              >
                <td className={cn("px-6 py-4", theme.text)}>{item.description}</td>
                <td className={cn("px-6 py-4 text-right font-medium", theme.text)}>
                  ${item.price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="px-6 py-4 flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span className={theme.textSecondary}>Subtotal</span>
              <span className={theme.text}>${computedSubtotal.toFixed(2)}</span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className={theme.textSecondary}>Tax</span>
                <span className={theme.text}>${tax.toFixed(2)}</span>
              </div>
            )}
            <div
              className={cn(
                "flex justify-between text-base font-bold pt-2 border-t",
                theme.border
              )}
            >
              <span className={theme.text}>Total</span>
              <span style={{ color: theme.accent }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;