import React from "react";
import { Order } from "../types/order";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { productCollection } from "../types/product";
import { extractKey } from "util/array";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

export default function ProductSummaryDataGrid({
  orders,
}: {
  orders: Order[] | undefined;
}): React.ReactElement {
  const cartItems = (orders || [])
    .map((o) => o.cart.map((i) => ({ ...o, ...i })))
    .flatMap((o) => o);
  const [products] = useCollectionDataOnce(productCollection);
  const productMap = extractKey(products, "id");

  const cols: GridColDef[] = [
    {
      field: "productId",
      headerName: "Product Name",
      valueGetter: ({ value }) => productMap[value].name,
      width: 200,
    },
    {
      field: "color",
      headerName: "Color",
    },
    {
      field: "size",
      headerName: "Size",
    },
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "numberField",
      headerName: "Number",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
    },
    {
      field: "firstName",
      headerName: "First Name",
    },
    {
      field: "lastName",
      headerName: "Last Name",
    },
  ];

  return (
    <DataGrid
      columns={cols}
      rows={cartItems.map((obj, i) => ({ ...obj, id: i }))}
      components={{ Toolbar: GridToolbar }}
    />
  );
}
