import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import path from 'path';
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    VueSetupExtend(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    // Vite路径别名配置
    alias: {
        '@': path.resolve('./src')
    }
},
  server: {
    https: false, //本地环境不用https
    port: 8080, //本地端口
    host: "0.0.0.0",
    proxy: {
      //反向代理配置
      "/api": {
        target: "http://admin.enroll.yilutongedu.com.cn/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/style/mixin.scss";`, // 此处全局的scss文件
      },
    },
  },
  optimizeDeps: {
    include: ["schart.js"],
  },
});
