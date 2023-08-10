import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        // generate manifest.json in outDir
        manifest: true,
        // rollupOptions: {
        //     // overwrite default .html entry
        //     input: '/src/main.ts',
        // },
      },
    plugins: [vue()],
    server: {
        proxy: {
            '/api' : {
                target: 'http://localhost:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    }
});
