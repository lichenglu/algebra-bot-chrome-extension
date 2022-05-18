import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, Button, message } from "antd";

import { ChromeEvents, ChromeMessage, ErrorMessagePayload } from "../types";

const Title = styled.h2`
  animation: rainbow 6s ease-in-out infinite, shake 5s infinite;
  background: linear-gradient(
    to right,
    #6666ff,
    #0099ff,
    #00ff00,
    #ff3399,
    #6666ff
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 400% 100%;
  @keyframes rainbow {
    0%,
    100% {
      background-position: 0 0;
    }
    50% {
      background-position: 100% 0;
    }
  }

  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
  -ms-background-clip: text;
  -ms-text-fill-color: transparent;
  text-fill-color: transparent;
  display: inline-block;
  @keyframes shake {
    0% {
      transform: skewX(-30deg);
    }
    1% {
      transform: skewX(30deg);
    }
    2% {
      transform: skewX(-30deg);
    }
    3% {
      transform: skewX(30deg);
    }
    4% {
      transform: skewX(0deg);
    }
    100% {
      transform: skewX(0deg);
    }
  }
`;

export interface AuthProps {}

const Auth: React.FC<AuthProps> = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const handleMessage = (msg: ChromeMessage<ErrorMessagePayload>) => {
    if (msg.type === ChromeEvents.loginError) {
      setLoading(false);
      message.error(msg.payload.message);
    }

    return true
  };

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
      <Title>Greetings! I cannot wait to talk to you!</Title>
      <h3>
        However, you will need to login with your GMail first. Click the button
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
      <p style={{ backgroundColor: "yellow" }}>
        A popup window will appear after you click "Login in". It can take{" "}
        <strong>several seconds</strong> to show up. Please bear with me.
      </p>
    </Card>
  );
};

export default Auth;
