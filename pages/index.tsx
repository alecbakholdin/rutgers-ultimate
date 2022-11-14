import styles from "../styles/Home.module.css";
import { Button } from "@mui/material";
import { firestore } from "../utils/firebase";

export default function Home() {
  return (
    <div className={styles.container}>
      <Button
        onClick={async () => {
          const product = await firestore.products.get("ACZJ3ri0pkag09szXKvg");
          console.log(product);
        }}
      >
        Click me
      </Button>
    </div>
  );
}
