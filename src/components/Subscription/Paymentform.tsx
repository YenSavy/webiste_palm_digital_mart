import React from "react";
import { CreditCard, Landmark, QrCode } from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";
import type { PaymentMethod } from "../../types/subscription";

interface PaymentFormProps {
  paymentMethod: PaymentMethod;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  bankName: string;
  bankAccountName: string;
  transferReference: string;
  khQrTxnId: string;
  khQrConfirmed: boolean;
  displayName: string;
  billingAddress: string;
  invoiceType: string;
  vatTin: string;
  companyId: string;
  promotionCode: string;
  onPaymentMethodChange: (m: PaymentMethod) => void;
  onCardNumberChange: (v: string) => void;
  onCardExpiryChange: (v: string) => void;
  onCardCvcChange: (v: string) => void;
  onBankNameChange: (v: string) => void;
  onBankAccountNameChange: (v: string) => void;
  onTransferReferenceChange: (v: string) => void;
  onKhQrTxnIdChange: (v: string) => void;
  onKhQrConfirmedChange: (v: boolean) => void;
  onDisplayNameChange: (v: string) => void;
  onBillingAddressChange: (v: string) => void;
  onInvoiceTypeChange: (v: string) => void;
  onVatTinChange: (v: string) => void;
  onCompanyIdChange: (v: string) => void;
  onPromotionCodeChange: (v: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentMethod,
  cardNumber, cardExpiry, cardCvc,
  bankName, bankAccountName, transferReference,
  khQrTxnId, khQrConfirmed,
  displayName, billingAddress, invoiceType, vatTin, companyId, promotionCode,
  onPaymentMethodChange,
  onCardNumberChange, onCardExpiryChange, onCardCvcChange,
  onBankNameChange, onBankAccountNameChange, onTransferReferenceChange,
  onKhQrTxnIdChange, onKhQrConfirmedChange,
  onDisplayNameChange, onBillingAddressChange, onInvoiceTypeChange,
  onVatTinChange, onCompanyIdChange, onPromotionCodeChange,
}) => {
  const theme = useThemeStore((state) => state.getTheme());

  const inputCls = cn(`w-full mt-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.text}`);
  const inputStyle = { backgroundColor: `${theme.accent}08` };

  return (
    <div className="space-y-3">
      {/* Method selector */}
      <div>
        <label className={cn("text-sm", theme.textSecondary)}>Pay With</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
          {(
            [
              { key: "bank_transfer", label: "Bank Transfer", icon: <Landmark size={14} /> },
              { key: "credit_card",   label: "Credit Card",   icon: <CreditCard size={14} /> },
              { key: "kh_qr",        label: "KH QR Code",    icon: <QrCode size={14} /> },
            ] as { key: PaymentMethod; label: string; icon: React.ReactNode }[]
          ).map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => onPaymentMethodChange(key)}
              className={cn(
                `px-3 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 ${theme.border}`,
                theme.text
              )}
              style={{
                backgroundColor:
                  paymentMethod === key ? `${theme.accent}1f` : `${theme.accent}08`,
                borderColor: paymentMethod === key ? theme.accent : undefined,
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Credit Card */}
      {paymentMethod === "credit_card" && (
        <div
          className={`rounded-xl border p-3 space-y-3 ${theme.border}`}
          style={{ backgroundColor: `${theme.accent}06` }}
        >
          <p className={cn("text-sm font-semibold", theme.text)}>Credit Card Form</p>
          <div>
            <label className={cn("text-sm", theme.textSecondary)}>Card Number</label>
            <input value={cardNumber} onChange={(e) => onCardNumberChange(e.target.value)}
              placeholder="Required" className={inputCls} style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={cn("text-sm", theme.textSecondary)}>Expiry</label>
              <input value={cardExpiry} onChange={(e) => onCardExpiryChange(e.target.value)}
                placeholder="MM/YY" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={cn("text-sm", theme.textSecondary)}>CVC</label>
              <input value={cardCvc} onChange={(e) => onCardCvcChange(e.target.value)}
                placeholder="Security code" className={inputCls} style={inputStyle} />
            </div>
          </div>
        </div>
      )}

      {/* Bank Transfer */}
      {paymentMethod === "bank_transfer" && (
        <div
          className={`rounded-xl border p-3 space-y-3 ${theme.border}`}
          style={{ backgroundColor: `${theme.accent}06` }}
        >
          <p className={cn("text-sm font-semibold", theme.text)}>Bank Transfer Information</p>
          <div>
            <label className={cn("text-sm", theme.textSecondary)}>Bank Name</label>
            <input value={bankName} onChange={(e) => onBankNameChange(e.target.value)}
              placeholder="ACLEDA Bank" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={cn("text-sm", theme.textSecondary)}>Account Name</label>
            <input value={bankAccountName} onChange={(e) => onBankAccountNameChange(e.target.value)}
              placeholder="Palm Biz Co., Ltd" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={cn("text-sm", theme.textSecondary)}>Transfer Reference</label>
            <input value={transferReference} onChange={(e) => onTransferReferenceChange(e.target.value)}
              placeholder="TRX-2026-0001" className={inputCls} style={inputStyle} />
          </div>
        </div>
      )}

      {/* KH QR */}
      {paymentMethod === "kh_qr" && (
        <div
          className={`rounded-xl border p-3 space-y-3 ${theme.border}`}
          style={{ backgroundColor: `${theme.accent}06` }}
        >
          <p className={cn("text-sm font-semibold", theme.text)}>KH QR Payment</p>
          <div
            className="w-full max-w-[180px] aspect-square border rounded-lg flex items-center justify-center"
            style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}10` }}
          >
            <div className="text-center">
              <QrCode size={52} style={{ color: theme.accent }} className="mx-auto" />
              <p className={cn("text-xs mt-2", theme.textSecondary)}>Scan to pay</p>
            </div>
          </div>
          <div>
            <label className={cn("text-sm", theme.textSecondary)}>Transaction ID</label>
            <input value={khQrTxnId} onChange={(e) => onKhQrTxnIdChange(e.target.value)}
              placeholder="KHQR-TRX-001" className={inputCls} style={inputStyle} />
          </div>
          <label className={cn("inline-flex items-center gap-2 text-sm", theme.textSecondary)}>
            <input type="checkbox" checked={khQrConfirmed}
              onChange={(e) => onKhQrConfirmedChange(e.target.checked)} />
            I have completed KH QR payment.
          </label>
        </div>
      )}

      {/* Invoice fields */}
      {[
        { label: "Display Name on Invoice", value: displayName,      onChange: onDisplayNameChange,    placeholder: "" },
        { label: "Billing Address",         value: billingAddress,   onChange: onBillingAddressChange, placeholder: "" },
      ].map(({ label, value, onChange, placeholder }) => (
        <div key={label}>
          <label className={cn("text-sm", theme.textSecondary)}>{label}</label>
          <input value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder} className={inputCls} style={inputStyle} />
        </div>
      ))}

      <div>
        <label className={cn("text-sm", theme.textSecondary)}>Invoice Type</label>
        <select value={invoiceType} onChange={(e) => onInvoiceTypeChange(e.target.value)}
          className={inputCls} style={inputStyle}>
          <option value="Tax Invoice">Tax Invoice</option>
          <option value="Commercial Invoice">Commercial Invoice</option>
        </select>
      </div>

      {[
        { label: "VATTIN",         value: vatTin,        onChange: onVatTinChange,        placeholder: "+855 12345678" },
        { label: "Company ID",     value: companyId,     onChange: onCompanyIdChange,     placeholder: "" },
        { label: "Promotion Code", value: promotionCode, onChange: onPromotionCodeChange, placeholder: "" },
      ].map(({ label, value, onChange, placeholder }) => (
        <div key={label}>
          <label className={cn("text-sm", theme.textSecondary)}>{label}</label>
          <input value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder} className={inputCls} style={inputStyle} />
        </div>
      ))}
    </div>
  );
};

export default PaymentForm;