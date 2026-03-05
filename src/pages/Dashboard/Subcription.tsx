import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader2,
  QrCode,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import { getLangSwitch } from "../../hooks/useLangSwitch";
import { getCurrentLang } from "../../hooks/useCurrentLang";
import { useSubscribePlanMutation, useUnsubscribePlanMutation } from "../../lib/mutations";
import { usePlan } from "../../lib/queries";
import { cn } from "../../lib/utils";
import useDashboardStore from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";

const Subcription: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());
  const { data } = usePlan();
  const setSubscriptionCompleted = useDashboardStore((state) => state.setSubscriptionCompleted);
  const { mutate: subscribePlan, isPending: isSubscribing } = useSubscribePlanMutation();
  const { mutate: unsubscribePlan, isPending: isUnsubscribing } = useUnsubscribePlanMutation();

  const [step, setStep] = useState<1 | 2>(1);
  const [billingMode, setBillingMode] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>(import.meta.env.VITE_COMPANY_ID || "");
  const [displayName, setDisplayName] = useState<string>("");
  const [billingAddress, setBillingAddress] = useState<string>("");
  const [invoiceType, setInvoiceType] = useState<string>("Tax Invoice");
  const [vatTin, setVatTin] = useState<string>("");
  const [promotionCode, setPromotionCode] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "credit_card" | "kh_qr">("bank_transfer");
  const [cardHolderName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvc, setCardCvc] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [bankAccountName, setBankAccountName] = useState<string>("");
  const [transferReference, setTransferReference] = useState<string>("");
  const [khQrTxnId, setKhQrTxnId] = useState<string>("");
  const [khQrConfirmed, setKhQrConfirmed] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // Trial dialog states
  const [trialDialogOpen, setTrialDialogOpen] = useState(false);
  const [trialStep, setTrialStep] = useState<"progress" | "success">("progress");
  const [progress, setProgress] = useState(0);
  const businessName = displayName || "yuhong";

  const lang = getCurrentLang();

  const selectedPlan = useMemo(
    () => data?.data?.find((plan) => plan.id === selectedPlanId),
    [data?.data, selectedPlanId]
  );

  const planPrice = Number.parseFloat(selectedPlan?.price || "0") || 0;
  const effectivePlanPrice = billingMode === "yearly" ? planPrice * 12 * 0.85 : planPrice;
  const vatAmount = effectivePlanPrice * 0.1;
  const grandTotal = effectivePlanPrice + vatAmount;
  const isActionLoading = isSubscribing || isUnsubscribing;

  const goToStep2 = () => {
    if (!selectedPlanId) {
      setMessage("Please choose a plan first.");
      return;
    }
    setMessage("");
    setStep(2);
  };

  const validatePaymentMethod = () => {
    if (paymentMethod === "credit_card") {
      if (!cardHolderName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim()) {
        return "Please complete all credit card fields.";
      }
      return "";
    }
    if (paymentMethod === "bank_transfer") {
      if (!bankName.trim() || !bankAccountName.trim() || !transferReference.trim()) {
        return "Please complete bank transfer information.";
      }
      return "";
    }
    if (!khQrTxnId.trim() || !khQrConfirmed) {
      return "Please enter KH QR transaction ID and confirm payment.";
    }
    return "";
  };

  const handleSubscribe = () => {
    if (!selectedPlanId || !companyId.trim()) {
      setMessage("Please select a plan and provide company ID.");
      return;
    }
    const validationMessage = validatePaymentMethod();
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }
    subscribePlan(
      { company_id: companyId.trim(), pricing_plan_id: selectedPlanId },
      {
        onSuccess: (res) => {
          setSubscriptionCompleted(true);
          setMessage(res.message || "Subscription completed.");
        },
        onError: (error) => {
          setSubscriptionCompleted(false);
          setMessage(error.message || "Subscribe failed.");
        },
      }
    );
  };

  const handleUnsubscribe = () => {
    if (!selectedPlanId || !companyId.trim()) {
      setMessage("Please select a plan and provide company ID.");
      return;
    }
    unsubscribePlan(
      { company_id: companyId.trim(), pricing_plan_id: selectedPlanId },
      {
        onSuccess: (res) => {
          setSubscriptionCompleted(false);
          setMessage(res.message || "Unsubscribed successfully.");
        },
        onError: (error) => {
          setMessage(error.message || "Unsubscribe failed.");
        },
      }
    );
  };

  const handleTryFreeClick = () => {
    setTrialDialogOpen(true);
    setTrialStep("progress");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTrialStep("success");
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  };

  const closeTrialDialog = () => {
    setTrialDialogOpen(false);
    setTrialStep("progress");
    setProgress(0);
  };

  const handleAccessNow = () => {
    console.log("Access business now");
    closeTrialDialog();
  };

  const handleNotNow = () => {
    closeTrialDialog();
  };

  // Derive subscribe button icon & label
  const subscribeButtonContent = () => {
    if (isSubscribing) {
      return (
        <span className="inline-flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" />
          Subscribing...
        </span>
      );
    }
    if (paymentMethod === "credit_card") {
      return (
        <span className="inline-flex items-center gap-2">
          <CreditCard size={14} />
          Pay by Card &amp; Subscribe
        </span>
      );
    }
    if (paymentMethod === "bank_transfer") {
      return (
        <span className="inline-flex items-center gap-2">
          <Landmark size={14} />
          Submit Transfer &amp; Subscribe
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2">
        <QrCode size={14} />
        I've Paid via KH QR
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <section className={cn(`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6`)}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className={cn("text-2xl font-bold", theme.text)}>Subscription</h1>
            <p className={cn("mt-1 text-sm", theme.textSecondary)}>Choose your plan, then complete payment option.</p>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}12` }}
          >
            <Sparkles size={16} style={{ color: theme.accent }} />
            <span className={cn("text-sm font-medium", theme.text)}>2-Step Checkout</span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{ backgroundColor: step === 1 ? theme.accent : `${theme.accent}1f`, color: step === 1 ? "#fff" : theme.accent }}
          >
            1
          </div>
          <span className={cn("text-sm font-medium", step === 1 ? theme.text : theme.textSecondary)}>Choose Plan</span>
          <div className={`h-[1px] w-10 ${theme.border}`} />
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{ backgroundColor: step === 2 ? theme.accent : `${theme.accent}1f`, color: step === 2 ? "#fff" : theme.accent }}
          >
            2
          </div>
          <span className={cn("text-sm font-medium", step === 2 ? theme.text : theme.textSecondary)}>Payment Option</span>
        </div>
      </section>

      {step === 1 && (
        <section className={cn(`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6`)}>
          <div className="flex justify-center mb-6">
            <div className="rounded-xl border p-1 inline-flex gap-1" style={{ borderColor: `${theme.accent}33` }}>
              <button
                onClick={() => setBillingMode("monthly")}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{
                  backgroundColor: billingMode === "monthly" ? theme.accent : "transparent",
                  color: billingMode === "monthly" ? "#fff" : undefined,
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingMode("yearly")}
                className={cn("px-4 py-2 rounded-lg text-sm font-semibold", billingMode === "yearly" ? "text-white" : theme.text)}
                style={{
                  backgroundColor: billingMode === "yearly" ? theme.accent : "transparent",
                }}
              >
                Yearly (save 15%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data?.data?.map((plan, index) => {
              const isSelected = selectedPlanId === plan.id;
              const base = Number.parseFloat(plan.price || "0") || 0;
              const displayPrice = billingMode === "yearly" ? base * 12 * 0.85 : base;
              const features =
                lang === "km" ? plan.features_kh : lang === "ch" ? plan.features_ch : plan.features_en;

              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={cn(`text-left rounded-2xl border transition-all duration-200 p-5 ${theme.border}`)}
                  style={{
                    backgroundColor: isSelected ? `${theme.accent}15` : `${theme.accent}05`,
                    borderColor: isSelected ? theme.accent : undefined,
                    boxShadow: isSelected ? `0 10px 22px ${theme.accentGlow}` : undefined,
                  }}
                >
                  <p className={cn("text-xs font-bold mb-1", theme.textSecondary)}>{index === 1 ? "MOST POPULAR" : " "}</p>
                  <h3 className={cn("text-2xl font-bold", theme.text)}>{plan.name}</h3>
                  <p className={cn("mt-1 text-4xl font-bold", theme.text)}>
                    ${displayPrice.toFixed(0)}
                    <span className={cn("text-base ml-1", theme.textSecondary)}>/{billingMode === "yearly" ? "year" : "mo"}</span>
                  </p>

                  <div
                    className="mt-4 text-center py-2 rounded-lg text-sm font-semibold"
                    style={{ backgroundColor: theme.accent, color: "white" }}
                  >
                    {isSelected ? "Selected Plan" : "Get Started"}
                  </div>

                  <hr className={`my-4 ${theme.border}`} />
                  <p className={cn("text-xs font-semibold mb-3", theme.textSecondary)}>WHAT'S INCLUDED</p>
                  <ul className="space-y-2">
                    {features.slice(0, 5).map((feature, i) => (
                      <li key={i} className={cn("text-sm flex items-start gap-2", theme.textSecondary)}>
                        <Check size={14} className="mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
            <div className="flex-1">
              {selectedPlan && (
                <p className={cn("text-sm", theme.textSecondary)}>
                  Selected: <span className={cn("font-semibold", theme.text)}>{selectedPlan.name}</span>
                </p>
              )}
              {message && <p className={cn("text-sm mt-1", theme.textSecondary)}>{message}</p>}
            </div>
            <button
              onClick={goToStep2}
              disabled={!selectedPlanId}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: theme.accent }}
            >
              Continue to Payment
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className={cn(`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6`)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className={cn("text-xl font-bold mb-4", theme.text)}>Payment Option</h2>
              <div className="space-y-3">
                <div>
                  <label className={cn("text-sm", theme.textSecondary)}>Pay With</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bank_transfer")}
                      className={cn(`px-3 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 ${theme.border}`, theme.text)}
                      style={{
                        backgroundColor: paymentMethod === "bank_transfer" ? `${theme.accent}1f` : `${theme.accent}08`,
                        borderColor: paymentMethod === "bank_transfer" ? theme.accent : undefined,
                      }}
                    >
                      <Landmark size={14} />
                      Bank Transfer
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("credit_card")}
                      className={cn(`px-3 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 ${theme.border}`, theme.text)}
                      style={{
                        backgroundColor: paymentMethod === "credit_card" ? `${theme.accent}1f` : `${theme.accent}08`,
                        borderColor: paymentMethod === "credit_card" ? theme.accent : undefined,
                      }}
                    >
                      <CreditCard size={14} />
                      Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("kh_qr")}
                      className={cn(`px-3 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 ${theme.border}`, theme.text)}
                      style={{
                        backgroundColor: paymentMethod === "kh_qr" ? `${theme.accent}1f` : `${theme.accent}08`,
                        borderColor: paymentMethod === "kh_qr" ? theme.accent : undefined,
                      }}
                    >
                      <QrCode size={14} />
                      KH QR Code
                    </button>
                  </div>
                </div>

                {paymentMethod === "credit_card" && (
                  <div className={`rounded-xl border p-3 space-y-3 ${theme.border}`} style={{ backgroundColor: `${theme.accent}06` }}>
                    <p className={cn("text-sm font-semibold", theme.text)}>Credit Card Form</p>
                    <div>
                      <label className={cn("text-sm", theme.textSecondary)}>Card Number</label>
                      <input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Required"
                        className={cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`)}
                        style={{ backgroundColor: `${theme.accent}08` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={cn("text-sm", theme.textSecondary)}>Expiry</label>
                        <input
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className={cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`)}
                          style={{ backgroundColor: `${theme.accent}08` }}
                        />
                      </div>
                      <div>
                        <label className={cn("text-sm", theme.textSecondary)}>CVC</label>
                        <input
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="Security code"
                          className={cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`)}
                          style={{ backgroundColor: `${theme.accent}08` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank_transfer" && (
                  <div className={`rounded-xl border p-3 space-y-3 ${theme.border}`} style={{ backgroundColor: `${theme.accent}06` }}>
                    <p className={cn("text-sm font-semibold", theme.text)}>Bank Transfer Information</p>
                    <div>
                      <label className={cn("text-sm", theme.textSecondary)}>Bank Name</label>
                      <input
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="ACLEDA Bank"
                        className={cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`)}
                        style={{ backgroundColor: `${theme.accent}08` }}
                      />
                    </div>
                    <div>
                      <label className={cn("text-sm", theme.textSecondary)}>Account Name</label>
                      <input
                        value={bankAccountName}
                        onChange={(e) => setBankAccountName(e.target.value)}
                        placeholder="Palm Biz Co., Ltd"
                        className={cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`)}
                        style={{ backgroundColor: `${theme.accent}08` }}
                      />
                    </div>
                    <div>
                      <label className={cn("text-sm", theme.textSecondary)}>Transfer Reference</label>
                      <input
                        value={transferReference}
                        onChange={(e) => setTransferReference(e.target.value)}
                        placeholder="TRX-2026-0001"
                        className={cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`)}
                        style={{ backgroundColor: `${theme.accent}08` }}
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "kh_qr" && (
                  <div className={`rounded-xl border p-3 space-y-3 ${theme.border}`} style={{ backgroundColor: `${theme.accent}06` }}>
                    <p className={cn("text-sm font-semibold", theme.text)}>KH QR Payment</p>
                    <div className="w-full max-w-[180px] aspect-square border rounded-lg flex items-center justify-center" style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}10` }}>
                      <div className="text-center">
                        <QrCode size={52} style={{ color: theme.accent }} className="mx-auto" />
                        <p className={cn("text-xs mt-2", theme.textSecondary)}>Scan to pay</p>
                      </div>
                    </div>
                    <div>
                      <label className={cn("text-sm", theme.textSecondary)}>Transaction ID</label>
                      <input
                        value={khQrTxnId}
                        onChange={(e) => setKhQrTxnId(e.target.value)}
                        placeholder="KHQR-TRX-001"
                        className={cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`)}
                        style={{ backgroundColor: `${theme.accent}08` }}
                      />
                    </div>
                    <label className={cn("inline-flex items-center gap-2 text-sm", theme.textSecondary)}>
                      <input type="checkbox" checked={khQrConfirmed} onChange={(e) => setKhQrConfirmed(e.target.checked)} />
                      I have completed KH QR payment.
                    </label>
                  </div>
                )}

                <div>
                  <label className={cn("text-sm", theme.textSecondary)}>Display Name on Invoice</label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`)}
                    style={{ backgroundColor: `${theme.accent}08` }}
                  />
                </div>
                <div>
                  <label className={cn("text-sm", theme.textSecondary)}>Billing Address</label>
                  <input
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    className={cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`)}
                    style={{ backgroundColor: `${theme.accent}08` }}
                  />
                </div>
                <div>
                  <label className={cn("text-sm", theme.textSecondary)}>Invoice Type</label>
                  <select
                    value={invoiceType}
                    onChange={(e) => setInvoiceType(e.target.value)}
                    className={cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`)}
                    style={{ backgroundColor: `${theme.accent}08` }}
                  >
                    <option value="Tax Invoice">Tax Invoice</option>
                    <option value="Commercial Invoice">Commercial Invoice</option>
                  </select>
                </div>
                <div>
                  <label className={cn("text-sm", theme.textSecondary)}>VATTIN</label>
                  <input
                    value={vatTin}
                    onChange={(e) => setVatTin(e.target.value)}
                    placeholder="+855 12345678"
                    className={cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`)}
                    style={{ backgroundColor: `${theme.accent}08` }}
                  />
                </div>
                <div>
                  <label className={cn("text-sm", theme.textSecondary)}>Company ID</label>
                  <input
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className={cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`)}
                    style={{ backgroundColor: `${theme.accent}08` }}
                  />
                </div>
                <div>
                  <label className={cn("text-sm", theme.textSecondary)}>Promotion Code</label>
                  <input
                    value={promotionCode}
                    onChange={(e) => setPromotionCode(e.target.value)}
                    className={cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`)}
                    style={{ backgroundColor: `${theme.accent}08` }}
                  />
                </div>
              </div>
            </div>

            <div className={`rounded-xl border ${theme.border} p-4 h-fit`} style={{ backgroundColor: `${theme.accent}08` }}>
              <h3 className={cn("text-lg font-semibold", theme.text)}>Plan: {selectedPlan?.name || "-"}</h3>
              <p className={cn("text-3xl font-bold mt-2", theme.text)}>
                ${effectivePlanPrice.toFixed(2)}
                <span className={cn("text-base font-medium ml-1", theme.textSecondary)}>
                  / {billingMode === "yearly" ? "year" : "month"}
                </span>
              </p>
              <p className={cn("text-xs mt-1", theme.textSecondary)}>
                {getLangSwitch(selectedPlan?.best_for_en || "", selectedPlan?.best_for_kh || "", selectedPlan?.best_for_ch || "")}
              </p>
              <p className={cn("text-sm mt-2", theme.textSecondary)}>
                Payment method:{" "}
                <span className={cn("font-semibold", theme.text)}>
                  {paymentMethod === "bank_transfer"
                    ? "Bank Transfer"
                    : paymentMethod === "credit_card"
                    ? "Credit Card"
                    : "KH QR Code"}
                </span>
              </p>

              <hr className={`my-4 ${theme.border}`} />
              <div className={cn("text-sm space-y-2", theme.text)}>
                <div className="flex justify-between">
                  <span className={theme.textSecondary}>Sub total</span>
                  <span>${effectivePlanPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textSecondary}>VAT amount (10%)</span>
                  <span>${vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Grand total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

             
              <button
                onClick={handleTryFreeClick}
                className="mt-4 w-full px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 inline-flex items-center justify-center gap-2"
                style={{ backgroundColor: theme.accent }}
              >
                <Star size={14} />
                Try free for 30 days
              </button>

              <div className="mt-5 flex flex-wrap gap-2">
                
                <button
                  onClick={() => setStep(1)}
                  className={cn(`px-4 py-2 rounded-lg text-sm font-semibold border ${theme.border} inline-flex items-center gap-2`, theme.text)}
                  style={{ backgroundColor: `${theme.accent}0f` }}
                >
                  <ArrowLeft size={14} />
                  Back To Choose Plan
                </button>

               
                <button
                  onClick={handleSubscribe}
                  disabled={isActionLoading}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60 inline-flex items-center gap-2"
                  style={{ backgroundColor: theme.accent }}
                >
                  {subscribeButtonContent()}
                </button>

                <button
                  onClick={handleUnsubscribe}
                  disabled={isActionLoading}
                  className={cn(`px-4 py-2 rounded-lg text-sm font-semibold border ${theme.border} ${theme.text} disabled:opacity-60 inline-flex items-center gap-2`)}
                >
                  {isUnsubscribing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Unsubscribing...
                    </>
                  ) : (
                    <>
                      <X size={14} />
                      Unsubscribe
                    </>
                  )}
                </button>
              </div>

              {message && (
                <p className={cn("mt-4 text-sm flex items-center gap-2", theme.textSecondary)}>
                  <CheckCircle2 size={14} />
                  {message}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

     
      {trialDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl">
            <button
              onClick={closeTrialDialog}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>

            {trialStep === "progress" ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Please wait while creating business
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Preparing your business data ...
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {progress}%
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Your business is ready
                </h2>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
                  "{businessName}"
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  You can access to this business now
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleAccessNow}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 inline-flex items-center gap-2"
                  >
                    <Zap size={14} />
                    Access Now
                  </button>
                  <button
                    onClick={handleNotNow}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Not now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Subcription;