import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import vitePluginImp from 'vite-plugin-imp'
import { resolve } from "path";

import manifest from "./manifest";

export default defineConfig({
  build: {
    rollupOptions: {
      // add any html pages here
      input: {
        // output file at '/index.html'
        popup: resolve(__dirname, 'popup.html'),
      },
    },
  },
  plugins: [
    react(), 
    // vitePluginImp({
    //   optimize: true,
    //   libList: [
    //     {
    //       libName: 'antd',
    //       libDirectory: 'es',
    //       style: (name) => `antd/es/${name}/style`
    //     }
    //   ]
    // }),
    // crx({ manifest }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // 支持内联 JavaScript
      }
    }
  },
  resolve:{
    alias:{
      '@' : resolve(__dirname, './src')
    },
  },
  server: {
    port: 3001
  },
});
