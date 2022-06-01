import React, { useEffect, useState, useRef, useContext } from "react";
import Chat, {
  useMessages,
  MessageProps,
  QuickReplyItemProps,
} from "@chatui/core";
import { ComposerHandle } from "@chatui/core/lib/components/Composer";
import { message, Modal, Spin } from "antd";
import { MathFieldChangeEvent, MathViewRef } from "@edpi/react-math-view";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import schnauzerImg from "./assets/schnauzer.png";
import mockMessages from "./mock/messages.json";

import {
  MessageTypes,
  DialogflowCustomEvents,
} from "./types";
import { talkToAgent } from "./api";
import {
  findTargetDelimiter,
  replaceRange,
  transformDialogflowToChatUI,
  MagicCommandToEventMap,
  EnhancedMessagePros,
  DEFAULT_QUICK_REPLIES
} from "./utils";
import { firebaseAuth } from "./services/firebase";

import MathWithKeyboardButton from "./components/mathview";
import Message from "./components/message";
import Auth from "./components/authentication";
import { AppContainer } from "./components/containers";
import { ChromeContext } from "./components/chromeProvider";

const Toggle = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  position: fixed;
  bottom: 24px;
  right: 24px;
  cursor: pointer;
`;


let MATH_JAX_TIMER: NodeJS.Timer;

function App() {
  const { messages, appendMsg, setTyping } = useMessages([]);
  const appState = useContext(ChromeContext)

  const [chatboxOpen, setChatboxOpen] = useState(true);
  const [navTitle, setNavTitle] = useState("Smoky, the Algebra Bot 🤖");
  const [inputText, setInputText] = useState("");
  const [mathviewModalOpen, setMathviewModalOpen] = useState(false);

  const mathviewDataRef = useRef<{
    range?: number[];
    value?: string;
  }>({});
  const composerRef = useRef<ComposerHandle>();

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

  const handleSend = async (
    type: string,
    val: string,
    event?: DialogflowCustomEvents
  ) => {
    if (type === MessageTypes.text && val.trim()) {
      const postId = appState?.user?.uid;

      appendMsg({
        _id: postId,
        type: "text",
        content: { text: val },
        position: "right",
      });

      setTyping(true);

      // call api
      const res = await talkToAgent({
        message: val,
        event: event ?? MagicCommandToEventMap[val],
        userID: appState?.user?.uid
      });
      let msgs: EnhancedMessagePros[];
      let replyId: string;

      // if success
      if (res.ok && res.data) {
        replyId = res.data.responseId!;
        msgs = transformDialogflowToChatUI(res.data, postId!);
      } else {
        replyId = uuidv4();
        msgs = [
          {
            _id: replyId,
            type: "text",
            content: { text: res.originalError?.message },
            position: "left",
            parentId: postId!,
          },
        ];
      }

      msgs.forEach((msg) => appendMsg(msg));

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

  const handleQuickReplyClick = (
    item: { [key: string]: any } & QuickReplyItemProps
  ) => {
    handleSend("text", item.code ?? item.name, item.event);
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

  console.log('appState', appState)
  
  if (!appState || !appState.enableChatbot) {
    return null;
  }

  return (
    <AppContainer>
      {!appState.user && <Auth />}
      {appState.user && chatboxOpen && (
        <Chat
          navbar={{ title: navTitle }}
          messages={messages}
          renderMessageContent={renderMessageContent}
          onSend={handleSend}
          quickReplies={DEFAULT_QUICK_REPLIES}
          onQuickReplyClick={handleQuickReplyClick}
          locale="en-US"
          inputOptions={{
            onClick: handleInputFieldClick,
          }}
          onInputChange={(value, e) => setInputText(value)}
          placeholder="Ask me anything!"
          loadMoreText="Load More"
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
      <Toggle
        src={chrome.runtime?.getURL?.(schnauzerImg) ?? schnauzerImg}
        onClick={() => {
          if (!appState.user) {
            return;
          }
          setChatboxOpen(!chatboxOpen);
        }}
      />
    </AppContainer>
  )
}

export default App;
