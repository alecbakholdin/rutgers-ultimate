import { Address } from "types/easyPost";

export type OrderItem = {
  id: string;
  orderId: string | null;
  uid: string;
  productId: string;
  productName: string;
  eventId: string;
  eventName: string;
  quantity: number;
  unitPrice: number;
  imageStoragePath: string;
  fields: { [fieldName: string]: any };
  fieldCount: number;
};

export type OrderPrice = {
  subtotal: number;
  deliveryCost: number;
  processingFee: number;
  total: number;
};

export type OrderDetails = {
  name: string;
  email: string;
  phone: string;
  deliveryMethod: "pickup" | "delivery";
  deliveryLocation: Address;
  pickupLocation: string;
};

export type Order = {
  // order metadata
  id: string;
  uid: string;
  dateCreated: Date;

  // payment details
  price: OrderPrice;
  stripePaymentId?: string;

  // order details
  details: OrderDetails;
};
