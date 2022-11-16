import { Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/products");
  }, []);

  return (
    <Container maxWidth={"lg"}>
      <Typography variant={"h3"} textAlign={"center"}>
        Nothing to see here.
      </Typography>
    </Container>
  );
}
