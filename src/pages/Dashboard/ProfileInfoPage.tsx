import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { cn } from "../../lib/utils";
import {
  Building2, GitBranch, Warehouse, Briefcase, DollarSign,
  Pencil, Save, X, Loader2, AlertCircle, CheckCircle2, RefreshCw,
} from "lucide-react";
import axiosInstance from "../../lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getList = (res: any): any[] => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (res?.data && typeof res.data === "object" && !Array.isArray(res.data)) return [res.data];
  return [];
};

// ─── Inline API helpers ───────────────────────────────────────────────────────
const fetchers = {
  companies: () => axiosInstance.get("/company/list").then((r) => r.data),
  branches: () => axiosInstance.get("/branches").then((r) => r.data),
  warehouses: () => axiosInstance.get("/warehouse").then((r) => r.data),
  positions: () => axiosInstance.get("/position").then((r) => r.data),
  currencies: () => axiosInstance.get("/currency").then((r) => r.data),
};

const updaters = {
  company: (id: string, data: Record<string, string>) =>
    axiosInstance.put(`/company/update/${id}`, null, { params: data }).then((r) => r.data),
  branch: (id: string, data: Record<string, string>) =>
    axiosInstance.put(`/branches/update/${id}`, null, { params: data }).then((r) => r.data),
  warehouse: (id: string, data: Record<string, string>) =>
    axiosInstance.put(`/warehouse/update/${id}`, null, { params: data }).then((r) => r.data),
  position: (id: string, data: Record<string, string>) =>
    axiosInstance.put(`/position/update/${id}`, null, { params: data }).then((r) => r.data),
  currency: (id: string, data: Record<string, string>) =>
    axiosInstance.put(`/currency/update/${id}`, null, { params: data }).then((r) => r.data),
};

// ─── Types ────────────────────────────────────────────────────────────────────
// key       = PUT API param name  (used when sending update)
// displayKey = GET API field name (used when reading from the list response)
//              defaults to key if not provided
type FieldDef = {
  key: string;
  displayKey?: string;
  label: string;
  placeholder?: string;
};

interface EditableCardProps {
  item: Record<string, any>;
  idKey: string;
  fields: FieldDef[];
  onUpdate: (id: string, data: Record<string, string>) => Promise<any>;
  theme: any;
  title: string;
  subtitle?: string;
}

