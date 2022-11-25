import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Product } from "types/product";
import styles from "components/ProductCard/ProductCard.module.scss";
import { Link } from "@mui/material";
import { currencyFormat } from "config/currencyUtils";
import { useUserData } from "types/userData";

export default function ProductCard({
  product: { id, teamPrice, price, name },
}: {
  product: Product;
}) {
  const [userData] = useUserData();
  const priceToDisplay = userData?.isTeam && teamPrice ? teamPrice : price;

  return (
    <Link href={`/product/${id}`} sx={{ textDecoration: "none" }}>
      <Card className={styles.root}>
        <CardMedia
          className={styles.media}
          component="img"
          image={`https://bakholdin.com/machine-pics/${id}/0.jpg`}
        />
        <CardContent className={styles.title}>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography gutterBottom variant="body1" component={"span"}>
            {currencyFormat(priceToDisplay)}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
