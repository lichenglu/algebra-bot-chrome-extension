import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { resolve } from "path";

import manifest from "./manifest";

const fontCopyDir = 'assets/fonts'

export default defineConfig({
  build: {
    rollupOptions: {
      // add any html pages here
      input: {
        // output file at '/index.html'
        popup: resolve(__dirname, 'popup.html'),
      },
    },
    sourcemap: 'inline',
  },
  plugins: [
    // https://github.com/crxjs/chrome-extension-tools/issues/454#issuecomment-1199168326
    // it seems that we need to use the classic runtime to make crx work
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
    crx({ manifest }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/fonts/*.woff',
          dest: fontCopyDir
        },
        {
          src: 'src/assets/fonts/*.woff2',
          dest: fontCopyDir
        },
        {
          src: 'src/assets/fonts/*.ttf',
          dest: fontCopyDir
        },
        {
          src: 'src/injectedScripts/*.js',
          dest: 'src/injectedScripts/'
        },
      ]
    })
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