// ─── Editable Card ────────────────────────────────────────────────────────────
const EditableCard: React.FC<EditableCardProps> = ({
  item, idKey, fields, onUpdate, theme, title, subtitle,
}) => {
  // Initialise form state using displayKey for reading current values
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((f) => [f.key, String(item[f.displayKey ?? f.key] ?? "")])
    )
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    setEditing(false);
    setError(null);
    setForm(
      Object.fromEntries(
        fields.map((f) => [f.key, String(item[f.displayKey ?? f.key] ?? "")])
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onUpdate(String(item[idKey]), form);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={cn("rounded-xl border transition-all duration-200", theme.border)}
      style={{ backgroundColor: `${theme.accent}06` }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between px-5 pt-4 pb-3">
        <div>
          <p className={cn("font-semibold text-sm", theme.text)}>{title}</p>
          {subtitle && (
            <p className={cn("text-xs mt-0.5", theme.textSecondary)}>{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
              <CheckCircle2 size={14} /> Saved
            </span>
          )}
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${theme.accent}35`)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = `${theme.accent}20`)}
            >
              <Pencil size={12} /> Edit
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ backgroundColor: `${theme.accent}12`, color: theme.textSecondary }}
            >
              <X size={12} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* View mode — read using displayKey */}
      {!editing && (
        <div className="px-5 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
          {fields.map((f) => (
            <div key={f.key} className="min-w-0">
              <span className={cn("block text-xs", theme.textSecondary)}>{f.label}</span>
              <span className={cn("block text-xs font-medium truncate mt-0.5", theme.text)}>
                {String(item[f.displayKey ?? f.key] ?? "—")}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Edit mode — form pre-filled from displayKey, saved using key */}
      {editing && (
        <div className="px-5 pb-5">
          <div
            className="rounded-xl p-4 space-y-4 border"
            style={{ borderColor: `${theme.accent}25`, backgroundColor: `${theme.accent}04` }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label
                    className={cn(
                      "block text-xs font-semibold uppercase tracking-wide mb-1.5",
                      theme.textSecondary
                    )}
                  >
                    {f.label}
                  </label>
                  <input
                    value={form[f.key] ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                    }
                    placeholder={f.placeholder ?? f.label}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all",
                      theme.border,
                      theme.text
                    )}
                    style={{ backgroundColor: `${theme.accent}08` }}
                  />
                </div>
              ))}
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle size={13} /> {error}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)`,
                }}
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Tab section ──────────────────────────────────────────────────────────────
interface TabSectionProps {
  queryKey: string;
  fetcher: () => Promise<any>;
  idKey: string;
  fields: FieldDef[];
  updater: (id: string, data: Record<string, string>) => Promise<any>;
  titleKey: string;
  subtitleKey?: string;
  theme: any;
  emptyLabel: string;
}

const TabSection: React.FC<TabSectionProps> = ({
  queryKey, fetcher, idKey, fields, updater, titleKey, subtitleKey, theme, emptyLabel,
}) => {
  const qc = useQueryClient();
  // Scope every cache key to the current user so user B never sees user A's cached data
  const { user } = useAuthStore();
  const userId = user?.email ?? user?.phone ?? "guest";
  const scopedKey = [queryKey, userId];

  const { data: raw, isLoading, isError, refetch } = useQuery({
    queryKey: scopedKey,
    queryFn: fetcher,
  });

  const items = getList(raw);

  const handleUpdate = async (id: string, data: Record<string, string>) => {
    await updater(id, data);
    qc.invalidateQueries({ queryKey: scopedKey });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={30} className="animate-spin" style={{ color: theme.accent }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle size={36} className="text-red-400" />
        <p className={cn("text-sm font-medium", theme.textSecondary)}>Failed to load data.</p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium"
          style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
        >
          <RefreshCw size={13} /> Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2">
        <p className={cn("text-sm font-medium", theme.textSecondary)}>{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item: any, i: number) => (
        <EditableCard
          key={String(item[idKey] ?? i)}
          item={item}
          idKey={idKey}
          fields={fields}
          onUpdate={handleUpdate}
          theme={theme}
          title={String(item[titleKey] ?? `Item ${i + 1}`)}
          subtitle={subtitleKey ? String(item[subtitleKey] ?? "") : undefined}
        />
      ))}
    </div>
  );
};

// ─── Tab config ───────────────────────────────────────────────────────────────
// Company GET response fields:   company_code, company_name_en, company_name_km,
//   company_email, company_phone, address_en, home_str, road_str
// Company PUT params:             company_name_en, company_name_local,
//   email, phone, address_english, home_str_number, road_str_number, village
//
// Warehouse GET response fields:  id, name_en, name_kh, address, note
// Warehouse PUT params:           warehouse_en, warehouse_km, address, description
const TAB_CONFIG: Record<
  string,
  TabSectionProps & { label: string; icon: React.ElementType }
> = {
  company: {
    label: "Company",
    icon: Building2,
    queryKey: "profile-companies",
    fetcher: fetchers.companies,
    idKey: "company_code",
    titleKey: "company_name_en",
    subtitleKey: "company_phone",
    fields: [
      { displayKey: "company_name_en",  key: "company_name_en",   label: "Name (EN)",  placeholder: "Company name in English" },
      { displayKey: "company_name_km",  key: "company_name_local",label: "Name (KH)",  placeholder: "Company name in Khmer" },
      { displayKey: "company_email",    key: "email",             label: "Email",      placeholder: "company@email.com" },
      { displayKey: "company_phone",    key: "phone",             label: "Phone",      placeholder: "+855 ..." },
      { displayKey: "address_en",       key: "address_english",   label: "Address",    placeholder: "Full address" },
      { displayKey: "home_str",         key: "home_str_number",   label: "Home No.",   placeholder: "#123" },
      { displayKey: "road_str",         key: "road_str_number",   label: "Road No.",   placeholder: "Road 123" },
    ],
    updater: (id, data) => updaters.company(id, data),
    emptyLabel: "No company found. Create one from Company Profile.",
    theme: null,
  },
  branch: {
    label: "Branch",
    icon: GitBranch,
    queryKey: "profile-branches",
    fetcher: fetchers.branches,
    idKey: "branch_code",
    titleKey: "branch_name_en",
    subtitleKey: "telegram",
    fields: [
      { key: "branch_name_en", label: "Name (EN)", placeholder: "Branch name in English" },
      { key: "branch_name_km", label: "Name (KH)", placeholder: "Branch name in Khmer" },
      { key: "telegram",       label: "Telegram",  placeholder: "Telegram contact" },
    ],
    updater: (id, data) => updaters.branch(id, data),
    emptyLabel: "No branches found.",
    theme: null,
  },
  warehouse: {
    label: "Warehouse",
    icon: Warehouse,
    queryKey: "profile-warehouses",
    fetcher: fetchers.warehouses,
    idKey: "id",
    titleKey: "name_en",
    subtitleKey: "address",
    fields: [
      { displayKey: "name_en",  key: "warehouse_en",  label: "Name (EN)",  placeholder: "Warehouse name" },
      { displayKey: "name_kh",  key: "warehouse_km",  label: "Name (KH)",  placeholder: "Warehouse name in Khmer" },
      { displayKey: "address",  key: "address",       label: "Address",    placeholder: "Warehouse address" },
      { displayKey: "note",     key: "description",   label: "Notes",      placeholder: "Description" },
    ],
    updater: (id, data) => updaters.warehouse(id, data),
    emptyLabel: "No warehouses found.",
    theme: null,
  },
  position: {
    label: "Position",
    icon: Briefcase,
    queryKey: "profile-positions",
    fetcher: fetchers.positions,
    idKey: "id",
    titleKey: "position_en",
    subtitleKey: "position_km",
    fields: [
      { key: "position_en", label: "Position (EN)", placeholder: "Position name" },
      { key: "position_km", label: "Position (KH)", placeholder: "Position in Khmer" },
    ],
    updater: (id, data) => updaters.position(id, data),
    emptyLabel: "No positions found.",
    theme: null,
  },
  currency: {
    label: "Currency",
    icon: DollarSign,
    queryKey: "profile-currencies",
    fetcher: fetchers.currencies,
    idKey: "currency_id",
    titleKey: "currencyname",
    subtitleKey: "currencycode",
    fields: [
      { key: "currencycode", label: "Code", placeholder: "USD" },
      { key: "currencyname", label: "Name", placeholder: "US Dollar" },
    ],
    updater: (id, data) => updaters.currency(id, data),
    emptyLabel: "No currencies found.",
    theme: null,
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProfileInfoPage: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());
  const [activeTab, setActiveTab] = useState<string>("company");
  const cfg = TAB_CONFIG[activeTab];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header card with tabs */}
      <section
        className={cn(
          `bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6`
        )}
      >
        <div>
          <h1 className={cn("text-2xl font-bold", theme.text)}>Profile Info</h1>
          <p className={cn("mt-1 text-sm", theme.textSecondary)}>
            View and edit your company, branches, warehouses, positions, and currencies.
          </p>
        </div>

        {/* Tab navigation */}
        <div
          className="mt-5 flex items-center gap-1 border-b overflow-x-auto"
          style={{ borderColor: `${theme.accent}22` }}
        >
          {Object.entries(TAB_CONFIG).map(([key, tab]) => {
            const Icon = tab.icon;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all duration-200 whitespace-nowrap"
                style={{
                  borderBottomColor: isActive ? theme.accent : "transparent",
                  color: isActive ? theme.accent : undefined,
                }}
              >
                <Icon
                  size={14}
                  style={{ color: isActive ? theme.accent : undefined }}
                  className={cn(!isActive && theme.textSecondary)}
                />
                <span className={cn(!isActive && theme.textSecondary)}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tab content */}
      <section>
        <TabSection
          key={activeTab}
          queryKey={cfg.queryKey}
          fetcher={cfg.fetcher}
          idKey={cfg.idKey}
          fields={cfg.fields}
          updater={cfg.updater}
          titleKey={cfg.titleKey}
          subtitleKey={cfg.subtitleKey}
          theme={theme}
          emptyLabel={cfg.emptyLabel}
        />
      </section>
    </div>
  );
};

export default ProfileInfoPage;
