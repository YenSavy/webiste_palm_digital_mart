import React, { useState } from "react";
import {
  Save, X, User, Mail, Phone, CreditCard,
  Building2, GitBranch, Warehouse, Briefcase, DollarSign,
  ChevronRight, Globe, MapPin, Upload, FileText, ChevronDown,
  Plus, Trash2, Pencil, Search,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";



type Category = "company" | "branch" | "warehouse" | "position" | "currency";

interface ListItem {
  id: string;
  nameKm: string;
  nameEn: string;
  extra?: string;
}

const MOCK_DATA: Record<Category, ListItem[]> = {
  company: [
    { id: "c1", nameKm: "ក្រុមហ៊ុន អេ", nameEn: "Company A", extra: "+855 12 000 001" },
    { id: "c2", nameKm: "ក្រុមហ៊ុន បេ", nameEn: "Company B", extra: "+855 12 000 002" },
  ],
  branch: [
    { id: "b1", nameKm: "សាខាភ្នំពេញ",  nameEn: "Phnom Penh Branch", extra: "ភ្នំពេញ" },
    { id: "b2", nameKm: "សាខាសៀមរាប", nameEn: "Siem Reap Branch",  extra: "សៀមរាប" },
  ],
  warehouse: [
    { id: "w1", nameKm: "ឃ្លាំងកណ្តាល", nameEn: "Central Warehouse", extra: "ភ្នំពេញ" },
  ],
  position: [
    { id: "p1", nameKm: "អ្នកគ្រប់គ្រង", nameEn: "Manager",    extra: "Management" },
    { id: "p2", nameKm: "អ្នកលក់",        nameEn: "Salesperson", extra: "Sales" },
    { id: "p3", nameKm: "គណនេយ្យករ",    nameEn: "Accountant",  extra: "Finance" },
  ],
  currency: [
    { id: "cu1", nameKm: "ដុល្លារ", nameEn: "US Dollar",  extra: "USD · $" },
    { id: "cu2", nameKm: "រៀល",    nameEn: "Khmer Riel", extra: "KHR · ៛" },
    { id: "cu3", nameKm: "បាត",    nameEn: "Thai Baht",  extra: "THB · ฿" },
  ],
};

const CATEGORY_TABS: { key: Category; label: string; icon: React.ReactNode }[] = [
  { key: "company",   label: "Company",   icon: <Building2 size={14} /> },
  { key: "branch",    label: "Branch",    icon: <GitBranch size={14} /> },
  { key: "warehouse", label: "Warehouse", icon: <Warehouse size={14} /> },
  { key: "position",  label: "Position",  icon: <Briefcase size={14} /> },
  { key: "currency",  label: "Currency",  icon: <DollarSign size={14} /> },
];


const PROVINCES = [
  "រាជធានីភ្នំពេញ","ខេត្តកណ្តាល","ខេត្តកំពត","ខេត្តកំពង់ចាម",
  "ខេត្តកំពង់ឆ្នាំង","ខេត្តកំពង់ស្ពឺ","ខេត្តកំពង់ធំ","ខេត្តក្រចេះ",
  "ខេត្តតាកែវ","ខេត្តព្រៃវែង","ខេត្តបន្តាយមានជ័យ","ខេត្តបាត់ដំបង",
  "ខេត្តពោធិ៍សាត់","ខេត្តមណ្ឌលគិរី","ខេត្តរតនគិរី","ខេត្តស្វាយរៀង",
  "ខេត្តសៀមរាប","ខេត្តស្ទឹងត្រែង","ខេត្តឧត្តរមានជ័យ","ខេត្តកែប",
  "ខេត្តប៉ៃលិន","ខេត្តត្បូងឃ្មុំ",
];
const DISTRICTS: Record<string, string[]> = {
  "រាជធានីភ្នំពេញ": ["ខណ្ឌចំការមន","ខណ្ឌដូនពេញ","ខណ្ឌ៧មករា","ខណ្ឌទួលគោក","ខណ្ឌបឹងកេងកង","ខណ្ឌមានជ័យ"],
  "ខេត្តកណ្តាល":    ["ស្រុកកណ្តាលស្ទឹង","ស្រុកកោះថោម","ស្រុកខ្សាច់កណ្តាល"],
};
const COMMUNES: Record<string, string[]> = {
  "ខណ្ឌចំការមន": ["សង្កាត់បឹងរាំង","សង្កាត់ចំការមន","សង្កាត់ទន្លេបាសាក់"],
  "ខណ្ឌដូនពេញ":  ["សង្កាត់ភ្នំពេញថ្មី","សង្កាត់វត្តភ្នំ","សង្កាត់ចតុមុខ"],
};


const InputField: React.FC<{
  label: string; required?: boolean; icon?: React.ReactNode;
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; className?: string; theme: any;
}> = ({ label, required, icon, value, onChange, placeholder, type = "text", className, theme }) => (
  <div className={className}>
    <label className={cn("block text-xs font-semibold uppercase tracking-wide mb-1.5", theme.textSecondary)}>
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={cn("w-full py-2 rounded-lg border text-sm outline-none transition", theme.border, theme.text, icon ? "pl-9 pr-3" : "px-3")}
        style={{ backgroundColor: `${theme.accent}08` }} />
    </div>
  </div>
);

const SelectField: React.FC<{
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string; className?: string; disabled?: boolean; theme: any;
}> = ({ label, required, value, onChange, options, placeholder, className, disabled, theme }) => (
  <div className={className}>
    <label className={cn("block text-xs font-semibold uppercase tracking-wide mb-1.5", theme.textSecondary)}>
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        className={cn("w-full px-3 py-2 rounded-lg border text-sm outline-none transition appearance-none", theme.border, theme.text, disabled && "opacity-50 cursor-not-allowed")}
        style={{ backgroundColor: `${theme.accent}08` }}>
        <option value="" disabled>{placeholder || "-- ជ្រើសរើស --"}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
);


const CompanyForm: React.FC<{ theme: any; item?: ListItem }> = ({ theme, item }) => {
  const [nameKm, setNameKm] = useState(item?.nameKm || "");
  const [nameEn, setNameEn] = useState(item?.nameEn || "");
  const [phone, setPhone]   = useState(item?.extra  || "");
  const [email, setEmail]   = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [commune, setCommune]   = useState("");
  const [streetNo, setStreetNo] = useState("");
  const [houseNo, setHouseNo]   = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles]       = useState<{ name: string; size: number }[]>([]);

  const districts = province ? (DISTRICTS[province] || []) : [];
  const communes  = district ? (COMMUNES[district]  || []) : [];
  const handleFiles = (fl: FileList | null) => {
    if (!fl) return;
    const allowed = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","image/jpeg","image/png"];
    setFiles(p => [...p, ...Array.from(fl).filter(f => allowed.includes(f.type) && f.size <= 10*1024*1024).map(f => ({ name: f.name, size: f.size }))]);
  };
  const fmtSize = (b: number) => b < 1024*1024 ? `${(b/1024).toFixed(0)} KB` : `${(b/1024/1024).toFixed(1)} MB`;
  const sec = (icon: React.ReactNode, title: string) => (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: `${theme.accent}20` }}>
      <span style={{ color: theme.accent }}>{icon}</span>
      <h3 className={cn("text-sm font-bold", theme.text)}>{title}</h3>
    </div>
  );
  return (
    <div className="space-y-5">
      <div>
        {sec(<Building2 size={15}/>, "Company Information")}
        <div className="grid grid-cols-2 gap-3">
          <InputField label="ឈ្មោះ (ខ្មែរ)" required icon={<Building2 size={13}/>} value={nameKm} onChange={setNameKm} placeholder="ឈ្មោះក្រុមហ៊ុន" theme={theme}/>
          <InputField label="Name (EN)" required icon={<Globe size={13}/>} value={nameEn} onChange={setNameEn} placeholder="Company Name" theme={theme}/>
          <InputField label="Phone" icon={<Phone size={13}/>} value={phone} onChange={setPhone} placeholder="+855 12 345 678" type="tel" theme={theme}/>
          <InputField label="Email" icon={<Mail size={13}/>} value={email} onChange={setEmail} placeholder="company@example.com" type="email" theme={theme}/>
          <InputField label="Address (English)" required icon={<MapPin size={13}/>} value={address} onChange={setAddress} placeholder="Full address in English" className="col-span-2" theme={theme}/>
        </div>
      </div>
      <div>
        {sec(<FileText size={15}/>, "Company Documents")}
        <div onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)}
          onDrop={e=>{e.preventDefault();setDragOver(false);handleFiles(e.dataTransfer.files)}}
          onClick={()=>document.getElementById("cf-file-input")?.click()}
          className={cn("border-2 border-dashed rounded-xl py-5 flex flex-col items-center cursor-pointer transition-all", dragOver?"border-blue-400 bg-blue-50":"hover:border-blue-300")}
          style={{ borderColor: dragOver?undefined:`${theme.accent}30`, backgroundColor: dragOver?undefined:`${theme.accent}04` }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${theme.accent}15` }}>
            <Upload size={14} style={{ color: theme.accent }}/>
          </div>
          <p className={cn("text-xs font-semibold", theme.text)}>Drop file or click to browse</p>
          <p className={cn("text-xs mt-0.5", theme.textSecondary)}>PDF, DOC, DOCX, JPG, PNG · Max 10MB</p>
          <input id="cf-file-input" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" onChange={e=>handleFiles(e.target.files)}/>
        </div>
        {files.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {files.map((f,i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg border" style={{ borderColor:`${theme.accent}20`, backgroundColor:`${theme.accent}06` }}>
                <div className="flex items-center gap-2">
                  <FileText size={13} style={{ color: theme.accent }}/>
                  <span className={cn("text-xs font-medium truncate max-w-[180px]", theme.text)}>{f.name}</span>
                  <span className={cn("text-xs", theme.textSecondary)}>{fmtSize(f.size)}</span>
                </div>
                <button onClick={()=>setFiles(p=>p.filter((_,j)=>j!==i))} className="p-1 rounded hover:opacity-70"><X size={12} className="text-red-400"/></button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        {sec(<MapPin size={15}/>, "Location Details")}
        <div className="grid grid-cols-3 gap-3">
          <SelectField label="ខេត្ត/រាជធានី" required value={province} onChange={v=>{setProvince(v);setDistrict("");setCommune("");}} options={PROVINCES} placeholder="-- ជ្រើសរើសខេត្ត --" theme={theme}/>
          <SelectField label="ស្រុក/ខណ្ឌ" required value={district} onChange={v=>{setDistrict(v);setCommune("");}} options={districts} placeholder="-- ជ្រើសរើសស្រុក --" disabled={!province} theme={theme}/>
          <SelectField label="សង្កាត់/ឃុំ" required value={commune} onChange={setCommune} options={communes} placeholder="-- ជ្រើសរើសសង្កាត់ --" disabled={!district} theme={theme}/>
          <SelectField label="ភូមិ/សង្កាត់" required value="" onChange={()=>{}} options={[]} placeholder="-- ជ្រើសរើសភូមិ --" disabled={!commune} theme={theme}/>
          <InputField label="លេខផ្លូវ" required value={streetNo} onChange={setStreetNo} placeholder="ផ្លូវ ១២៣" theme={theme}/>
          <InputField label="លេខផ្ទះ" required value={houseNo} onChange={setHouseNo} placeholder="ផ្ទះ ៤៥" theme={theme}/>
        </div>
      </div>
    </div>
  );
};

const BranchForm: React.FC<{ theme: any; item?: ListItem }> = ({ theme, item }) => {
  const [nameKm, setNameKm]     = useState(item?.nameKm || "");
  const [nameEn, setNameEn]     = useState(item?.nameEn || "");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [telegram, setTelegram] = useState("");
  const [address, setAddress]   = useState("");
  const [lat, setLat]           = useState("");
  const [lng, setLng]           = useState("");
  const [getting, setGetting]   = useState(false);
  const getLocation = () => {
    if (!navigator.geolocation) return;
    setGetting(true);
    navigator.geolocation.getCurrentPosition(pos => {
      setLat(pos.coords.latitude.toString()); setLng(pos.coords.longitude.toString()); setGetting(false);
    }, () => setGetting(false));
  };
  const sec = (icon: React.ReactNode, title: string, action?: React.ReactNode) => (
    <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor:`${theme.accent}20` }}>
      <div className="flex items-center gap-2"><span style={{ color: theme.accent }}>{icon}</span><h3 className={cn("text-sm font-bold", theme.text)}>{title}</h3></div>
      {action}
    </div>
  );
  return (
    <div className="space-y-5">
      <div>
        {sec(<GitBranch size={15}/>, "Branch Information")}
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Branch Name (Khmer)" required icon={<GitBranch size={13}/>} value={nameKm} onChange={setNameKm} placeholder="ឈ្មោះសាខា" theme={theme}/>
          <InputField label="Branch Name (English)" required icon={<Building2 size={13}/>} value={nameEn} onChange={setNameEn} placeholder="New Branch" theme={theme}/>
          <InputField label="Branch Email" icon={<Mail size={13}/>} value={email} onChange={setEmail} placeholder="branch@example.com" type="email" theme={theme}/>
          <InputField label="Branch Phone" icon={<Phone size={13}/>} value={phone} onChange={setPhone} placeholder="0123456789" type="tel" theme={theme}/>
          <InputField label="Telegram" icon={<span className="text-xs font-bold" style={{ color:theme.accent }}>✈</span>} value={telegram} onChange={setTelegram} placeholder="@branchtelegram" theme={theme}/>
        </div>
        <div className="mt-3">
          <label className={cn("block text-xs font-semibold uppercase tracking-wide mb-1.5", theme.textSecondary)}>Branch Address (English)</label>
          <div className="relative">
            <MapPin size={13} className="absolute left-3 top-3 text-gray-400"/>
            <textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="Street 123" rows={3}
              className={cn("w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none resize-none transition", theme.border, theme.text)}
              style={{ backgroundColor:`${theme.accent}08` }}/>
          </div>
        </div>
      </div>
      <div>
        {sec(<MapPin size={15}/>, "Location Coordinates",
          <button onClick={getLocation} disabled={getting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition hover:opacity-80 disabled:opacity-50"
            style={{ borderColor:`${theme.accent}40`, color:theme.accent, backgroundColor:`${theme.accent}08` }}>
            <MapPin size={12}/>{getting ? "Getting..." : "Get Location"}
          </button>
        )}
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Latitude"  value={lat} onChange={setLat} placeholder="11.562108"  type="number" theme={theme}/>
          <InputField label="Longitude" value={lng} onChange={setLng} placeholder="104.888535" type="number" theme={theme}/>
        </div>
      </div>
    </div>
  );
};

const SimpleForm: React.FC<{ category: Category; theme: any; item?: ListItem }> = ({ category, theme, item }) => {
  const [nameKm, setNameKm] = useState(item?.nameKm || "");
  const [nameEn, setNameEn] = useState(item?.nameEn || "");
  const [extra, setExtra]   = useState(item?.extra  || "");
  const [desc, setDesc]     = useState("");
  const [code, setCode]     = useState("");
  const [symbol, setSymbol] = useState("");
  const [rate, setRate]     = useState("");
  const [base, setBase]     = useState("");

  if (category === "warehouse") return (
    <div className="space-y-3">
      <InputField label="ឈ្មោះ (ខ្មែរ)" required value={nameKm} onChange={setNameKm} placeholder="ឈ្មោះឃ្លាំង" theme={theme}/>
      <InputField label="Name (EN)" required value={nameEn} onChange={setNameEn} placeholder="Warehouse Name" theme={theme}/>
      <InputField label="Address" value={extra} onChange={setExtra} placeholder="Warehouse address" theme={theme}/>
      <div>
        <label className={cn("text-xs font-semibold uppercase tracking-wide mb-1.5 block", theme.textSecondary)}>Description</label>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Short description..." rows={3}
          className={cn("w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none", theme.border, theme.text)}
          style={{ backgroundColor:`${theme.accent}08` }}/>
      </div>
    </div>
  );
  if (category === "position") return (
    <div className="space-y-3">
      <InputField label="តួនាទី (ខ្មែរ)" required value={nameKm} onChange={setNameKm} placeholder="ឈ្មោះតួនាទី" theme={theme}/>
      <InputField label="Position (EN)" required value={nameEn} onChange={setNameEn} placeholder="Position name" theme={theme}/>
      <div>
        <label className={cn("text-xs font-semibold uppercase tracking-wide mb-1.5 block", theme.textSecondary)}>Description</label>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Role description..." rows={3}
          className={cn("w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none", theme.border, theme.text)}
          style={{ backgroundColor:`${theme.accent}08` }}/>
      </div>
    </div>
  );
  if (category === "currency") return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Code"   required value={code}   onChange={setCode}   placeholder="USD" theme={theme}/>
        <InputField label="Symbol" required value={symbol} onChange={setSymbol} placeholder="$"   theme={theme}/>
      </div>
      <InputField label="Currency Name" required value={nameEn} onChange={setNameEn} placeholder="US Dollar" theme={theme}/>
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Rate" value={rate} onChange={setRate} placeholder="4100" type="number" theme={theme}/>
        <InputField label="Base" value={base} onChange={setBase} placeholder="1"    type="number" theme={theme}/>
      </div>
    </div>
  );
  return null;
};


const ItemDialog: React.FC<{
  open: boolean; onClose: () => void; theme: any;
  category: Category; item?: ListItem; mode: "add" | "edit";
}> = ({ open, onClose, theme, category, item, mode }) => {
  if (!open) return null;
  const cat = CATEGORY_TABS.find(c => c.key === category)!;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: theme.bg || "#ffffff", maxHeight:"90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor:`${theme.accent}20` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: theme.accent }}>
              {cat.icon}
            </div>
            <div>
              <h2 className={cn("text-base font-bold", theme.text)}>{mode === "add" ? `Add ${cat.label}` : `Edit ${cat.label}`}</h2>
              <p className={cn("text-xs", theme.textSecondary)}>{mode === "add" ? "បន្ថែមទិន្នន័យថ្មី" : "កែប្រែទិន្នន័យ"}</p>
            </div>
          </div>
          <button onClick={onClose} className={cn("p-2 rounded-lg hover:opacity-70 transition", theme.text)} style={{ backgroundColor:`${theme.accent}10` }}>
            <X size={18}/>
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 p-5 overflow-y-auto">
          {category === "company"   && <CompanyForm theme={theme} item={item}/>}
          {category === "branch"    && <BranchForm  theme={theme} item={item}/>}
          {(category === "warehouse" || category === "position" || category === "currency") &&
            <SimpleForm category={category} theme={theme} item={item}/>}
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t flex-shrink-0" style={{ borderColor:`${theme.accent}20` }}>
          <button onClick={onClose} className={cn("px-5 py-2 rounded-lg text-sm font-semibold border", theme.border, theme.text)} style={{ backgroundColor:`${theme.accent}0a` }}>
            Cancel
          </button>
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-2 hover:opacity-90 transition" style={{ backgroundColor: theme.accent }}>
            <Save size={14}/> {mode === "add" ? "Add" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};


const DeleteDialog: React.FC<{
  open: boolean; onClose: () => void; onConfirm: () => void; theme: any; name: string;
}> = ({ open, onClose, onConfirm, theme, name }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl p-6" style={{ backgroundColor: theme.bg || "#ffffff" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
            <Trash2 size={18} className="text-red-500"/>
          </div>
          <div>
            <h3 className={cn("text-sm font-bold", theme.text)}>Confirm Delete</h3>
            <p className={cn("text-xs", theme.textSecondary)}>សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ</p>
          </div>
        </div>
        <p className={cn("text-sm mb-5", theme.text)}>
          តើអ្នកប្រាកដថាចង់លុប <span className="font-semibold">"{name}"</span> មែនទេ?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className={cn("px-4 py-2 rounded-lg text-sm font-semibold border", theme.border, theme.text)} style={{ backgroundColor:`${theme.accent}0a` }}>
            Cancel
          </button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


const CompanyInfoList: React.FC<{ theme: any }> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<Category>("company");
  const [data, setData]           = useState(MOCK_DATA);
  const [search, setSearch]       = useState("");
  const [dialog, setDialog]       = useState<{ open: boolean; mode: "add" | "edit"; item?: ListItem }>({ open: false, mode: "add" });
  const [delDlg, setDelDlg]       = useState<{ open: boolean; item?: ListItem }>({ open: false });

  const items = data[activeTab].filter(i =>
    i.nameKm.includes(search) || i.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const doDelete = (id: string) =>
    setData(prev => ({ ...prev, [activeTab]: prev[activeTab].filter(i => i.id !== id) }));

  const catIcon = CATEGORY_TABS.find(c => c.key === activeTab)?.icon;
  const catLabel = CATEGORY_TABS.find(c => c.key === activeTab)?.label;

  return (
    <>
      <ItemDialog
        open={dialog.open} onClose={() => setDialog({ open: false, mode: "add" })}
        theme={theme} category={activeTab} item={dialog.item} mode={dialog.mode}
      />
      <DeleteDialog
        open={delDlg.open} onClose={() => setDelDlg({ open: false })}
        onConfirm={() => delDlg.item && doDelete(delDlg.item.id)}
        theme={theme} name={delDlg.item?.nameEn || ""}
      />

      <div className={cn("rounded-2xl border overflow-hidden", theme.border)} style={{ backgroundColor:`${theme.accent}06` }}>

        {/* Panel header */}
        <div className="px-5 pt-5 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn("text-lg font-semibold", theme.text)}>Company Information</h2>
            <button
              onClick={() => setDialog({ open: true, mode: "add" })}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition"
              style={{ backgroundColor: theme.accent }}>
              <Plus size={13}/> Add New
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex gap-0.5 overflow-x-auto">
            {CATEGORY_TABS.map(tab => (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearch(""); }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2"
                style={activeTab === tab.key
                  ? { backgroundColor:`${theme.accent}12`, color: theme.accent, borderBottomColor: theme.accent }
                  : { backgroundColor: "transparent", color: theme.textColor || "#94a3b8", borderBottomColor: "transparent" }}>
                {tab.icon}
                {tab.label}
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={activeTab === tab.key
                    ? { backgroundColor: theme.accent, color: "#fff" }
                    : { backgroundColor:`${theme.accent}15`, color: theme.accent }}>
                  {data[tab.key].length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px" style={{ backgroundColor:`${theme.accent}20` }}/>

        {/* Search */}
        <div className="px-5 py-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${catLabel}...`}
              className={cn("w-full pl-8 pr-3 py-2 rounded-lg border text-xs outline-none transition", theme.border, theme.text)}
              style={{ backgroundColor:`${theme.accent}08` }}/>
          </div>
        </div>

        {/* List */}
        <div className="px-5 pb-5 space-y-2 min-h-[120px]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor:`${theme.accent}10` }}>
                <span style={{ color:`${theme.accent}60` }}>{catIcon}</span>
              </div>
              <p className={cn("text-sm", theme.textSecondary)}>No {catLabel} found</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all hover:shadow-sm"
                style={{ borderColor:`${theme.accent}18`, backgroundColor:`${theme.accent}04` }}>

                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
                    style={{ backgroundColor: theme.accent }}>
                    {catIcon}
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-sm font-semibold truncate", theme.text)}>{item.nameEn}</p>
                    <p className={cn("text-xs truncate", theme.textSecondary)}>
                      {item.nameKm}{item.extra ? ` · ${item.extra}` : ""}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                  <button
                    onClick={() => setDialog({ open: true, mode: "edit", item })}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition hover:opacity-80"
                    style={{ borderColor:`${theme.accent}30`, color: theme.accent, backgroundColor:`${theme.accent}08` }}>
                    <Pencil size={11}/> Edit
                  </button>
                  <button
                    onClick={() => setDelDlg({ open: true, item })}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition hover:opacity-80"
                    style={{ borderColor:"#fca5a5", color:"#ef4444", backgroundColor:"#fef2f2" }}>
                    <Trash2 size={11}/> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};



