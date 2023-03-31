import { Chip, Grid } from "@mui/material";

export default function StringChipList({
  options,
  onDeleteChip,
  selected,
  setSelected,
  disabled,
  multiSelect,
}: {
  options?: string[];
  onDeleteChip?: (index: number) => void;
  selected?: string[];
  setSelected?: (newSelected: string[]) => void;
  disabled?: string[];
  multiSelect?: boolean;
}) {
  const selectedArr = selected || [];
  const handleSelect = (item: string) => {
    if (!setSelected) return;
    if (selectedArr.includes(item)) {
      setSelected(selectedArr.filter((i) => i !== item));
    } else if (multiSelect) {
      setSelected([...selectedArr, item]);
    } else {
      setSelected([item]);
    }
  };

  return (
    <Grid container spacing={0.5}>
      {options?.map((item, i) => (
        <Grid key={i} item>
          <Chip
            label={item}
            disabled={disabled?.includes(item)}
            color={selected?.includes(item) ? "primary" : undefined}
            onDelete={onDeleteChip ? () => onDeleteChip(i) : undefined}
            onClick={setSelected ? () => handleSelect(item) : undefined}
            variant={selected?.includes(item) ? "filled" : "outlined"}
          />
        </Grid>
      ))}
    </Grid>
  );
}
