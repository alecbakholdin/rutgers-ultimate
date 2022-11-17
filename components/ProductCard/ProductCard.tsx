import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Product } from "../../types/product";
import styles from "./ProductCard.module.scss";
import { Link } from "@mui/material";
import { currencyFormat } from "../../config/currencyUtils";

export default function ProductCard(props: { product: Product }) {
  return (
    <Link href={`/product/${props.product.id}`} sx={{ textDecoration: "none" }}>
      <Card className={styles.root}>
        <CardMedia
          className={styles.media}
          component="img"
          image={props.product.image}
        />
        <CardContent className={styles.title}>
          <Typography gutterBottom variant="h5" component="div">
            {props.product.name}
          </Typography>
          <Typography gutterBottom variant="body1" component={"span"}>
            {currencyFormat(props.product.price)}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
