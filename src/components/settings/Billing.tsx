import React, { useState } from "react";
import { FileText, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";

interface Invoice {
  id: string;
  total: string;
  status: "Paid" | "Unpaid" | "Overdue";
  invoiceDate: string;
  dueDate: string;
}

const MOCK_INVOICES: Invoice[] = [
  { id: "#4424458", total: "$26.95", status: "Paid", invoiceDate: "02/21/2026", dueDate: "03/07/2026" },
  { id: "#4393436", total: "$26.95", status: "Paid", invoiceDate: "01/24/2026", dueDate: "02/07/2026" },
  { id: "#4360254", total: "$26.95", status: "Paid", invoiceDate: "12/24/2025", dueDate: "01/07/2026" },
  { id: "#4329564", total: "$26.95", status: "Paid", invoiceDate: "11/23/2025", dueDate: "12/07/2025" },
  { id: "#4299510", total: "$26.95", status: "Paid", invoiceDate: "10/24/2025", dueDate: "11/07/2025" },
  { id: "#4268740", total: "$26.95", status: "Paid", invoiceDate: "09/23/2025", dueDate: "10/07/2025" },
  { id: "#4238653", total: "$26.95", status: "Paid", invoiceDate: "08/24/2025", dueDate: "09/07/2025" },
  { id: "#4208120", total: "$26.95", status: "Paid", invoiceDate: "07/24/2025", dueDate: "08/07/2025" },
];

const PAGE_SIZE = 5;

const statusColor = (status: Invoice["status"]) => {
  if (status === "Paid") return { dot: "#22c55e", text: "#16a34a" };
  if (status === "Unpaid") return { dot: "#f59e0b", text: "#d97706" };
  return { dot: "#ef4444", text: "#dc2626" };
};

const Billing: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(MOCK_INVOICES.length / PAGE_SIZE);
  const paginated = MOCK_INVOICES.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div
      className={cn(`rounded-2xl border overflow-hidden`, theme.border)}
      style={{ backgroundColor: `${theme.accent}06` }}
    >
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              className={cn("border-b text-xs font-semibold uppercase tracking-wide", theme.border)}
              style={{ backgroundColor: `${theme.accent}0f` }}
            >
              <th className={cn("px-5 py-3 text-left", theme.textSecondary)}>Invoice #</th>
              <th className={cn("px-5 py-3 text-left", theme.textSecondary)}>Total</th>
              <th className={cn("px-5 py-3 text-left", theme.textSecondary)}>Status</th>
              <th className={cn("px-5 py-3 text-left", theme.textSecondary)}>Invoice Date</th>
              <th className={cn("px-5 py-3 text-left", theme.textSecondary)}>Due Date</th>
              <th className={cn("px-5 py-3 text-left", theme.textSecondary)}>Details</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((inv, i) => {
              const sc = statusColor(inv.status);
              return (
                <tr
                  key={inv.id}
                  className={cn("border-b transition-colors", theme.border)}
                  style={{
                    backgroundColor: i % 2 === 0 ? `${theme.accent}03` : "transparent",
                  }}
                >
                  <td className="px-5 py-3">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: theme.accent }}
                    >
                      {inv.id}
                    </span>
                  </td>
                  <td className={cn("px-5 py-3 font-medium", theme.text)}>{inv.total}</td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${sc.dot}18`,
                        color: sc.text,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: sc.dot }}
                      />
                      {inv.status}
                    </span>
                  </td>
                  <td className={cn("px-5 py-3", theme.textSecondary)}>{inv.invoiceDate}</td>
                  <td className={cn("px-5 py-3", theme.textSecondary)}>{inv.dueDate}</td>
                  <td className="px-5 py-3">
                    <button
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: theme.accent }}
                      onClick={() => console.log("View invoice", inv.id)}
                    >
                      <FileText size={12} />
                      View Invoice
                      <ExternalLink size={10} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3">
        <p className={cn("text-xs", theme.textSecondary)}>
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, MOCK_INVOICES.length)} of {MOCK_INVOICES.length} invoices
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={cn(`p-1.5 rounded-lg border disabled:opacity-40 transition-colors ${theme.border}`, theme.text)}
            style={{ backgroundColor: `${theme.accent}0f` }}
          >
            <ChevronLeft size={14} />
          </button>
          <span className={cn("text-xs font-medium px-2", theme.text)}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={cn(`p-1.5 rounded-lg border disabled:opacity-40 transition-colors ${theme.border}`, theme.text)}
            style={{ backgroundColor: `${theme.accent}0f` }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billing;