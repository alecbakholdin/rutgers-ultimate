import React from "react";
import { Order } from "../types/order";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { CartItem } from "../types/userData";
import { productCollection } from "../types/product";
import { extractKey } from "../config/arrayUtils";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

interface ProductRow {
  singleSize: number;
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
}

export default function ProductSummaryDataGrid({
  orders,
}: {
  orders: Order[] | undefined;
}): React.ReactElement {
  const cartItems: CartItem[] = (orders || []).flatMap((o) => o.cart);
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
  ];

  return (
    <DataGrid
      columns={cols}
      rows={cartItems.map((obj, i) => ({ ...obj, id: i }))}
      components={{ Toolbar: GridToolbar }}
      checkboxSelection
    />
  );
}
