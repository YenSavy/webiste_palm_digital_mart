export type BillingMode = "monthly" | "yearly";
export type PaymentMethod = "bank_transfer" | "credit_card" | "kh_qr";
export type TrialStep = "progress" | "success";

export interface SubscriptionFormState {
  step: 1 | 2;
  billingMode: BillingMode;
  selectedPlanId: string;
  companyId: string;
  displayName: string;
  billingAddress: string;
  invoiceType: string;
  vatTin: string;
  promotionCode: string;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  bankName: string;
  bankAccountName: string;
  transferReference: string;
  khQrTxnId: string;
  khQrConfirmed: boolean;
  message: string;
}
