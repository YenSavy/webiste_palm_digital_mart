import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader2,
  QrCode,
  Star,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { getLangSwitch } from "../../hooks/useLangSwitch";
import { useThemeStore } from "../../store/themeStore";
import type { BillingMode, PaymentMethod } from "../../types/subscription";
import {
  getKHQRDeeplinkPalm,
  subscribePlan,
} from "../../lib/apis/dashboard/companyApi";

interface Plan {
  id: string;
  name: string;
  price: string;
  best_for_en: string;
  best_for_kh: string;
  best_for_ch: string;
}

interface OrderSummaryProps {
  selectedPlan: Plan | undefined;
  billingMode: BillingMode;
  paymentMethod: PaymentMethod;
  effectivePlanPrice: number;
  vatAmount: number;
  grandTotal: number;
  isSubscribing: boolean;
  isUnsubscribing: boolean;
  message: string;
  companyId: string;       // needed to subscribe before KHQR
  selectedPlanId: string;  // needed to subscribe before KHQR
  onBack: () => void;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
  onTryFree: () => void;
  onMessage: (msg: string) => void; // set message in parent
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedPlan,
  billingMode,
  paymentMethod,
  effectivePlanPrice,
  vatAmount,
  grandTotal,
  isSubscribing,
  isUnsubscribing,
  message,
  companyId,
  selectedPlanId,
  onBack,
  // onSubscribe,
  onUnsubscribe,
  onTryFree,
  onMessage,
}) => {
  const theme = useThemeStore((state) => state.getTheme());
  const [isLoadingKHQR, setIsLoadingKHQR] = useState<boolean>(false);
  const [khqrError, setKhqrError] = useState<string>("");

  const isActionLoading = isSubscribing || isUnsubscribing || isLoadingKHQR;

  const paymentLabel =
    paymentMethod === "bank_transfer"
      ? "Bank Transfer"
      : paymentMethod === "credit_card"
      ? "Credit Card"
      : "KH QR Code";


  const handleKHQRPay = async (): Promise<void> => {
    if (!selectedPlanId || !companyId.trim()) {
      setKhqrError("Please select a plan and provide company ID.");
      return;
    }
    try {
      setIsLoadingKHQR(true);
      setKhqrError("");
      onMessage("");

      const subRes = await subscribePlan({
        company_id: companyId.trim(),
        pricing_plan_id: selectedPlanId,
         amount: grandTotal,
      });

      const saleId =
  (subRes as any)?.sale_id ||
  (subRes as any)?.sale?.original?.id;

if (!saleId) {
  setKhqrError(`sale_id missing. Response: ${JSON.stringify(subRes)}`);
  return;
}

      const khqrRes = await getKHQRDeeplinkPalm(saleId);
      const url = khqrRes?.data?.checkout_qr_url;

      if (url) {
        window.location.href = url; 
      } else {
        setKhqrError("Could not retrieve KHQR checkout URL. Please try again.");
      }
    } catch (err: any) {
      setKhqrError(
        err?.response?.data?.message || "KHQR payment failed. Please try again."
      );
    } finally {
      setIsLoadingKHQR(false);
    }
  };

  const handleSubscribeClick = (): void => {
    handleKHQRPay();
  };

  const subscribeButtonContent = (): React.ReactNode => {
    if (isLoadingKHQR) {
      return (
        <span className="inline-flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" /> Loading KHQR...
        </span>
      );
    }
    if (isSubscribing) {
      return (
        <span className="inline-flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" /> Subscribing...
        </span>
      );
    }
    if (paymentMethod === "credit_card") {
      return (
        <span className="inline-flex items-center gap-2">
          <CreditCard size={14} /> Pay by Card &amp; Subscribe
        </span>
      );
    }
    if (paymentMethod === "bank_transfer") {
      return (
        <span className="inline-flex items-center gap-2">
          <Landmark size={14} /> Submit Transfer &amp; Subscribe
        </span>
      );
    }
    // kh_qr
    return (
      <span className="inline-flex items-center gap-2">
        <QrCode size={14} /> Pay via KH QR
      </span>
    );
  };

  return (
    <div
      className={`rounded-xl border ${theme.border} p-4 h-fit`}
      style={{ backgroundColor: `${theme.accent}08` }}
    >
      <h3 className={cn("text-lg font-semibold", theme.text)}>
        Plan: {selectedPlan?.name || "-"}
      </h3>
      <p className={cn("text-3xl font-bold mt-2", theme.text)}>
        ${effectivePlanPrice.toFixed(2)}
        <span className={cn("text-base font-medium ml-1", theme.textSecondary)}>
          / {billingMode === "yearly" ? "year" : "month"}
        </span>
      </p>
      <p className={cn("text-xs mt-1", theme.textSecondary)}>
        {getLangSwitch(
          selectedPlan?.best_for_en || "",
          selectedPlan?.best_for_kh || "",
          selectedPlan?.best_for_ch || ""
        )}
      </p>
      <p className={cn("text-sm mt-2", theme.textSecondary)}>
        Payment method:{" "}
        <span className={cn("font-semibold", theme.text)}>{paymentLabel}</span>
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

      {/* Try free */}
      <button
        onClick={onTryFree}
        className="mt-4 w-full px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 inline-flex items-center justify-center gap-2"
        style={{ backgroundColor: theme.accent }}
      >
        <Star size={14} />
        Try free for 30 days
      </button>

      {/* Action buttons */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={onBack}
          className={cn(
            `px-4 py-2 rounded-lg text-sm font-semibold border ${theme.border} inline-flex items-center gap-2`,
            theme.text
          )}
          style={{ backgroundColor: `${theme.accent}0f` }}
        >
          <ArrowLeft size={14} />
          Back To Choose Plan
        </button>

        <button
          onClick={handleSubscribeClick}
          disabled={isActionLoading}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60 inline-flex items-center gap-2"
          style={{ backgroundColor: theme.accent }}
        >
          {subscribeButtonContent()}
        </button>

        <button
          onClick={onUnsubscribe}
          disabled={isActionLoading}
          className={cn(
            `px-4 py-2 rounded-lg text-sm font-semibold border ${theme.border} ${theme.text} disabled:opacity-60 inline-flex items-center gap-2`
          )}
        >
          {isUnsubscribing ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Unsubscribing...
            </>
          ) : (
            <>
              <X size={14} /> Unsubscribe
            </>
          )}
        </button>
      </div>

      {/* KHQR error */}
      {khqrError && (
        <p className="mt-3 text-sm text-red-500 flex items-center gap-2">
          <X size={14} />
          {khqrError}
        </p>
      )}

      {/* Success / info message */}
      {message && (
        <p className={cn("mt-4 text-sm flex items-center gap-2", theme.textSecondary)}>
          <CheckCircle2 size={14} />
          {message}
        </p>
      )}
    </div>
  );
};

export default OrderSummary;