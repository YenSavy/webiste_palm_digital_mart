import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { getCurrentLang } from "../../hooks/useCurrentLang";
import { fetchPlans } from "../../lib/apis/home-page/planApi";
import { subscribePlan } from "../../lib/apis/dashboard/companyApi";
import { useThemeStore } from "../../store/themeStore";
import type { BillingMode } from "../../types/subscription";
import type { TPricingProps } from "../../components/shared/home/Pricing";
import TermsConditionDialog from "./Termsconditiondialog";

interface PlanSelectorProps {
  billingMode: BillingMode;
  selectedPlanId: string;
  companyId: string;       
  message: string;
  onBillingModeChange: (mode: BillingMode) => void;
  onSelectPlan: (id: string) => void;
  onContinue: () => void;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({
  billingMode,
  selectedPlanId,
  companyId,             
  message,
  onBillingModeChange,
  onSelectPlan,
  onContinue,
}) => {
  const theme = useThemeStore((state) => state.getTheme());
  const lang = getCurrentLang();

  const [plans, setPlans] = useState<TPricingProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false); 

  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchPlans();
        if (!cancelled) setPlans(res?.data ?? []);
      } catch (err) {
        if (!cancelled) setError("Failed to load plans. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const handleContinueClick = () => {
    if (!selectedPlanId) return;
    setTermsOpen(true);
  };


  const handleAcceptTerms = async () => {
    setTermsOpen(false);
    try {
      setSubscribing(true);
      await subscribePlan({
        company_id: companyId,
        pricing_plan_id: selectedPlanId,
      });
      onContinue(); 
    } catch (err) {
      console.error("Subscription failed:", err);
      setError("Subscription failed. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const handleDeclineTerms = () => {
    setTermsOpen(false);
  };

  return (
    <>
      <section
        className={cn(
          `bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6`
        )}
      >
        {/* Billing toggle */}
        <div className="flex justify-center mb-6">
          <div
            className="rounded-xl border p-1 inline-flex gap-1"
            style={{ borderColor: `${theme.accent}33` }}
          >
            <button
              onClick={() => onBillingModeChange("monthly")}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{
                backgroundColor: billingMode === "monthly" ? theme.accent : "transparent",
                color: billingMode === "monthly" ? "#fff" : undefined,
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => onBillingModeChange("yearly")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold",
                billingMode === "yearly" ? "text-white" : theme.text
              )}
              style={{
                backgroundColor: billingMode === "yearly" ? theme.accent : "transparent",
              }}
            >
              Yearly (save 15%)
            </button>
          </div>
        </div>

        {/* Loading / error states */}
        {loading && (
          <p className={cn("text-center text-sm py-8", theme.textSecondary)}>
            Loading plans…
          </p>
        )}
        {!loading && error && (
          <p className="text-center text-sm py-8 text-red-500">{error}</p>
        )}

        {/* Plan cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan, index) => {
              const isSelected = selectedPlanId === plan.id;
              const base = Number.parseFloat(plan.price || "0") || 0;
              const displayPrice = billingMode === "yearly" ? base * 12 * 0.85 : base;
              const features =
                lang === "km"
                  ? plan.features_kh
                  : lang === "ch"
                  ? plan.features_ch
                  : plan.features_en;

              return (
                <button
                  key={plan.id}
                  onClick={() => onSelectPlan(plan.id)}
                  className={cn(
                    `text-left rounded-2xl border transition-all duration-200 p-5 ${theme.border}`
                  )}
                  style={{
                    backgroundColor: isSelected ? `${theme.accent}15` : `${theme.accent}05`,
                    borderColor: isSelected ? theme.accent : undefined,
                    boxShadow: isSelected ? `0 10px 22px ${theme.accentGlow}` : undefined,
                  }}
                >
                  <p className={cn("text-xs font-bold mb-1", theme.textSecondary)}>
                    {index === 1 ? "MOST POPULAR" : " "}
                  </p>
                  <h3 className={cn("text-2xl font-bold", theme.text)}>{plan.name}</h3>
                  <p className={cn("mt-1 text-4xl font-bold", theme.text)}>
                    ${displayPrice.toFixed(0)}
                    <span className={cn("text-base ml-1", theme.textSecondary)}>
                      /{billingMode === "yearly" ? "year" : "mo"}
                    </span>
                  </p>

                  <div
                    className="mt-4 text-center py-2 rounded-lg text-sm font-semibold"
                    style={{ backgroundColor: theme.accent, color: "white" }}
                  >
                    {isSelected ? "Selected Plan" : "Get Started"}
                  </div>

                  <hr className={`my-4 ${theme.border}`} />
                  <p className={cn("text-xs font-semibold mb-3", theme.textSecondary)}>
                    WHAT'S INCLUDED
                  </p>
                  <ul className="space-y-2">
                    {features.slice(0, 5).map((feature: string, i: number) => (
                      <li
                        key={i}
                        className={cn("text-sm flex items-start gap-2", theme.textSecondary)}
                      >
                        <Check size={14} className="mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex-1">
            {selectedPlan && (
              <p className={cn("text-sm", theme.textSecondary)}>
                Selected:{" "}
                <span className={cn("font-semibold", theme.text)}>{selectedPlan.name}</span>
              </p>
            )}
            {message && (
              <p className={cn("text-sm mt-1", theme.textSecondary)}>{message}</p>
            )}
          </div>
          <button
            onClick={handleContinueClick}
            disabled={!selectedPlanId || loading || subscribing}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: theme.accent }}
          >
            {subscribing ? "Processing…" : "Continue to Payment"}
          </button>
        </div>
      </section>

      <TermsConditionDialog
        open={termsOpen}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />
    </>
  );
};

export default PlanSelector;