import styles from "../styles/Home.module.css";
import { Button } from "@mui/material";

export default function Home() {
  return (
    <div className={styles.container}>
      <Button onClick={async () => {}}>Click me</Button>
    </div>
  );
}
