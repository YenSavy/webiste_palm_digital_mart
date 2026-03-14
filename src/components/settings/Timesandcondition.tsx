import React, { useState } from "react";
import { Clock, Plus, Trash2, Pencil, Check, X, CalendarClock, ShieldAlert } from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";

type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type ConditionKey = "active" | "inactive" | "maintenance" | "restricted";

interface TimeRule {
  id: string;
  label: string;
  start: string;
  end: string;
  condition: ConditionKey;
  days: DayKey[];
}

const DAYS: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CONDITION_META: Record<ConditionKey, { label: string; color: string; bg: string }> = {
  active:      { label: "Active",      color: "#16a34a", bg: "#22c55e18" },
  inactive:    { label: "Inactive",    color: "#6b7280", bg: "#6b728018" },
  maintenance: { label: "Maintenance", color: "#d97706", bg: "#f59e0b18" },
  restricted:  { label: "Restricted",  color: "#dc2626", bg: "#ef444418" },
};

const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

const INITIAL_RULES: TimeRule[] = [
  { id: "1", label: "Business Hours",      start: "08:00", end: "17:00", condition: "active",      days: ["Mon","Tue","Wed","Thu","Fri"] },
  { id: "2", label: "Nightly Maintenance", start: "00:00", end: "06:00", condition: "maintenance",  days: ["Mon","Tue","Wed","Thu","Fri"] },
  { id: "3", label: "Weekend Limited",     start: "10:00", end: "18:00", condition: "restricted",   days: ["Sat","Sun"] },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const Timesandcondition: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());

  const [rules, setRules] = useState<TimeRule[]>(INITIAL_RULES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TimeRule | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const blankRule = (): TimeRule => ({
    id: uid(), label: "", start: "09:00", end: "17:00",
    condition: "active", days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  });

  const startEdit = (rule: TimeRule) => {
    setDraft({ ...rule });
    setEditingId(rule.id);
    setIsAdding(false);
    setMessage(null);
  };

  const startAdd = () => {
    const b = blankRule();
    setDraft(b);
    setEditingId(b.id);
    setIsAdding(true);
    setMessage(null);
  };

  const cancelEdit = () => {
    setDraft(null);
    setEditingId(null);
    setIsAdding(false);
  };

  const saveRule = () => {
    if (!draft) return;
    if (!draft.label.trim()) {
      setMessage({ type: "error", text: "Please enter a label for this rule." });
      return;
    }
    if (!draft.days.length) {
      setMessage({ type: "error", text: "Please select at least one day." });
      return;
    }
    if (isAdding) {
      setRules((prev) => [...prev, draft]);
    } else {
      setRules((prev) => prev.map((r) => (r.id === draft.id ? draft : r)));
    }
    setMessage({ type: "success", text: isAdding ? "Rule added successfully." : "Rule updated successfully." });
    setDraft(null);
    setEditingId(null);
    setIsAdding(false);
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) cancelEdit();
  };

  const toggleDay = (d: DayKey) => {
    if (!draft) return;
    setDraft({
      ...draft,
      days: draft.days.includes(d) ? draft.days.filter((x) => x !== d) : [...draft.days, d],
    });
  };

  const inputClass = cn(
    `w-full px-3 py-2 rounded-lg border text-sm ${theme.border} ${theme.text}`
  );

  const EditForm = ({ d }: { d: TimeRule }) => (
    <div className="space-y-3">
      <div>
        <label className={cn("text-xs font-semibold uppercase tracking-wide mb-1.5 block", theme.textSecondary)}>
          Label
        </label>
        <input
          type="text"
          value={d.label}
          onChange={(e) => setDraft({ ...d, label: e.target.value })}
          className={inputClass}
          style={{ backgroundColor: `${theme.accent}08` }}
          placeholder="Rule name"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={cn("text-xs font-semibold uppercase tracking-wide mb-1.5 block", theme.textSecondary)}>
            Start Time
          </label>
          <select
            value={d.start}
            onChange={(e) => setDraft({ ...d, start: e.target.value })}
            className={inputClass}
            style={{ backgroundColor: `${theme.accent}08` }}
          >
            {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div>
          <label className={cn("text-xs font-semibold uppercase tracking-wide mb-1.5 block", theme.textSecondary)}>
            End Time
          </label>
          <select
            value={d.end}
            onChange={(e) => setDraft({ ...d, end: e.target.value })}
            className={inputClass}
            style={{ backgroundColor: `${theme.accent}08` }}
          >
            {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
            <option value="23:59">23:59</option>
          </select>
        </div>
      </div>

      <div>
        <label className={cn("text-xs font-semibold uppercase tracking-wide mb-1.5 block", theme.textSecondary)}>
          Condition
        </label>
        <select
          value={d.condition}
          onChange={(e) => setDraft({ ...d, condition: e.target.value as ConditionKey })}
          className={inputClass}
          style={{ backgroundColor: `${theme.accent}08` }}
        >
          {(Object.keys(CONDITION_META) as ConditionKey[]).map((k) => (
            <option key={k} value={k}>{CONDITION_META[k].label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={cn("text-xs font-semibold uppercase tracking-wide mb-1.5 block", theme.textSecondary)}>
          Active Days
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {DAYS.map((day) => {
            const on = d.days.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all", theme.border)}
                style={{
                  backgroundColor: on ? `${theme.accent}20` : `${theme.accent}08`,
                  color: on ? theme.accent : undefined,
                  borderColor: on ? theme.accent : undefined,
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {message && (
        <p
          className="text-xs font-medium px-3 py-2 rounded-lg"
          style={{
            backgroundColor: message.type === "success" ? "#22c55e18" : "#ef444418",
            color: message.type === "success" ? "#16a34a" : "#dc2626",
          }}
        >
          {message.text}
        </p>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={saveRule}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: theme.accent }}
        >
          <Check size={13} />
          Save
        </button>
        <button
          onClick={cancelEdit}
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-opacity hover:opacity-80",
            theme.border, theme.textSecondary
          )}
          style={{ backgroundColor: `${theme.accent}08` }}
        >
          <X size={13} />
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <div
        className={cn("rounded-2xl border p-6", theme.border)}
        style={{ backgroundColor: `${theme.accent}06` }}
      >
        <h2 className={cn("text-lg font-semibold mb-5 flex items-center gap-2", theme.text)}>
          <Clock size={18} style={{ color: theme.accent }} />
          Time Rules
        </h2>

        <div className="space-y-3">
          {rules.map((rule) => {
            const meta = CONDITION_META[rule.condition];
            const isEdit = editingId === rule.id && !isAdding;

            return (
              <div
                key={rule.id}
                className={cn("rounded-xl border p-4 transition-all", theme.border)}
                style={{ backgroundColor: `${theme.accent}08` }}
              >
                {isEdit && draft ? (
                  <EditForm d={draft} />
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={cn("text-sm font-semibold", theme.text)}>{rule.label}</span>
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <p className={cn("text-xs mb-2", theme.textSecondary)}>
                        {rule.start} — {rule.end}
                      </p>
                      <div className="flex gap-1 flex-wrap">
                        {DAYS.map((d) => (
                          <span
                            key={d}
                            className="text-xs px-2 py-0.5 rounded-md font-medium"
                            style={{
                              backgroundColor: rule.days.includes(d) ? `${theme.accent}18` : `${theme.accent}06`,
                              color: rule.days.includes(d) ? theme.accent : undefined,
                            }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => startEdit(rule)}
                        className={cn("p-1.5 rounded-lg border transition-opacity hover:opacity-70", theme.border, theme.textSecondary)}
                        style={{ backgroundColor: `${theme.accent}08` }}
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="p-1.5 rounded-lg border transition-opacity hover:opacity-70"
                        style={{ backgroundColor: "#ef444412", borderColor: "#ef444430", color: "#dc2626" }}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
         
          {isAdding && draft && (
            <div
              className={cn("rounded-xl border p-4", theme.border)}
              style={{ backgroundColor: `${theme.accent}08` }}
            >
              <EditForm d={draft} />
            </div>
          )}

          
          {!editingId && message && (
            <p
              className="text-xs font-medium px-3 py-2 rounded-lg"
              style={{
                backgroundColor: message.type === "success" ? "#22c55e18" : "#ef444418",
                color: message.type === "success" ? "#16a34a" : "#dc2626",
              }}
            >
              {message.text}
            </p>
          )}

          {!isAdding && (
            <button
              onClick={startAdd}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-80"
              style={{
                backgroundColor: `${theme.accent}10`,
                borderColor: `${theme.accent}30`,
                color: theme.accent,
              }}
            >
              <Plus size={14} />
              Add Time Rule
            </button>
          )}
        </div>
      </div>

      <div
        className={cn("rounded-2xl border p-6", theme.border)}
        style={{ backgroundColor: `${theme.accent}06` }}
      >
        <h2 className={cn("text-lg font-semibold mb-2 flex items-center gap-2", theme.text)}>
          <CalendarClock size={18} style={{ color: theme.accent }} />
          Time-based Conditions
        </h2>

        <div className="space-y-4">
          <div>
            <p className={cn("text-sm font-semibold mb-1", theme.text)}>
              What are Time-based Conditions?
            </p>
            <p className={cn("text-sm leading-relaxed", theme.textSecondary)}>
              Time rules define when your system is accessible, under maintenance, or restricted.
              Each rule applies a condition to a specific time range and set of days.
            </p>
          </div>

          <div>
            <p className={cn("text-sm font-semibold mb-2", theme.text)}>Available Conditions</p>
            <ul className="space-y-1.5">
              {(Object.entries(CONDITION_META) as [ConditionKey, typeof CONDITION_META[ConditionKey]][]).map(([key, meta]) => (
                <li key={key} className={cn("text-sm flex items-start gap-2", theme.textSecondary)}>
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span>
                    <span className="font-semibold" style={{ color: meta.color }}>{meta.label}</span>
                    {" — "}
                    {key === "active"      && "System is fully operational and accessible."}
                    {key === "inactive"    && "System is offline or not accepting requests."}
                    {key === "maintenance" && "System is undergoing scheduled maintenance."}
                    {key === "restricted"  && "Access is limited to authorized users only."}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className={cn("text-sm leading-relaxed", theme.textSecondary)}>
            Rules are evaluated in order. If multiple rules overlap, the first matching rule takes
            precedence. Ensure your rules do not conflict with one another.
          </p>

          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: "#f59e0b12", border: "1px solid #f59e0b25" }}
          >
            <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" style={{ color: "#d97706" }} />
            <p className="text-xs leading-relaxed" style={{ color: "#d97706" }}>
              Changes to time rules take effect immediately. Review your schedule carefully before
              saving to avoid unexpected downtime or access issues.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {(Object.keys(CONDITION_META) as ConditionKey[]).map((k) => {
              const count = rules.filter((r) => r.condition === k).length;
              const meta = CONDITION_META[k];
              return (
                <div
                  key={k}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                  style={{ backgroundColor: meta.bg }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
                  <span className="text-xs font-medium flex-1" style={{ color: meta.color }}>{meta.label}</span>
                  <span className="text-sm font-bold" style={{ color: meta.color }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Timesandcondition;