import React from "react";
import { Container, IconButton, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  useCollectionData,
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import {
  Order,
  orderAsStringSummary,
  orderCollection,
} from "../../types/order";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  ContentCopy,
} from "@mui/icons-material";
import { GridActionsColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { useMySnackbar } from "../../hooks/useMySnackbar";
import { productCollection } from "../../types/product";
import { extractKey } from "../../config/arrayUtils";
import { currencyFormat } from "../../config/currencyUtils";
import { updateDoc } from "@firebase/firestore";

export default function Orders(): React.ReactElement {
  const [orders] = useCollectionData(orderCollection);
  const [products] = useCollectionDataOnce(productCollection);
  const productMap = extractKey(products, "id");

  const rows = (orders || []).map((order) => ({
    ...order,
    cartString: JSON.stringify(order.cart || ""),
  }));
  const { showSuccess } = useMySnackbar();
  const getCheckboxColDef = (field: keyof Order): GridColDef => ({
    field: field,
    headerName: field.charAt(0).toUpperCase() + field.slice(1),
    type: "boolean",
    renderCell: ({ row }) => {
      const order = row as Order;
      return (
        <IconButton
          onClick={async (e) => {
            e.stopPropagation();
            await updateDoc(order.ref, { [field]: !order[field] });
          }}
        >
          {order[field] ? <CheckBox /> : <CheckBoxOutlineBlank />}
        </IconButton>
      );
    },
  });

  const cols: GridColDef[] = [
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "venmo", headerName: "Venmo", width: 200 },
    {
      field: "totalCost",
      headerName: "Cost",
      type: "number",
      width: 150,
      valueFormatter: ({ value }) => currencyFormat(Number(value)),
    },
    getCheckboxColDef("requested"),
    getCheckboxColDef("paid"),
    getCheckboxColDef("delivered"),
    {
      field: "copyActions",
      headerName: "Copy",
      type: "actions",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key={"action"}
          label={"Copy"}
          icon={<ContentCopy />}
          onClick={async () => {
            await navigator.clipboard.writeText(
              "Any concerns, please text 2013963132\n\n" +
                orderAsStringSummary(params.row as Order, productMap)
            );
            showSuccess("Successfully copied to clipboard");
          }}
        />,
      ],
    } as GridActionsColDef,
    { field: "id", headerName: "ID" },
  ];

  return (
    <Container sx={{ paddingTop: 5, height: 600 }}>
      <Typography variant={"h4"}>Orders</Typography>
      <DataGrid
        columns={cols}
        rows={rows}
        components={{ Toolbar: GridToolbar }}
        checkboxSelection
      />
    </Container>
  );
}
