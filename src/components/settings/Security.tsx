import React, { useState } from "react";
import { Eye, EyeOff, RefreshCw, Lock, Shield, ShieldCheck, KeyRound } from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";

const Security: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    const pwd = Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setNewPassword(pwd);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all password fields." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }
    // TODO: call change password API
    setMessage({ type: "success", text: "Password changed successfully." });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const inputClass = cn(
    `w-full px-3 py-2 rounded-lg border text-sm pr-10 ${theme.border} ${theme.text}`
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Change Password */}
      <div
        className={cn(`rounded-2xl border p-6`, theme.border)}
        style={{ backgroundColor: `${theme.accent}06` }}
      >
        <h2 className={cn("text-lg font-semibold mb-5 flex items-center gap-2", theme.text)}>
          <KeyRound size={18} style={{ color: theme.accent }} />
          Change Password
        </h2>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className={cn("text-xs font-semibold uppercase tracking-wide mb-1.5 block", theme.textSecondary)}>
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
                style={{ backgroundColor: `${theme.accent}08` }}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className={cn("absolute right-3 top-1/2 -translate-y-1/2", theme.textSecondary)}
              >
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className={cn("text-xs font-semibold uppercase tracking-wide mb-1.5 block", theme.textSecondary)}>
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
                style={{ backgroundColor: `${theme.accent}08` }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={generatePassword}
                  title="Generate password"
                  className={cn("hover:opacity-80 transition-opacity", theme.textSecondary)}
                >
                  <RefreshCw size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className={cn(theme.textSecondary)}
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className={cn("text-xs font-semibold uppercase tracking-wide mb-1.5 block", theme.textSecondary)}>
              New Password Confirmation
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                style={{ backgroundColor: `${theme.accent}08` }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className={cn("absolute right-3 top-1/2 -translate-y-1/2", theme.textSecondary)}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Message */}
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

          <button
            onClick={handleChangePassword}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.accent }}
          >
            <Lock size={14} />
            Change Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div
        className={cn(`rounded-2xl border p-6`, theme.border)}
        style={{ backgroundColor: `${theme.accent}06` }}
      >
        <h2 className={cn("text-lg font-semibold mb-2 flex items-center gap-2", theme.text)}>
          <Shield size={18} style={{ color: theme.accent }} />
          Two-factor Authentication
        </h2>

        <div className="space-y-4">
          <div>
            <p className={cn("text-sm font-semibold mb-1", theme.text)}>
              What is Two Factor Verification (2FA)?
            </p>
            <p className={cn("text-sm leading-relaxed", theme.textSecondary)}>
              When enabled with two factor verification, your account will be nearly impossible to hack and is secure against hackers and identity theft.
            </p>
          </div>

          <div>
            <p className={cn("text-sm font-semibold mb-2", theme.text)}>When 2FA is enabled, you will:</p>
            <ul className="space-y-1.5">
              <li className={cn("text-sm flex items-start gap-2", theme.textSecondary)}>
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: theme.accent }}
                />
                Still be able to use your username and password as usual.
              </li>
              <li className={cn("text-sm flex items-start gap-2", theme.textSecondary)}>
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: theme.accent }}
                />
                Enter a 2FA code generated by an app on your mobile phone.
              </li>
            </ul>
          </div>

          <p className={cn("text-sm leading-relaxed", theme.textSecondary)}>
            The combination of you being the sole person with access to your password and your phone ensures that no one but you can have access to your account.
          </p>

          <p className={cn("text-sm", theme.textSecondary)}>
            To begin the process of setting up 2FA for your account, please click the button below.
          </p>

          <button
            onClick={() => setTwoFAEnabled((v) => !v)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: twoFAEnabled ? "#22c55e" : theme.accent }}
          >
            {twoFAEnabled ? (
              <>
                <ShieldCheck size={14} />
                2FA Enabled
              </>
            ) : (
              <>
                <Shield size={14} />
                Enable Two-Factor Security
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Security;