const ProfileInfor: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());
  const user  = useAuthStore((state) => state.user);
  const paymentLast4  = "3805";
  const paymentExpiry = "0231";

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Account Information */}
        <div className={cn("rounded-2xl border p-6", theme.border)} style={{ backgroundColor:`${theme.accent}06` }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className={cn("text-lg font-semibold", theme.text)}>Account Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className={cn("text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1.5", theme.textSecondary)}><User size={12}/> Name</label>
              <p className={cn("text-sm font-medium", theme.text)}>{user?.full_name || user?.name || "—"}</p>
            </div>
            <div>
              <label className={cn("text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1.5", theme.textSecondary)}><Mail size={12}/> Email</label>
              <p className={cn("text-sm font-medium", theme.text)}>{user?.email || "—"}</p>
            </div>
            <div>
              <label className={cn("text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1.5", theme.textSecondary)}><Phone size={12}/> Phone number</label>
              <p className={cn("text-sm font-medium", theme.text)}>{user?.phone || "—"}</p>
            </div>
          </div>
        </div>

        {/* Payment Method — no edit */}
        <div className={cn("rounded-2xl border p-6", theme.border)} style={{ backgroundColor:`${theme.accent}06` }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className={cn("text-lg font-semibold", theme.text)}>Payment Method</h2>
          </div>
          <div className={cn("rounded-xl border p-4 flex items-center gap-4", theme.border)} style={{ backgroundColor:`${theme.accent}0a` }}>
            <div className="w-16 h-10 rounded-md flex items-center justify-center font-bold text-lg tracking-widest"
              style={{ backgroundColor:`${theme.accent}18`, color: theme.accent }}>VISA</div>
            <div>
              <p className={cn("text-sm font-semibold flex items-center gap-2", theme.text)}><CreditCard size={14}/> Visa **** {paymentLast4}</p>
              <p className={cn("text-xs mt-0.5", theme.textSecondary)}>Expires {paymentExpiry}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Company / Branch / Warehouse / Position / Currency list */}
      <CompanyInfoList theme={theme}/>

    </div>
  );
};

export default ProfileInfor;