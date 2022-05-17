import React, { useState } from "react";
import styled from "styled-components";
import { Card, Button } from "antd";

import { ChromeEvents } from "../types";

export interface AuthProps {}

const Auth: React.FC<AuthProps> = () => {
  const [loading, setLoading] = useState(false);
  return (
    <Card
      bodyStyle={{
        width: 400,
        height: 300,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      className={"chatbot__authentication"}
    >
      <h2>Greetings! I cannot wait to talk to you!</h2>
      <h3>
        However, you will need to login with your gmail first. Click the button
        to login.
      </h3>
      <Button
        onClick={() => {
          setLoading(true);
          chrome.runtime.sendMessage({ type: ChromeEvents.login, payload: "" });
        }}
        style={{ alignSelf: "center", width: "100%", margin: "12px 0" }}
        type="primary"
        loading={loading}
      >
        Login in
      </Button>
      <p>
        A popup window will appear after you click "Login in". It can take some
        seconds to show up.
      </p>
    </Card>
  );
};

export default Auth;
