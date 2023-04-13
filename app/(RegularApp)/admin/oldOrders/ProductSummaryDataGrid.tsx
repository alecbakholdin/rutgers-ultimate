import React from "react";
import { Order } from "types/order";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { productCollection } from "types/product";
import { extractKey, replace } from "util/array";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { IconButton } from "@mui/material";
import { updateDoc } from "@firebase/firestore";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

export default function ProductSummaryDataGrid({
  orders,
}: {
  orders: Order[] | undefined;
}): React.ReactElement {
  const cartItems = (orders || [])
    .map((order) => order.cart.map((item, i) => ({ ...item, ...order, i })))
    .flatMap((o) => o);
  const [products] = useCollectionDataOnce(productCollection);
  const productMap = extractKey(products, "id");

  const getCheckboxColDef = (field: string): GridColDef => ({
    field: field,
    headerName: field.charAt(0).toUpperCase() + field.slice(1),
    type: "boolean",
    renderCell: ({ row }) => {
      const { ref, cart, i } = row;
      return (
        <IconButton
          onClick={async (e) => {
            e.stopPropagation();
            await updateDoc(ref, {
              cart: replace(
                cart,
                {
                  ...cart[i],
                  [field]: !cart[i][field],
                },
                i
              ),
            });
          }}
        >
          {cart[i][field] ? <CheckBox /> : <CheckBoxOutlineBlank />}
        </IconButton>
      );
    },
  });

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
      type: "number",
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
    getCheckboxColDef("delivered"),
  ];

  return (
    <DataGrid
      columns={cols}
      rows={cartItems.map((obj, i) => ({ ...obj, id: i }))}
      components={{ Toolbar: GridToolbar }}
      componentsProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 300 },
        },
      }}
    />
  );
}
