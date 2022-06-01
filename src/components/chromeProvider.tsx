import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  MessageTypes,
  BackgroundState,
  DialogflowCustomEvents,
  ChromeEvents,
} from "@/types";

const MOCKED_APP_STATE: BackgroundState = {
  enableChatbot: true,
  user: {
    uid: uuidv4(),
  },
};

export const ChromeContext = React.createContext<BackgroundState | undefined>(
  chrome.storage ? undefined : MOCKED_APP_STATE
);

const ChromeProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [appState, setAppState] = useState<BackgroundState | undefined>(
    chrome.storage ? undefined : MOCKED_APP_STATE
  );

  useEffect(() => {
    chrome.storage && initState();
    return () => {
      chrome.storage?.onChanged?.removeListener?.(handleStorageChange);
    };
  }, []);

  const initState = async () => {
    const data = await chrome.storage.local.get("appState");

    setAppState(data.appState as BackgroundState);

    // chrome.runtime.onMessage.addListener(msgObj => {
    //   console.log('received', msgObj)
    // });
    chrome.storage.onChanged.addListener(handleStorageChange);
  };

  const handleStorageChange = (
    changes: { [key: string]: chrome.storage.StorageChange },
    area: string
  ) => {
    if (
      changes.appState &&
      changes.appState?.newValue !== changes.appState?.oldValue
    ) {
      setAppState(changes.appState?.newValue);
    }
  };

  return (
    <ChromeContext.Provider value={appState}>{children}</ChromeContext.Provider>
  );
};

export default ChromeProvider;
