import React, { useState } from "react";
import { OldOrder, orderAsStringSummary } from "types/oldOrder";
import { useMySnackbar } from "hooks/useMySnackbar";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { Container, Grid, IconButton, Modal, Paper } from "@mui/material";
import { updateDoc } from "@firebase/firestore";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  Close,
  ContentCopy,
  OpenInNew,
} from "@mui/icons-material";
import { currencyFormat } from "util/currency";
import { GridActionsColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import OrderDetails from "app/(RegularApp)/admin/oldOrders/OrderDetails";

export default function OrdersDataGrid({
  orders,
}: {
  orders: OldOrder[] | undefined;
}): React.ReactElement {
  const [detailedOrder, setDetailedOrder] = useState<OldOrder | undefined>();
  const handleCloseModal = () => setDetailedOrder(undefined);

  const rows = (orders || []).map((order) => ({
    ...order,
    cartString: JSON.stringify(order.cart || ""),
  }));
  const { showSuccess } = useMySnackbar();
  const getCheckboxColDef = (field: keyof OldOrder): GridColDef => ({
    field: field,
    headerName: field.charAt(0).toUpperCase() + field.slice(1),
    type: "boolean",
    renderCell: ({ row }) => {
      const order = row as OldOrder;
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
    { field: "firstName", headerName: "First Name", minWidth: 150 },
    { field: "lastName", headerName: "Last Name", minWidth: 150 },
    { field: "venmo", headerName: "Venmo", minWidth: 200 },
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
                orderAsStringSummary(params.row as OldOrder)
            );
            showSuccess("Successfully copied to clipboard");
          }}
        />,
      ],
    } as GridActionsColDef,
    {
      field: "orderDetailsAction",
      headerName: "Details",
      type: "actions",
      getActions: ({ row }: GridRowParams) => [
        <GridActionsCellItem
          key={"details"}
          label={"Details"}
          icon={<OpenInNew />}
          onClick={() => setDetailedOrder(row as OldOrder)}
        />,
      ],
    } as GridActionsColDef,
    { field: "id", headerName: "ID" },
  ];

  return (
    <>
      <DataGrid
        columns={cols}
        rows={rows}
        components={{ Toolbar: GridToolbar }}
        checkboxSelection
      />
      <Modal
        open={Boolean(detailedOrder)}
        onClose={handleCloseModal}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Container
          maxWidth={"md"}
          sx={{
            overflowY: "scroll",
            maxHeight: "100vh",
            marginTop: 3,
            marginBottom: 3,
          }}
        >
          <Paper>
            <Grid container>
              <Grid item flexGrow={1} />
              <Grid item sx={{ paddingTop: 1, paddingRight: 1 }}>
                <IconButton onClick={handleCloseModal}>
                  <Close />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                {detailedOrder && <OrderDetails order={detailedOrder} />}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Modal>
    </>
  );
}
