import { Address } from "types/easyPost";

export type OrderItem = {
  productId: string;
  productName: string;
  eventId: string;
  eventName: string;
  quantity: number;
  unitPrice: number;
  imageStoragePath: string;
  fields: { [fieldName: string]: any };
};

export type Order = {
  // order metadata
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  dateCreated: Date;

  // payment details
  total: number;
  stripePaymentId?: string;

  // delivery details
  deliveryMethod: "delivery" | "pickup";
  pickupLocation?: string;
  address?: Address;

  // product information
  items: OrderItem[];
  eventIds: string[];
};
