import React from "react";
import { uiConfig } from "config/firebaseAuthUI";
import { auth } from "config/firebaseApp";
import StyledFirebaseAuth from "components/StyledFirebaseAuth";

export default function SignIn(): React.ReactElement {
  return (
    <div>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  );
}
