import { Chip, Grid } from "@mui/material";

export default function StringChipList({
  items,
  onDeleteChip,
}: /*  selected,
  setSelected*/
{
  items?: string[];
  onDeleteChip?: (index: number) => void;
  /*  selected?: string[];
                                                                                    setSelected?: (newSelected: string[]) => void;*/
}) {
  return (
    <Grid container spacing={0.5}>
      {items?.map((item, i) => (
        <Grid key={i} item>
          <Chip label={item} onDelete={() => onDeleteChip && onDeleteChip(i)} />
        </Grid>
      ))}
    </Grid>
  );
}
