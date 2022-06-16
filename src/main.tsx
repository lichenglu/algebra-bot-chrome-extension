import React from "react";
import ReactDOM from "react-dom/client";

import ChromeProvider from './components/chromeProvider'
import App from "./App";

import "@chatui/core/dist/index.css";
import 'antd/dist/antd.css';

import "./index.css";

// comment/uncomment to develop for extension
import './deps/chatui.js'
import './deps/mathjax.js'

// For mathjax
import './assets/fonts/MathJax_Zero.woff'
import './assets/fonts/MathJax_Math-Italic.woff'
import './assets/fonts/MathJax_Main-Regular.woff'
// For katex/mathlive
const woffFiles = import.meta.globEager('./assets/fonts/*.woff2')

const jsFiles = import.meta.globEager('./injectedScripts/*.js')

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
