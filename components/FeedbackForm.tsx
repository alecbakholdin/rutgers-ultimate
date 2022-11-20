import React, { useState } from "react";
import { feedbackCollection, FeedbackInfo } from "types/feedbackInfo";
import { useSnackbar } from "notistack";
import { Card, CardContent, CardHeader, Grid, TextField } from "@mui/material";
import BetterTextField from "components/BetterTextField";
import { addDoc } from "@firebase/firestore";
import LoadingButton, { LoadingStatus } from "components/LoadingButton";

export default function FeedbackForm(): React.ReactElement {
  const [name, setName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<LoadingStatus | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    setStatus("loading");
    await addDoc(feedbackCollection, {
      name,
      content,
    } as FeedbackInfo);
    setContent("");
    setName("");
    enqueueSnackbar("Thank you for your feedback!", {
      autoHideDuration: 1500,
      variant: "success",
    });
    setStatus("success");
  };

  return (
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
            <LoadingButton status={status} onClick={handleSubmit}>
              SUBMIT
            </LoadingButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
