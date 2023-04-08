import { serverDb } from "config/firebaseServerApp";
import { getServerFirestoreConverter } from "config/getServerFirestoreConverter";
import { Product } from "types/product";
import { notFound } from "next/navigation";
import ProductPage from "app/(RegularApp)/store/[eventId]/[productId]/ProductPage";
import { Event } from "types/event";
import { Metadata } from "next";

const productCollection = serverDb
  .collection("products")
  .withConverter(getServerFirestoreConverter<Product>());
const eventCollection = serverDb
  .collection("events")
  .withConverter(getServerFirestoreConverter<Event>());
type Props = {
  params: { productId: string; eventId: string };
  searchParams: { color?: string };
};

export async function generateMetadata({
  params: { productId },
}: Props): Promise<Metadata> {
  const productDoc = await productCollection.doc(productId).get();
  return {
    title: productDoc.data()?.name,
  };
}

export default async function Page({
  params: { productId, eventId },
  searchParams: { color },
}: Props) {
  const productDoc = productCollection.doc(productId).get();
  const eventDoc = await eventCollection.doc(eventId).get();
  if (!eventDoc.data()?.productIds.includes(productId)) notFound();

  const product = (await productDoc).data();
  if (!product) notFound();

  return (
    <ProductPage
      product={product}
      event={eventDoc.data()!}
      initialColor={color}
    />
  );
}
