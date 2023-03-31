import * as React from "react";
import { useMemo, useRef, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Product } from "types/product";
import styles from "components/ProductCard/ProductCard.module.scss";
import { Box, CardActions, CircularProgress, Link } from "@mui/material";
import { currencyFormat } from "util/currency";
import { useUserData } from "types/userData";
import ProductColorPicker from "components/ProductColorPicker";

export default function ProductCard({
  product: {
    id,
    teamPrice,
    price,
    name,
    colors: productColors,
    colorMap: productColorMap,
  },
  eventId,
}: {
  product: Product;
  eventId: string;
}) {
  const [userData] = useUserData();
  const priceToDisplay = userData?.isTeam && teamPrice ? teamPrice : price;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    Boolean(productColors?.length) ? productColors?.[0].name : undefined
  );

  const imageToDisplay = useMemo(() => {
    const imgArray = selectedColor
      ? productColorMap?.[selectedColor].images
      : [];
    return imgArray && imgArray.length > 0
      ? imgArray[0]
      : `https://bakholdin.com/machine-pics/${id}/0.jpg`;
  }, [selectedColor]);

  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(100);
  const [loading, setLoading] = useState(true);
  const handleStartLoading = () => {
    setHeight(divRef.current?.clientHeight ?? 0);
    setLoading(true);
  };
  return (
    <Link href={`/store/${eventId}/${id}`} sx={{ textDecoration: "none" }}>
      <Card className={styles.root}>
        <div ref={divRef}>
          {loading && (
            <Box
              height={height}
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <CircularProgress size={50} />
            </Box>
          )}
          <CardMedia
            className={styles.media}
            component="img"
            image={imageToDisplay}
            onLoadStartCapture={handleStartLoading}
            onLoad={() => setLoading(false)}
            sx={loading ? { display: "none" } : {}}
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
          <ProductColorPicker
            setSelectedColor={setSelectedColor}
            selectedColor={selectedColor}
            productColors={productColors}
          />
        </CardActions>
      </Card>
    </Link>
  );
}
