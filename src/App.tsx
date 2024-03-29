import React, { useEffect, useState, useRef, useContext } from "react";
import Chat, {
  useMessages,
  MessageProps,
  QuickReplyItemProps,
} from "@chatui/core";
import { ComposerHandle } from "@chatui/core/lib/components/Composer";
import { message, Modal, Spin } from "antd";
import { MathFieldChangeEvent, MathViewRef } from "@chenglu/react-math-view";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import schnauzerImg from "./assets/schnauzer.png";
import mockMessages from "./mock/personalized.json";

import {
  MessageTypes,
  DialogflowCustomEvents,
  ChromeMessage,
  ChromeEvents,
} from "./types";
import { talkToAgent } from "./api";
import {
  findTargetDelimiter,
  replaceRange,
  transformDialogflowToChatUI,
  MagicCommandToEventMap,
  EnhancedMessagePros,
  injectScript,
  convertMS,
  DEFAULT_QUICK_REPLIES,
} from "./utils";
import { firebaseAuth } from "./services/firebase";

import MathWithKeyboardButton from "./components/mathview";
import Message from "./components/message";
import Auth from "./components/authentication";
import { AppContainer, Toggle } from "./components/containers";
import { ChromeContext } from "./components/chromeProvider";

let MATH_JAX_TIMER: NodeJS.Timer;

function App() {
  const { messages, appendMsg, setTyping, resetList } = useMessages([]);
  const appState = useContext(ChromeContext);

  const [chatboxOpen, setChatboxOpen] = useState(true);
  const [navTitle, setNavTitle] = useState("Smoky, the Algebra Bot 🤖");
  const [inputText, setInputText] = useState("");
  const [mathviewModalOpen, setMathviewModalOpen] = useState(false);

  const mathviewDataRef = useRef<{
    range?: number[];
    value?: string;
  }>({});
  const composerRef = useRef<ComposerHandle>();
  const appStateRef = useRef(appState)

  useEffect(() => {
    chrome.runtime?.connect('jgiogkoaafflijibbikleachmkmccepa')
    chrome.runtime?.onMessage?.addListener(handleMessage);
    const eventSource = new EventSource(import.meta.env.VITE_SERVER_BASE_URL + '/chatbot/partialResponse');
    eventSource.onmessage = handleServerEvent

    return () => {
      chrome.runtime?.onMessage?.removeListener(handleMessage);
      eventSource.close()
    };
  }, []);

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

  useEffect(() => {
    appStateRef.current = appState
  }, [appState])

  const handleServerEvent: EventSource['onmessage'] = (ev) => {
    const data = JSON.parse(ev.data)
    if (data.userID && data.userID === appStateRef.current?.user?.uid) {
      let msgs: EnhancedMessagePros[];
      msgs = transformDialogflowToChatUI(data.response, appStateRef.current?.user?.uid!);
      msgs.forEach((msg) => appendMsg(msg));
      setTyping(true)
    }
  }

  const handleMessage = (msg: ChromeMessage<any>) => {
    if (msg.type === ChromeEvents.loadWithVideo) {
      const key = `bot-video-${msg.payload.videoId}`;
      const position = localStorage.getItem(key);
      if (position) {
        localStorage.setItem('bot-position', position)
        localStorage.setItem('bot-videoId', msg.payload.videoId)
        localStorage.removeItem(key)
        message.info(
          `About to start the vide. This can take some seconds. I will automatically jump to ${convertMS(Math.max(parseInt(position) / 1000 - 3, 0))} in the video`,
          8
        )
        // in order to access jwplayer from the window
        // we have to inject a script to do so
        // injectScript(chrome.runtime.getURL('./src/injectedScripts/autoPlayVideo.js'), 'body');
        injectScript(chrome.runtime.getURL('./src/injectedScripts/autoPlayVideoBEST.js'), 'body');
      }
    }
    return true;
  };

  const handleSend = async (
    type: string,
    val: string,
    event?: DialogflowCustomEvents
  ) => {
    if (type === MessageTypes.text && val.trim()) {
      const postId = appState?.user?.uid;

      // clear message
      if (MagicCommandToEventMap[val] === DialogflowCustomEvents.clearMessages) {
        resetList()
        return
      }

      appendMsg({
        _id: uuidv4(),
        type: "text",
        content: { userId: postId, text: val },
        position: "right",
      });

      setTyping(true);

      // call api
      const res = await talkToAgent({
        message: val,
        event: event ?? MagicCommandToEventMap[val],
        userID: appState?.user?.uid,
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
  );
}

export default App;
