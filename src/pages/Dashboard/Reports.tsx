import React, { useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Calendar, Download, FileText, TrendingUp, Wallet, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";
import useMainStore from "../../store/mainStore";

type TReportStatus = "Ready" | "Processing" | "Draft";
type TRange = "7d" | "30d" | "90d";
type TReport = {
  id: string;
  name: string;
  period: string;
  status: TReportStatus;
  generatedAt: string;
  owner: string;
  size: string;
};

const Reports: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());
  const search = useMainStore((state) => state.search);
  const [range, setRange] = useState<TRange>("30d");
  const [selectedStatus, setSelectedStatus] = useState<TReportStatus | "all">("all");
  const [selectedOwner, setSelectedOwner] = useState<string>("all");
  const [activeReport, setActiveReport] = useState<TReport | null>(null);

  const reportItems = useMemo<TReport[]>(
    () => [
      {
        id: "rep-2026-001",
        name: "Revenue Summary",
        period: "Jan 2026",
        status: "Ready",
        generatedAt: "2026-02-01 09:15",
        owner: "Finance Team",
        size: "1.2 MB",
      },
      {
        id: "rep-2026-002",
        name: "Sales Performance",
        period: "Q1 2026",
        status: "Processing",
        generatedAt: "2026-02-28 16:40",
        owner: "Sales Ops",
        size: "--",
      },
      {
        id: "rep-2026-003",
        name: "Inventory Movement",
        period: "Feb 2026",
        status: "Ready",
        generatedAt: "2026-02-27 11:05",
        owner: "Warehouse",
        size: "940 KB",
      },
      {
        id: "rep-2026-004",
        name: "Customer Retention",
        period: "Jan 2026",
        status: "Draft",
        generatedAt: "2026-02-15 08:30",
        owner: "Marketing",
        size: "--",
      },
    ],
    [],
  );

  const filteredReports = useMemo(() => {
    const term = search?.trim().toLowerCase() || "";
    const matchesSearch = (report: TReport) =>
      !term ||
      report.name.toLowerCase().includes(term) ||
      report.period.toLowerCase().includes(term) ||
      report.owner.toLowerCase().includes(term) ||
      report.status.toLowerCase().includes(term);

    return reportItems.filter((report) => {
      if (!matchesSearch(report)) return false;
      if (selectedStatus !== "all" && report.status !== selectedStatus) return false;
      if (selectedOwner !== "all" && report.owner !== selectedOwner) return false;
      return true;
    });
  }, [reportItems, search, selectedOwner, selectedStatus]);

  const ownerOptions = useMemo(() => {
    const uniqueOwners = Array.from(new Set(reportItems.map((r) => r.owner)));
    return ["all", ...uniqueOwners];
  }, [reportItems]);

  const rangeLabel =
    range === "7d" ? "Last 7 days" : range === "30d" ? "Last 30 days" : "Last 90 days";

  const clearFilters = () => {
    setSelectedOwner("all");
    setSelectedStatus("all");
  };

  const handleViewReport = (report: TReport) => {
    setActiveReport(report);
  };

  const closeReport = () => {
    setActiveReport(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 px-3 py-4 sm:px-6 sm:py-6">
      <section
        className={cn(
          `bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-4 sm:p-6`,
        )}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className={cn("text-xl sm:text-2xl font-bold", theme.text)}>Reports</h1>
            <p className={cn("mt-1 text-sm", theme.textSecondary)}>
              Track performance and export detailed insights.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border h-10 w-full sm:w-auto"
              style={{
                borderColor: `${theme.accent}55`,
                backgroundColor: `${theme.accent}12`,
              }}
            >
              <Calendar size={16} style={{ color: theme.accent }} />
              <select
                value={range}
                onChange={(event) => setRange(event.target.value as TRange)}
                className={cn("text-sm font-medium outline-none rounded-lg border px-2 py-1 min-w-0 flex-1 sm:flex-none sm:min-w-[140px]", theme.text)}
                style={{
                  borderColor: `${theme.accent}33`,
                  backgroundColor: `${theme.accent}08`,
                }}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white w-full sm:w-auto"
              style={{ backgroundColor: theme.accent }}
            >
              <span className="inline-flex items-center gap-2">
                <Download size={16} />
                Export All
              </span>
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={cn("text-xs uppercase tracking-wide", theme.textSecondary)}>Status</label>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as TReportStatus | "all")}
              className={cn("mt-2 w-full rounded-lg border px-3 py-2 text-sm", theme.text)}
              style={{
                borderColor: `${theme.accent}33`,
                backgroundColor: `${theme.accent}08`,
              }}
            >
              <option value="all">All</option>
              <option value="Ready">Ready</option>
              <option value="Processing">Processing</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div>
            <label className={cn("text-xs uppercase tracking-wide", theme.textSecondary)}>Owner</label>
            <select
              value={selectedOwner}
              onChange={(event) => setSelectedOwner(event.target.value)}
              className={cn("mt-2 w-full rounded-lg border px-3 py-2 text-sm", theme.text)}
              style={{
                borderColor: `${theme.accent}33`,
                backgroundColor: `${theme.accent}08`,
              }}
            >
              {ownerOptions.map((owner) => (
                <option key={owner} value={owner}>
                  {owner === "all" ? "All" : owner}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
            <button
              onClick={clearFilters}
              className={cn("px-4 py-2 rounded-lg text-sm font-semibold border h-10 min-w-[140px] w-full sm:w-auto", theme.text)}
              style={{
                borderColor: `${theme.accent}55`,
                backgroundColor: `${theme.accent}10`,
              }}
            >
              Clear Filters
            </button>
            <div
              className="px-3 py-2 rounded-lg text-sm font-semibold border h-10 min-w-[140px] w-full sm:w-auto flex items-center justify-center"
              style={{
                borderColor: `${theme.accent}33`,
                backgroundColor: `${theme.accent}08`,
                color: theme.accent,
              }}
            >
              {rangeLabel}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            title: "Revenue",
            value: "$84,320",
            change: "+12.4%",
            trendUp: true,
            icon: <Wallet size={20} />,
          },
          {
            title: "Orders",
            value: "1,420",
            change: "+6.1%",
            trendUp: true,
            icon: <TrendingUp size={20} />,
          },
          {
            title: "Returns",
            value: "84",
            change: "-2.3%",
            trendUp: false,
            icon: <ArrowDownRight size={20} />,
          },
          {
            title: "Reports Ready",
            value: "18",
            change: "+4",
            trendUp: true,
            icon: <FileText size={20} />,
          },
        ].map((card) => (
          <div
            key={card.title}
            className={cn(
              `bg-gradient-to-br ${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5`,
            )}
          >
            <div className="flex items-center justify-between">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${theme.accent}20`,
                  color: theme.accent,
                }}
              >
                {card.icon}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1",
                  card.trendUp ? "text-green-600" : "text-red-500",
                )}
                style={{
                  backgroundColor: card.trendUp
                    ? "rgba(34,197,94,0.12)"
                    : "rgba(239,68,68,0.12)",
                }}
              >
                {card.trendUp ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {card.change}
              </span>
            </div>
            <div className="mt-4">
              <p className={cn("text-sm", theme.textSecondary)}>{card.title}</p>
              <p className={cn("text-2xl font-bold", theme.text)}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section
        className={cn(
          `bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-4 sm:p-6`,
        )}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className={cn("text-lg font-semibold", theme.text)}>
              Recent Reports
            </h2>
            <p className={cn("text-sm mt-1", theme.textSecondary)}>
              Search from the header to filter reports by name, owner, or
              status.
            </p>
          </div>
          <button
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold border w-full sm:w-auto",
              theme.text,
            )}
            style={{
              borderColor: `${theme.accent}55`,
              backgroundColor: `${theme.accent}10`,
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Clock size={16} />
              Schedule Report
            </span>
          </button>
        </div>

        <div className="mt-5 space-y-3 md:hidden">
          {filteredReports.map((report) => (
            <article
              key={report.id}
              className={cn("rounded-xl border p-4 space-y-3", theme.border)}
              style={{ backgroundColor: `${theme.accent}08` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className={cn("text-sm font-semibold break-words", theme.text)}>{report.name}</p>
                  <p className={cn("text-xs mt-1", theme.textSecondary)}>{report.period}</p>
                </div>
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded-full font-semibold inline-flex items-center gap-1 shrink-0",
                    report.status === "Ready"
                      ? "text-green-600"
                      : report.status === "Processing"
                        ? "text-amber-600"
                        : "text-blue-600",
                  )}
                  style={{
                    backgroundColor:
                      report.status === "Ready"
                        ? "rgba(34,197,94,0.12)"
                        : report.status === "Processing"
                          ? "rgba(251,191,36,0.16)"
                          : "rgba(59,130,246,0.12)",
                  }}
                >
                  {report.status === "Ready" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {report.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className={cn("font-medium", theme.textSecondary)}>Owner</p>
                  <p className={cn("mt-1 break-words", theme.text)}>{report.owner}</p>
                </div>
                <div>
                  <p className={cn("font-medium", theme.textSecondary)}>Size</p>
                  <p className={cn("mt-1", theme.text)}>{report.size}</p>
                </div>
                <div className="col-span-2">
                  <p className={cn("font-medium", theme.textSecondary)}>Generated</p>
                  <p className={cn("mt-1 break-words", theme.text)}>{report.generatedAt}</p>
                </div>
              </div>
              <button
                className={cn("px-3 py-2 rounded-lg text-xs font-semibold border w-full", theme.text)}
                style={{
                  borderColor: `${theme.accent}55`,
                  backgroundColor: `${theme.accent}10`,
                }}
                onClick={() => handleViewReport(report)}
              >
                View
              </button>
            </article>
          ))}
          {filteredReports.length === 0 && (
            <p className={cn("py-6 text-center text-sm", theme.textSecondary)}>No reports match your search.</p>
          )}
        </div>

        <div className="mt-5 hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={cn("border-b", theme.border, theme.text)}>
                <th className="py-2">Report</th>
                <th className="py-2">Period</th>
                <th className="py-2">Owner</th>
                <th className="py-2">Status</th>
                <th className="py-2">Generated</th>
                <th className="py-2">Size</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className={cn("border-b", theme.border)}>
                  <td className={cn("py-3 font-medium", theme.text)}>
                    {report.name}
                  </td>
                  <td className={cn("py-3", theme.textSecondary)}>
                    {report.period}
                  </td>
                  <td className={cn("py-3", theme.textSecondary)}>
                    {report.owner}
                  </td>
                  <td className="py-3">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs rounded-full font-semibold inline-flex items-center gap-1",
                        report.status === "Ready"
                          ? "text-green-600"
                          : report.status === "Processing"
                            ? "text-amber-600"
                            : "text-blue-600",
                      )}
                      style={{
                        backgroundColor:
                          report.status === "Ready"
                            ? "rgba(34,197,94,0.12)"
                            : report.status === "Processing"
                              ? "rgba(251,191,36,0.16)"
                              : "rgba(59,130,246,0.12)",
                      }}
                    >
                      {report.status === "Ready" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {report.status}
                    </span>
                  </td>
                  <td className={cn("py-3", theme.textSecondary)}>
                    {report.generatedAt}
                  </td>
                  <td className={cn("py-3", theme.textSecondary)}>
                    {report.size}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold border",
                        theme.text,
                      )}
                      style={{
                        borderColor: `${theme.accent}55`,
                        backgroundColor: `${theme.accent}10`,
                      }}
                      onClick={() => handleViewReport(report)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className={cn(
                      "py-6 text-center text-sm",
                      theme.textSecondary,
                    )}
                  >
                    No reports match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 sm:px-4 py-4">
          <div
            className={cn(
              `w-full max-w-xl rounded-2xl border bg-gradient-to-br ${theme.cardBg} p-4 sm:p-6 max-h-[92vh] overflow-y-auto`,
              theme.border,
            )}
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className={cn("text-xs uppercase tracking-wide", theme.textSecondary)}>
                  Report Preview
                </p>
                <h3 className={cn("text-xl font-semibold", theme.text)}>{activeReport.name}</h3>
                <p className={cn("text-sm", theme.textSecondary)}>{activeReport.period}</p>
              </div>
              <button
                onClick={closeReport}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border w-full sm:w-auto", theme.text)}
                style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}10` }}
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className={cn("text-xs uppercase tracking-wide", theme.textSecondary)}>Owner</p>
                <p className={cn("mt-1 font-medium", theme.text)}>{activeReport.owner}</p>
              </div>
              <div>
                <p className={cn("text-xs uppercase tracking-wide", theme.textSecondary)}>Status</p>
                <p className={cn("mt-1 font-medium", theme.text)}>{activeReport.status}</p>
              </div>
              <div>
                <p className={cn("text-xs uppercase tracking-wide", theme.textSecondary)}>Generated</p>
                <p className={cn("mt-1 font-medium", theme.text)}>{activeReport.generatedAt}</p>
              </div>
              <div>
                <p className={cn("text-xs uppercase tracking-wide", theme.textSecondary)}>File Size</p>
                <p className={cn("mt-1 font-medium", theme.text)}>{activeReport.size}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <button
                className={cn("px-4 py-2 rounded-lg text-sm font-semibold border w-full sm:w-auto", theme.text)}
                style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}10` }}
              >
                Download PDF
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white w-full sm:w-auto"
                style={{ backgroundColor: theme.accent }}
              >
                Open Full Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
