import React from "react";
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
  onBack: () => void;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
  onTryFree: () => void;
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
  onBack,
  onSubscribe,
  onUnsubscribe,
  onTryFree,
}) => {
  const theme = useThemeStore((state) => state.getTheme());
  const isActionLoading = isSubscribing || isUnsubscribing;

  const paymentLabel =
    paymentMethod === "bank_transfer"
      ? "Bank Transfer"
      : paymentMethod === "credit_card"
      ? "Credit Card"
      : "KH QR Code";

  const subscribeButtonContent = () => {
    if (isSubscribing)
      return (
        <span className="inline-flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" /> Subscribing...
        </span>
      );
    if (paymentMethod === "credit_card")
      return (
        <span className="inline-flex items-center gap-2">
          <CreditCard size={14} /> Pay by Card &amp; Subscribe
        </span>
      );
    if (paymentMethod === "bank_transfer")
      return (
        <span className="inline-flex items-center gap-2">
          <Landmark size={14} /> Submit Transfer &amp; Subscribe
        </span>
      );
    return (
      <span className="inline-flex items-center gap-2">
        <QrCode size={14} /> I've Paid via KH QR
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
          onClick={onSubscribe}
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