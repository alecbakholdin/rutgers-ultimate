import React, { useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { productCollection } from "../types/product";
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridSelectionModel,
} from "@mui/x-data-grid";

export default function ProductSelector({
  productIds,
  setProductIds,
}: {
  productIds: GridRowId[];
  setProductIds: (newProductIds: GridRowId[]) => void | Promise<void>;
}): React.ReactElement {
  const [products] = useCollectionData(productCollection);
  const productArr = products || [];
  const selectionModel: GridSelectionModel = useMemo(
    () => productIds,
    [productIds]
  );

  const columns: GridColDef[] = [
    {
      headerName: "ID",
      field: "id",
      width: 300,
    },
    {
      headerName: "Name",
      field: "name",
      width: 300,
    },
  ];
  return (
    <DataGrid
      rows={productArr}
      columns={columns}
      checkboxSelection
      selectionModel={selectionModel}
      onSelectionModelChange={(newSelectionModel) => {
        setProductIds(newSelectionModel);
      }}
      sx={{ height: 400 }}
    />
  );
}
