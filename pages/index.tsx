import { Container, Grid, Link, Typography } from "@mui/material";
import FeedbackForm from "components/FeedbackForm";

export default function Home() {
  return (
    <Container maxWidth={"md"} sx={{ marginTop: 5 }}>
      <Grid container spacing={2}>
        <Grid item>
          <Typography color={"primary"} variant={"h4"}>
            Welcome!
          </Typography>
          <Typography variant={"body1"}>
            This is the home page of Rutgers Ultimate. It&apos;s currently still
            in early days, but{" "}
            <Link href={"/store"} sx={{ textDecoration: "none" }}>
              the store
            </Link>{" "}
            is set up to take orders by Venmo request, so please check that out.
            Look forward to more changes in the future, and if you have any
            feedback on the website or discover any bugs, please use the form
            below to let me know!
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FeedbackForm />
        </Grid>
      </Grid>
    </Container>
  );
}
