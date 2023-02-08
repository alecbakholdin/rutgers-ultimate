import React from "react";
import ClientPage from "app/store/clientPage";
import { sleep } from "util/sleep";

export default async () => {
  await sleep(5000);
  return <ClientPage text={"testing"} />;
};
