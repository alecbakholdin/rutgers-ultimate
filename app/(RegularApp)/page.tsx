"use client";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import BetterTextField from "appComponents/inputs/BetterTextField";
import { useState } from "react";
import { addDoc } from "@firebase/firestore";
import { feedbackCollection, FeedbackInfo } from "types/feedbackInfo";
import LoadingButton from "appComponents/inputs/LoadingButton";
import { useMySnackbar } from "hooks/useMySnackbar";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { showSuccess } = useMySnackbar();

  const handleSubmit = async () => {
    setLoading(true);
    await addDoc(feedbackCollection, {
      name,
      content,
    } as FeedbackInfo).finally(() => setLoading(false));
    setContent("");
    setName("");
    showSuccess("Thank you for your feedback!");
  };

  return (
    <Container maxWidth={"md"} sx={{ marginTop: 5 }}>
      <Grid container spacing={2}>
        <Grid item>
          <Typography color={"primary"} variant={"h4"}>
            Welcome!
          </Typography>
          <Typography variant={"body1"}>
            This is the home page of Rutgers Ultimate. It&apos;s currently still
            in early days, but <Link href={"/store"}>the store</Link> is set up
            to take orders by Venmo request, so please check that out. Look
            forward to more changes in the future, and if you have any feedback
            on the website or discover any bugs, please use the form below to
            let me know!
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={"Feedback Form"} />
            <CardContent>
              <Grid container spacing={1} justifyContent={"left"}>
                <Grid item xs={8} lg={6}>
                  <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label={"Name"}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <BetterTextField
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    label={"Feedback"}
                    handlePressControlEnter={handleSubmit}
                    fullWidth
                    multiline
                    rows={5}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <LoadingButton loading={loading} onClick={handleSubmit}>
                    SUBMIT
                  </LoadingButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
