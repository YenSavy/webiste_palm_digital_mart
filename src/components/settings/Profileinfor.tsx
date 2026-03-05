import React, { useState } from "react";
import { Edit2, Save, X, User, Mail, Phone, MapPin, CreditCard, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";

const ProfileInfor: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Van Sochan");
  const [address, setAddress] = useState("#9G, Plov Lum, Trapeng Lvea, Sangkat Kakab Khan Por Senchey");
  const [city, setCity] = useState("Phnom Penh, Cambodia 12406");
  const [country, setCountry] = useState("KH");
  const [email, setEmail] = useState("ngogiz99@gmail.com");
  const [phone, setPhone] = useState("855.017900051");

  // Payment method (read-only display)
  const paymentLast4 = "3805";
  const paymentExpiry = "0231";

  const handleSave = () => {
    // TODO: call update profile API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Account Information Card */}
      <div
        className={cn(`rounded-2xl border p-6`, theme.border)}
        style={{ backgroundColor: `${theme.accent}06` }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className={cn("text-lg font-semibold", theme.text)}>Account Information</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: theme.accent }}
            >
              <Edit2 size={14} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: theme.accent }}
              >
                <Save size={14} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border",
                  theme.border,
                  theme.text
                )}
                style={{ backgroundColor: `${theme.accent}0f` }}
              >
                <X size={14} />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className={cn("text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1.5", theme.textSecondary)}>
              <User size={12} />
              Name
            </label>
            {isEditing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(`w-full px-3 py-2 rounded-lg border text-sm ${theme.border} ${theme.text}`)}
                style={{ backgroundColor: `${theme.accent}08` }}
              />
            ) : (
              <p className={cn("text-sm font-medium", theme.text)}>{name}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className={cn("text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1.5", theme.textSecondary)}>
              <MapPin size={12} />
              Address
            </label>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={cn(`w-full px-3 py-2 rounded-lg border text-sm ${theme.border} ${theme.text}`)}
                  style={{ backgroundColor: `${theme.accent}08` }}
                />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={cn(`w-full px-3 py-2 rounded-lg border text-sm ${theme.border} ${theme.text}`)}
                  style={{ backgroundColor: `${theme.accent}08` }}
                />
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={cn(`w-full px-3 py-2 rounded-lg border text-sm ${theme.border} ${theme.text}`)}
                  style={{ backgroundColor: `${theme.accent}08` }}
                />
              </div>
            ) : (
              <div className={cn("text-sm", theme.text)}>
                <p>{address}</p>
                <p>{city}</p>
                <p>{country}</p>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={cn("text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1.5", theme.textSecondary)}>
              <Mail size={12} />
              Email
            </label>
            {isEditing ? (
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className={cn(`w-full px-3 py-2 rounded-lg border text-sm ${theme.border} ${theme.text}`)}
                style={{ backgroundColor: `${theme.accent}08` }}
              />
            ) : (
              <p className={cn("text-sm font-medium", theme.text)}>{email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className={cn("text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1.5", theme.textSecondary)}>
              <Phone size={12} />
              Phone number
            </label>
            {isEditing ? (
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={cn(`w-full px-3 py-2 rounded-lg border text-sm ${theme.border} ${theme.text}`)}
                style={{ backgroundColor: `${theme.accent}08` }}
              />
            ) : (
              <p className={cn("text-sm font-medium", theme.text)}>{phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method Card */}
      <div
        className={cn(`rounded-2xl border p-6`, theme.border)}
        style={{ backgroundColor: `${theme.accent}06` }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className={cn("text-lg font-semibold", theme.text)}>Payment Method</h2>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.accent }}
          >
            <RefreshCw size={14} />
            Update
          </button>
        </div>

        <div
          className={cn(`rounded-xl border p-4 flex items-center gap-4`, theme.border)}
          style={{ backgroundColor: `${theme.accent}0a` }}
        >
          {/* Visa logo placeholder */}
          <div
            className="w-16 h-10 rounded-md flex items-center justify-center font-bold text-lg tracking-widest"
            style={{ backgroundColor: `${theme.accent}18`, color: theme.accent }}
          >
            VISA
          </div>
          <div>
            <p className={cn("text-sm font-semibold flex items-center gap-2", theme.text)}>
              <CreditCard size={14} />
              Visa **** {paymentLast4}
            </p>
            <p className={cn("text-xs mt-0.5", theme.textSecondary)}>Expires {paymentExpiry}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfor;