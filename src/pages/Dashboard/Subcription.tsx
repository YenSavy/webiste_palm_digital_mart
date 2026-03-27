import React, { useMemo, useState } from "react";
import {
  useSubscribePlanMutation,
  useUnsubscribePlanMutation,
} from "../../lib/mutations";
import { usePlan } from "../../lib/queries";
import useDashboardStore from "../../store/dashboardStore";

import StepHeader from "../../components/Subscription/Stepheader";
import PlanSelector from "../../components/Subscription/Planselector";
import PaymentForm from "../../components/Subscription/Paymentform";
import OrderSummary from "../../components/Subscription/Ordersummary";
import TrialDialog from "../../components/Subscription/Trialdialog";
import type {
  BillingMode,
  PaymentMethod,
  TrialStep,
} from "../../types/subscription";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";

const SubscriptionPage: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());
  const { data } = usePlan();
  const setSubscriptionCompleted = useDashboardStore(
    (state) => state.setSubscriptionCompleted,
  );
  const { mutate: subscribePlan, isPending: isSubscribing } =
    useSubscribePlanMutation();
  const { mutate: unsubscribePlan, isPending: isUnsubscribing } =
    useUnsubscribePlanMutation();

  // ── Step & plan
  const [step, setStep] = useState<1 | 2>(1);
  const [billingMode, setBillingMode] = useState<BillingMode>("monthly");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  // ── Payment
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("bank_transfer");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [transferReference, setTransferReference] = useState("");
  const [khQrTxnId, setKhQrTxnId] = useState("");
  const [khQrConfirmed, setKhQrConfirmed] = useState(false);

  // ── Invoice
  const [displayName, setDisplayName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [invoiceType, setInvoiceType] = useState("Tax Invoice");
  const [vatTin, setVatTin] = useState("");
  const [companyId, setCompanyId] = useState<string>(
    import.meta.env.VITE_COMPANY_ID || "",
  );
  const [promotionCode, setPromotionCode] = useState("");

  // ── Feedback
  const [message, setMessage] = useState("");

  // ── Trial dialog
  const [trialDialogOpen, setTrialDialogOpen] = useState(false);
  const [trialStep, setTrialStep] = useState<TrialStep>("progress");
  const [progress, setProgress] = useState(0);

  // ── Derived
  const selectedPlan = useMemo(
    () => data?.data?.find((p) => p.id === selectedPlanId),
    [data?.data, selectedPlanId],
  );
  const planPrice = Number.parseFloat(selectedPlan?.price || "0") || 0;
  const effectivePlanPrice =
    billingMode === "yearly" ? planPrice * 12 * 0.85 : planPrice;
  const vatAmount = effectivePlanPrice * 0.1;
  const grandTotal = effectivePlanPrice + vatAmount;
  const businessName = displayName || "yuhong";

  // ── Handlers
  const goToStep2 = () => {
    if (!selectedPlanId) {
      setMessage("Please choose a plan first.");
      return;
    }
    setMessage("");
    setStep(2);
  };

  const validatePayment = (): string => {
    if (paymentMethod === "credit_card") {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim())
        return "Please complete all credit card fields.";
      return "";
    }
    if (paymentMethod === "bank_transfer") {
      if (
        !bankName.trim() ||
        !bankAccountName.trim() ||
        !transferReference.trim()
      )
        return "Please complete bank transfer information.";
      return "";
    }
    // kh_qr — no local validation needed; KHQR redirects to ABA Payway
    return "";
  };

  const handleSubscribe = () => {
    if (!selectedPlanId || !companyId.trim()) {
      setMessage("Please select a plan and provide company ID.");
      return;
    }
    const err = validatePayment();
    if (err) {
      setMessage(err);
      return;
    }

    subscribePlan(
      {
        company_id: companyId.trim(),
        pricing_plan_id: selectedPlanId,
        amount: grandTotal,
      },
      {
        onSuccess: (res) => {
          setSubscriptionCompleted(true);
          setMessage(res.message || "Subscription completed.");
        },
        onError: (error) => {
          setSubscriptionCompleted(false);
          setMessage(error.message || "Subscribe failed.");
        },
      },
    );
  };

  const handleUnsubscribe = () => {
    if (!selectedPlanId || !companyId.trim()) {
      setMessage("Please select a plan and provide company ID.");
      return;
    }
    unsubscribePlan(
      {
        company_id: companyId.trim(),
        pricing_plan_id: selectedPlanId,
        amount: grandTotal, 
      },
      {
        onSuccess: (res) => {
          setSubscriptionCompleted(false);
          setMessage(res.message || "Unsubscribed successfully.");
        },
        onError: (error) => {
          setMessage(error.message || "Unsubscribe failed.");
        },
      },
    );
  };

  const handleTryFree = () => {
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
  };

  const closeTrialDialog = () => {
    setTrialDialogOpen(false);
    setTrialStep("progress");
    setProgress(0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Step indicator */}
      <StepHeader step={step} />

      {/* Step 1 — Plan selection */}
      {step === 1 && (
        <PlanSelector
          billingMode={billingMode}
          selectedPlanId={selectedPlanId}
          message={message}
          onBillingModeChange={setBillingMode}
          onSelectPlan={setSelectedPlanId}
          onContinue={goToStep2}
        />
      )}

      {/* Step 2 — Payment */}
      {step === 2 && (
        <section
          className={cn(
            `bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6`,
          )}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: payment form */}
            <div>
              <h2 className={cn("text-xl font-bold mb-4", theme.text)}>
                Payment Option
              </h2>
              <PaymentForm
                paymentMethod={paymentMethod}
                cardNumber={cardNumber}
                cardExpiry={cardExpiry}
                cardCvc={cardCvc}
                bankName={bankName}
                bankAccountName={bankAccountName}
                transferReference={transferReference}
                khQrTxnId={khQrTxnId}
                khQrConfirmed={khQrConfirmed}
                displayName={displayName}
                billingAddress={billingAddress}
                invoiceType={invoiceType}
                vatTin={vatTin}
                companyId={companyId}
                promotionCode={promotionCode}
                onPaymentMethodChange={setPaymentMethod}
                onCardNumberChange={setCardNumber}
                onCardExpiryChange={setCardExpiry}
                onCardCvcChange={setCardCvc}
                onBankNameChange={setBankName}
                onBankAccountNameChange={setBankAccountName}
                onTransferReferenceChange={setTransferReference}
                onKhQrTxnIdChange={setKhQrTxnId}
                onKhQrConfirmedChange={setKhQrConfirmed}
                onDisplayNameChange={setDisplayName}
                onBillingAddressChange={setBillingAddress}
                onInvoiceTypeChange={setInvoiceType}
                onVatTinChange={setVatTin}
                onCompanyIdChange={setCompanyId}
                onPromotionCodeChange={setPromotionCode}
              />
            </div>

            {/* Right: order summary */}
            <OrderSummary
              selectedPlan={selectedPlan}
              billingMode={billingMode}
              paymentMethod={paymentMethod}
              effectivePlanPrice={effectivePlanPrice}
              vatAmount={vatAmount}
              grandTotal={grandTotal}
              isSubscribing={isSubscribing}
              isUnsubscribing={isUnsubscribing}
              message={message}
              companyId={companyId}
              selectedPlanId={selectedPlanId}
              onBack={() => setStep(1)}
              onSubscribe={handleSubscribe}
              onUnsubscribe={handleUnsubscribe}
              onTryFree={handleTryFree}
              onMessage={setMessage}
            />
          </div>
        </section>
      )}

      {/* Trial dialog */}
      <TrialDialog
        open={trialDialogOpen}
        trialStep={trialStep}
        progress={progress}
        businessName={businessName}
        onClose={closeTrialDialog}
        onAccessNow={() => {
          console.log("Access business now");
          closeTrialDialog();
        }}
        onNotNow={closeTrialDialog}
      />
    </div>
  );
};

export default SubscriptionPage;
