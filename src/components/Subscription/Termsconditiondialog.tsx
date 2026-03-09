import React, { useState, useRef, useEffect } from "react";
import { X, ScrollText, CheckCircle2, ShieldCheck, FileText, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";

interface TermsConditionDialogProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const TERMS_SECTIONS = [
  {
    icon: <FileText size={15} />,
    title: "1. Subscription Agreement",
    content:
      "By subscribing to Palm Digital Mart, you agree to be bound by these Terms and Conditions. Your subscription begins on the date of payment confirmation and renews automatically unless cancelled. You are responsible for maintaining the confidentiality of your account credentials.",
  },
  {
    icon: <ShieldCheck size={15} />,
    title: "2. Payment & Billing",
    content:
      "All subscription fees are billed in advance on a monthly or yearly basis. Prices are subject to change with 30 days' notice. Refunds are only available within 7 days of the initial subscription purchase. VAT and applicable taxes will be added to the base price as required by law.",
  },
  {
    icon: <AlertTriangle size={15} />,
    title: "3. Acceptable Use Policy",
    content:
      "You agree not to use the platform for any unlawful purposes or in any way that violates these terms. Reselling, sublicensing, or redistributing access to the platform is strictly prohibited. We reserve the right to suspend or terminate accounts that violate our policies without prior notice.",
  },
  {
    icon: <ScrollText size={15} />,
    title: "4. Data & Privacy",
    content:
      "We collect and process personal data in accordance with our Privacy Policy. Your data is stored securely and will not be sold to third parties. You grant us a limited license to use your data solely for providing and improving our services. You may request deletion of your data at any time.",
  },
  {
    icon: <ShieldCheck size={15} />,
    title: "5. Limitation of Liability",
    content:
      "Palm Digital Mart shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services. Our total liability shall not exceed the amount paid by you in the three months preceding the claim. We make no warranties, express or implied, regarding service uptime or fitness for a particular purpose.",
  },
  {
    icon: <FileText size={15} />,
    title: "6. Cancellation & Termination",
    content:
      "You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period. We reserve the right to terminate your account for breach of these terms. Upon termination, your access to the platform will be revoked and your data may be deleted after 30 days.",
  },
];

const TermsConditionDialog: React.FC<TermsConditionDialogProps> = ({
  open,
  onAccept,
  onDecline,
}) => {
  const theme = useThemeStore((state) => state.getTheme());
  const [agreed, setAgreed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setAgreed(false);
      setHasScrolled(false);
    }
  }, [open]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
    if (atBottom) setHasScrolled(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={cn("relative w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col", theme.border)}
        style={{
          backgroundColor: `color-mix(in srgb, ${theme.accent}08, #0f1117)`,
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div
          className={cn("flex items-center justify-between px-6 py-5 border-b flex-shrink-0", theme.border)}
          style={{ backgroundColor: `${theme.accent}08` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
            >
              <ScrollText size={18} />
            </div>
            <div>
              <h2 className={cn("text-base font-bold leading-tight", theme.text)}>
                Terms & Conditions
              </h2>
              <p className={cn("text-xs mt-0.5", theme.textSecondary)}>
                Please read carefully before proceeding to payment
              </p>
            </div>
          </div>
          <button
            onClick={onDecline}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center border transition-opacity hover:opacity-70",
              theme.border, theme.textSecondary
            )}
            style={{ backgroundColor: `${theme.accent}08` }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
          style={{ scrollbarWidth: "thin" }}
        >
          {TERMS_SECTIONS.map((section, i) => (
            <div
              key={i}
              className={cn("rounded-xl border p-4", theme.border)}
              style={{ backgroundColor: `${theme.accent}06` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: theme.accent }}>{section.icon}</span>
                <h3 className={cn("text-sm font-semibold", theme.text)}>{section.title}</h3>
              </div>
              <p className={cn("text-sm leading-relaxed", theme.textSecondary)}>
                {section.content}
              </p>
            </div>
          ))}

          {/* Last updated */}
          <p className={cn("text-xs text-center pb-2", theme.textSecondary)}>
            Last updated: March 2026 · Palm Digital Mart Co., Ltd.
          </p>
        </div>

        {/* Footer */}
        <div
          className={cn("px-6 py-5 border-t flex-shrink-0 space-y-4", theme.border)}
          style={{ backgroundColor: `${theme.accent}06` }}
        >
          {/* Scroll hint */}
          {!hasScrolled && (
            <p className="text-xs text-center" style={{ color: `${theme.accent}99` }}>
              ↓ Scroll down to read all terms before agreeing
            </p>
          )}

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <div
                className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor: agreed ? theme.accent : `${theme.accent}44`,
                  backgroundColor: agreed ? `${theme.accent}20` : "transparent",
                }}
              >
                {agreed && <CheckCircle2 size={13} style={{ color: theme.accent }} />}
              </div>
            </div>
            <span className={cn("text-sm leading-relaxed", theme.textSecondary)}>
              I have read and agree to the{" "}
              <span className="font-semibold" style={{ color: theme.accent }}>
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span className="font-semibold" style={{ color: theme.accent }}>
                Privacy Policy
              </span>{" "}
              of Palm Digital Mart.
            </span>
          </label>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onDecline}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-80",
                theme.border, theme.textSecondary
              )}
              style={{ backgroundColor: `${theme.accent}08` }}
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              disabled={!agreed}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: theme.accent }}
            >
              <CheckCircle2 size={14} />
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionDialog;