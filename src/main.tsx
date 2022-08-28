import React from "react";
import ReactDOM from "react-dom/client";

import ChromeProvider from './components/chromeProvider'
import App from "./App";

import 'antd/dist/antd.css';
import './assets/chatui-theme.less'

import "./index.css";

// uncomment to develop for extension
import './deps/chatui.js'
import './deps/mathjax.js'

if (import.meta.env.DEV) {
  // For mathjax
  const woffFiles = import.meta.globEager('./assets/fonts/*.woff')
  // For katex/mathlive
  const woffFiles2 = import.meta.globEager('./assets/fonts/*.woff2')
  const jsFiles = import.meta.globEager('./injectedScripts/*.js')
}

const root = document.createElement("div");
root.id = "chat-app-root";
document.body.append(root);

// content script entry
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ChromeProvider>
      <App />
    </ChromeProvider>
  </React.StrictMode>
);
