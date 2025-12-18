import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        // SPA 라우팅용(필요하면 유지)
        historyApiFallback: true,
    },
});
