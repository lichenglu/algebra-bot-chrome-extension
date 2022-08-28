import React, { useState, useEffect } from "react";
import { Tabs, Switch, Empty } from "antd";

import { BackgroundState, ChromeEvents } from "../types";

const { TabPane } = Tabs;

const App: React.FC<{}> = () => {
  const [appState, setAppState] = useState<BackgroundState>();

  useEffect(() => {
    initState();
  }, []);

  useEffect(() => {
    if (Object.keys(appState ?? {}).length > 0) {
      chrome.storage.local.set({
        appState,
      });

      // this is how to send message in popup
      //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      //     chrome.tabs.sendMessage(tabs[0].id!, { type: "getText" });
      //   });
    }
  }, [appState]);

  const initState = async () => {
    const data = await chrome.storage.local.get(["appState"]);
    setAppState(data.appState as BackgroundState);
  };

  const handleChabotToggle = (checked: boolean) => {
    setAppState({ ...appState, enableChatbot: checked });
  };

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="History" key="1">
        <Empty />
      </TabPane>
      <TabPane tab="Notification" key="2">
        <Empty />
      </TabPane>
      <TabPane tab="Settings" key="3">
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: 6 }}>Enable Chatbot</div>
          <Switch
            checked={appState?.enableChatbot}
            onChange={handleChabotToggle}
          />
        </div>
      </TabPane>
    </Tabs>
  );
};

export default App;
