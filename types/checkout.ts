import { atom, useAtom } from "jotai";

export type CheckoutState = "config" | "payment" | "thank";
export type CheckoutConfig = {
  deliveryMethod: "pickup" | "delivery";

  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  pickupLocation?: string;
};

export type CheckoutPaymentIntentResponse = {
  clientSecret: string;
  subtotal: number;
  shipping: number;
  processingFee: number;
  total: number;
};
export type CheckoutPaymentState = {
  intentLoading: boolean;
  paymentStatus: "waiting" | "loading" | "complete" | "error";
  paymentError?: string;
  paymentInfo?: CheckoutPaymentIntentResponse;
};

const checkoutPaymentState = atom<CheckoutPaymentState>({
  intentLoading: false,
  paymentStatus: "waiting",
});

export function useCheckoutPaymentState() {
  const [paymentState, setPaymentState] = useAtom(checkoutPaymentState);
  const updatePaymentState = (update: Partial<CheckoutPaymentState>) => {
    console.log("updating", update, paymentState, {
      ...paymentState,
      ...update,
    });
    setPaymentState({ ...paymentState, ...update });
  };
  console.log("state", paymentState);
  const updatePaymentInfo = (
    update: Partial<CheckoutPaymentIntentResponse>
  ) => {
    updatePaymentState({
      paymentInfo: {
        ...(paymentState.paymentInfo ? paymentState.paymentInfo : {}),
        ...update,
      } as CheckoutPaymentIntentResponse,
    });
  };
  return {
    paymentState,
    setPaymentState,
    updatePaymentState,
    updatePaymentInfo,
  };
}
