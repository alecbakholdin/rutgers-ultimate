import * as React from "react";
import { useMemo, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Product } from "types/product";
import styles from "components/ProductCard/ProductCard.module.scss";
import { CardActions, Grid, Link } from "@mui/material";
import { currencyFormat } from "config/currencyUtils";
import { useUserData } from "types/userData";
import { useColors } from "types/color";
import ColorSwatch from "components/ColorSwatch";

export default function ProductCard({
  product: {
    id,
    teamPrice,
    price,
    name,
    images,
    colors: productColors,
    colorMap: productColorMap,
  },
}: {
  product: Product;
}) {
  const { colorMap } = useColors();
  const [userData] = useUserData();
  const priceToDisplay = userData?.isTeam && teamPrice ? teamPrice : price;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    productColors?.length > 0 ? productColors[0].name : undefined
  );
  const handleSelectColor =
    (colorName: string) => (e: React.MouseEvent<HTMLDivElement>) => {
      setSelectedColor(colorName);
      e.stopPropagation();
      e.preventDefault();
    };
  const imageToDisplay = useMemo(() => {
    const imgArray = selectedColor ? productColorMap[selectedColor].images : [];
    return imgArray && imgArray.length > 0
      ? imgArray[0]
      : `https://bakholdin.com/machine-pics/${id}/0.jpg`;
  }, [selectedColor]);

  return (
    <Link href={`/product/${id}`} sx={{ textDecoration: "none" }}>
      <Card className={styles.root}>
        <div>
          <CardMedia
            className={styles.media}
            component="img"
            image={imageToDisplay}
          />
        </div>
        <CardContent className={styles.title}>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body1" component={"span"}>
            {currencyFormat(priceToDisplay)}
          </Typography>
        </CardContent>
        <CardActions>
          <Grid container spacing={1}>
            {productColors?.map((color) => (
              <Grid
                key={color.name}
                item
                onClick={handleSelectColor(color.name)}
              >
                <ColorSwatch
                  hex={colorMap[color.name]}
                  selected={selectedColor === color.name}
                  sx={{
                    ":hover": {
                      borderColor: "black",
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </CardActions>
      </Card>
    </Link>
  );
}
