import React, { useEffect, useState, useRef } from "react";
import Chat, { useMessages, MessageProps } from "@chatui/core";
import { ComposerHandle } from "@chatui/core/lib/components/Composer";
import { Modal } from "antd";
import { MathFieldChangeEvent, MathViewRef } from "@edpi/react-math-view";
import styled from "styled-components";

import schnauzerImg from "./assets/schnauzer.png";
import mockMessages from "./mock/messages.json";

import { MessageTypes } from "./types";
import { talkToAgent } from "./api";
import { findTargetDelimiter, replaceRange, transformDialogflowToChatUI } from "./utils";
import MathWithKeyboardButton from "./components/mathview";
import Message from "./components/message";
import { AppContainer } from './components/containers'

const Toggle = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  position: fixed;
  bottom: 24px;
  right: 24px;
  cursor: pointer;
`;

const defaultQuickReplies = [
  {
    icon: "message",
    name: "Help",
    isHighlight: true,
  },
  {
    icon: "compass",
    name: "Solve/simplify",
    isHighlight: true,
  },
  {
    icon: "search",
    name: "Recommend",
    isHighlight: true,
  },
  {
    icon: "smile",
    name: "Joke",
    isHighlight: true,
  },
];

let MATH_JAX_TIMER: NodeJS.Timer;

function App() {
  const [chatboxOpen, setChatboxOpen] = useState(true);
  const [navTitle, setNavTitle] = useState("Smoky, the Algebra Bot");
  const [inputText, setInputText] = useState("");
  const [mathviewModalOpen, setMathviewModalOpen] = useState(false);

  const mathviewDataRef = useRef<{
    range?: number[];
    value?: string;
  }>({});
  const composerRef = useRef<ComposerHandle>();

  const { messages, appendMsg, setTyping } = useMessages(mockMessages);

  useEffect(() => {
    clearTimeout(MATH_JAX_TIMER);
    MATH_JAX_TIMER = setTimeout(() => {
      if (window.MathJax && typeof window.MathJax.typeset === "function") {
        window.MathJax.typeset();
      }
    }, 1000);
    return () => {
      clearTimeout(MATH_JAX_TIMER);
    };
  }, [messages]);

  useEffect(() => {
    composerRef.current?.setText(inputText);
  }, [inputText]);

  const handleSend = async (type: string, val: string) => {
    console.log(type);
    if (type === MessageTypes.text && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });

      setTyping(true);

      // call api
      const res = await talkToAgent({ message: val });
      if (res.ok && res.data) {
        const msgs = transformDialogflowToChatUI(res.data);
        msgs.forEach((msg) => appendMsg(msg));
      }

      setTyping(false);
    }
  };

  const renderMessageContent = (msg: MessageProps) => {
    return (
      <Message
        {...msg}
        buttonProps={{
          onClick: (msg) => handleSend(MessageTypes.text, msg.content.text),
        }}
      />
    );
  };

  const handleQuickReplyClick = (item: any) => {
    handleSend("text", item.name);
  };

  const handleInputFieldClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const currentValue = target.value;
    const cursorStartIndex = target.selectionStart;

    if (!cursorStartIndex) {
      mathviewDataRef.current.range = undefined;
      return;
    }

    const range = findTargetDelimiter(currentValue, cursorStartIndex);

    if (!range) {
      mathviewDataRef.current.range = undefined;
      return;
    }

    mathviewDataRef.current.range = range;
    setMathviewModalOpen(true);
  };

  const handleMathviewChange = (
    e: React.SyntheticEvent<HTMLInputElement, MathFieldChangeEvent>
  ) => {
    // @ts-ignore
    const target = e.currentTarget as MathViewRef;
    mathviewDataRef.current.value = target.getValue();
  };

  const handleMathviewOK = () => {
    setInputText((text) => {
      if (!mathviewDataRef.current.range || !mathviewDataRef.current.value) {
        return text;
      }

      const replaced = replaceRange(
        text,
        mathviewDataRef.current.range[0],
        mathviewDataRef.current.range[1] + 1,
        `$${mathviewDataRef.current.value}$`
      );
      return replaced;
    });
    setMathviewModalOpen(false);
  };

  const handleMathviewCancel = () => {
    mathviewDataRef.current.value = "";
    mathviewDataRef.current.range = undefined;

    setMathviewModalOpen(false);
  };

  return (
    <AppContainer>
      {chatboxOpen && (
        <Chat
          navbar={{ title: navTitle }}
          messages={messages}
          renderMessageContent={renderMessageContent}
          onSend={handleSend}
          quickReplies={defaultQuickReplies}
          onQuickReplyClick={handleQuickReplyClick}
          locale="en-US"
          inputOptions={{
            onClick: handleInputFieldClick,
          }}
          onInputChange={(value, e) => setInputText(value)}
          placeholder="Ask me anything!"
          // @ts-ignore
          composerRef={composerRef}
        />
      )}
      <Modal
        visible={mathviewModalOpen}
        title="Math Input"
        onOk={handleMathviewOK}
        onCancel={handleMathviewCancel}
        mask={false}
        maskClosable={false}
        zIndex={105}
        bodyStyle={{ fontSize: 28 }}
        destroyOnClose={true}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <MathWithKeyboardButton
            onChange={handleMathviewChange}
            value={
              mathviewDataRef.current.range &&
              inputText.substring(
                mathviewDataRef.current.range[0] + 1,
                mathviewDataRef.current.range[1]
              )
            }
          />
        </div>
      </Modal>
      <Toggle src={chrome.runtime?.getURL(schnauzerImg) ?? schnauzerImg} onClick={() => setChatboxOpen(!chatboxOpen)}/>
    </AppContainer>
  );
}

export default App;
