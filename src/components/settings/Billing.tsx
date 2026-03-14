import React, { useState } from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";
import InvoiceDetail from "./InvoiceDetail";

interface Invoice {
  id: string;
  total: number;
  status: "Paid" | "Unpaid" | "Overdue";
  invoiceDate: string;
  dueDate: string;
}

const invoices: Invoice[] = [
  { id: "#4424458", total: 26.95, status: "Paid", invoiceDate: "02/21/2026", dueDate: "03/07/2026" },
  { id: "#4393436", total: 26.95, status: "Paid", invoiceDate: "01/24/2026", dueDate: "02/07/2026" },
  { id: "#4360254", total: 26.95, status: "Paid", invoiceDate: "12/24/2025", dueDate: "01/07/2026" },
  { id: "#4329564", total: 26.95, status: "Paid", invoiceDate: "11/23/2025", dueDate: "12/07/2025" },
  { id: "#4299510", total: 26.95, status: "Paid", invoiceDate: "10/24/2025", dueDate: "11/07/2025" },
  { id: "#4268740", total: 26.95, status: "Paid", invoiceDate: "09/23/2025", dueDate: "10/07/2025" },
  { id: "#4238653", total: 26.95, status: "Paid", invoiceDate: "08/24/2025", dueDate: "09/07/2025" },
];

const statusConfig = {
  Paid: {
    icon: <CheckCircle2 size={13} />,
    label: "Paid",
    color: "#22c55e",
    bg: "#22c55e18",
  },
  Unpaid: {
    icon: <Clock size={13} />,
    label: "Unpaid",
    color: "#f59e0b",
    bg: "#f59e0b18",
  },
  Overdue: {
    icon: <AlertCircle size={13} />,
    label: "Overdue",
    color: "#ef4444",
    bg: "#ef444418",
  },
};

const Billing: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  if (selectedInvoice) {
    return (
      <InvoiceDetail
        invoiceId={selectedInvoice.id}
        status={selectedInvoice.status}
        dateGenerated={selectedInvoice.invoiceDate}
        dueDate={selectedInvoice.dueDate}
        onBack={() => setSelectedInvoice(null)}
      />
    );
  }

  return (
    <div
      className={cn("rounded-2xl border overflow-hidden", theme.border)}
      style={{ backgroundColor: `${theme.accent}06` }}
    >
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              className={cn("border-b", theme.border)}
              style={{ backgroundColor: `${theme.accent}0c` }}
            >
              {["Invoice #", "Total", "Status", "Invoice Date", "Due Date", "Details"].map(
                (col, i) => (
                  <th
                    key={col}
                    className={cn(
                      "px-6 py-4 text-xs font-bold uppercase tracking-wide",
                      theme.textSecondary,
                      i === 0 || i === 5 ? "text-left" : i === 1 ? "text-right" : "text-left"
                    )}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => {
              const sc = statusConfig[inv.status];
              return (
                <tr
                  key={inv.id}
                  className={cn("border-b transition-colors", theme.border)}
                  style={{
                    backgroundColor:
                      i % 2 === 0 ? `${theme.accent}03` : "transparent",
                  }}
                >
                  {/* Invoice # */}
                  <td className="px-6 py-4">
                    <span
                      className="font-semibold text-sm cursor-pointer hover:underline"
                      style={{ color: theme.accent }}
                    >
                      {inv.id}
                    </span>
                  </td>

                  {/* Total */}
                  <td className={cn("px-6 py-4 text-right font-medium", theme.text)}>
                    ${inv.total.toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ color: sc.color, backgroundColor: sc.bg }}
                    >
                      {sc.icon}
                      {sc.label}
                    </span>
                  </td>

                  {/* Invoice Date */}
                  <td className={cn("px-6 py-4", theme.text)}>{inv.invoiceDate}</td>

                  {/* Due Date */}
                  <td className={cn("px-6 py-4", theme.text)}>{inv.dueDate}</td>

                  {/* View Invoice */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: theme.accent }}
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;