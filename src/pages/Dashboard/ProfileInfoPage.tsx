import React, { useMemo, useState } from "react";
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
const DEFAULT_COLLECTION_KEYS = ["data", "items", "results", "rows", "list"];
const WRAPPER_ONLY_KEYS = ["data", "status", "success", "message", "error", "meta"];

const getList = (
  payload: unknown,
  preferredKeys: string[] = [],
  depth = 0
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any>[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object" || depth > 4) {
    return [];
  }

  const record = payload as Record<string, unknown>;

  for (const key of [...preferredKeys, ...DEFAULT_COLLECTION_KEYS]) {
    const candidate = record[key];

    if (Array.isArray(candidate)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return candidate as Record<string, any>[];
    }

    const nestedItems = getList(candidate, preferredKeys, depth + 1);
    if (nestedItems.length > 0) {
      return nestedItems;
    }
  }

  for (const value of Object.values(record)) {
    if (Array.isArray(value)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return value as Record<string, any>[];
    }
  }

  const keys = Object.keys(record);
  const hasOnlyWrapperFields =
    keys.length > 0 && keys.every((key) => WRAPPER_ONLY_KEYS.includes(key));

  if (hasOnlyWrapperFields) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return keys.length > 0 ? [record as Record<string, any>] : [];
};

const toStringValue = (...values: unknown[]) => {
  const found = values.find(
    (value) =>
      value !== null &&
      value !== undefined &&
      String(value).trim().length > 0
  );

  return found === undefined || found === null ? "" : String(found);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeBranchItem = (item: Record<string, any>) => {
  const itemId = toStringValue(item.id, item.branch_id, item.branch_code);
  const branchId = toStringValue(item.branch_id, item.branch_code, item.id);
  const branchCode = toStringValue(item.branch_code, item.branch_id, item.id);
  const branchEn = toStringValue(
    item.branch_en,
    item.branch_name_en,
    item.name_en,
    item.name
  );
  const branchKm = toStringValue(
    item.branch_km,
    item.branch_name_km,
    item.name_kh,
    item.name_km
  );
  const branchPhone = toStringValue(item.phone, item.branch_phone);
  const telegram = toStringValue(
    item.telegram,
    item.telegram_username,
    item.telegram_url
  );
  const branchEmail = toStringValue(item.email, item.branch_email);
  const branchAddressEn = toStringValue(
    item.address_en,
    item.branch_address_en,
    item.address
  );
  const latitude = toStringValue(item.latitude, item.lat);
  const longitude = toStringValue(item.longitude, item.lng);

  return {
    ...item,
    id: itemId,
    branch_id: branchId,
    branch_code: branchCode,
    branch_en: branchEn,
    branch_km: branchKm,
    branch_name_en: branchEn,
    branch_name_km: branchKm,
    email: branchEmail,
    branch_email: branchEmail,
    phone: branchPhone,
    branch_phone: branchPhone,
    address_en: branchAddressEn,
    branch_address_en: branchAddressEn,
    telegram,
    latitude,
    longitude,
    lat: latitude,
    lng: longitude,
    branch_contact: toStringValue(branchPhone, telegram, branchEmail),
  };
};

const buildBranchUpdatePayload = (data: Record<string, string>) => {
  const branchEn = toStringValue(data.branch_en, data.branch_name_en);
  const branchKm = toStringValue(data.branch_km, data.branch_name_km);
  const email = toStringValue(data.email, data.branch_email);
  const phone = toStringValue(data.phone, data.branch_phone);
  const addressEn = toStringValue(data.address_en, data.branch_address_en);
  const latitude = toStringValue(data.latitude, data.lat);
  const longitude = toStringValue(data.longitude, data.lng);
  const telegram = toStringValue(data.telegram);

  return {
    ...data,
    branch_en: branchEn,
    branch_km: branchKm,
    email,
    phone,
    address_en: addressEn,
    latitude,
    longitude,
    telegram,
    branch_name_en: branchEn,
    branch_name_km: branchKm,
    branch_email: email,
    branch_phone: phone,
    branch_address_en: addressEn,
    lat: latitude,
    lng: longitude,
  };
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
  branch: (id: string, data: Record<string, string>) => {
    const payload = buildBranchUpdatePayload(data);
    return axiosInstance
      .put(`/branches/update/${id}`, payload, { params: payload })
      .then((r) => r.data);
  },
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: Record<string, any>;
  idKey: string;
  fields: FieldDef[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (id: string, data: Record<string, string>) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetcher: () => Promise<any>;
  idKey: string;
  fields: FieldDef[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updater: (id: string, data: Record<string, string>) => Promise<any>;
  titleKey: string;
  subtitleKey?: string;
  collectionKeys?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  normalizeItem?: (item: Record<string, any>) => Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
  emptyLabel: string;
}

const TabSection: React.FC<TabSectionProps> = ({
  queryKey,
  fetcher,
  idKey,
  fields,
  updater,
  titleKey,
  subtitleKey,
  collectionKeys = [],
  normalizeItem,
  theme,
  emptyLabel,
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

  const items = useMemo(
    () =>
      getList(raw, collectionKeys).map((item) =>
        normalizeItem ? normalizeItem(item) : item
      ),
    [collectionKeys, normalizeItem, raw]
  );

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <div className="space-y-3"> {items.map((item: any, i: number) => (
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
    collectionKeys: ["companies", "company"],
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
    idKey: "id",
    titleKey: "branch_en",
    subtitleKey: "branch_contact",
    collectionKeys: ["branches", "branch"],
    normalizeItem: normalizeBranchItem,
    fields: [
      { key: "branch_en",  label: "Name (EN)", placeholder: "Branch name in English" },
      { key: "branch_km",  label: "Name (KH)", placeholder: "Branch name in Khmer" },
      { key: "email",      label: "Email",     placeholder: "branch@example.com" },
      { key: "phone",      label: "Phone",     placeholder: "+855 ..." },
      { key: "telegram",   label: "Telegram",  placeholder: "Telegram contact" },
      { key: "address_en", label: "Address",   placeholder: "Full branch address" },
      { key: "latitude",   label: "Latitude",  placeholder: "11.562108" },
      { key: "longitude",  label: "Longitude", placeholder: "104.888535" },
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
    collectionKeys: ["warehouses", "warehouse"],
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
    collectionKeys: ["positions", "position"],
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
    collectionKeys: ["currencies", "currency"],
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
          collectionKeys={cfg.collectionKeys}
          normalizeItem={cfg.normalizeItem}
          theme={theme}
          emptyLabel={cfg.emptyLabel}
        />
      </section>
    </div>
  );
};

export default ProfileInfoPage;
