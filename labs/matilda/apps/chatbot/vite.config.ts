import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        build: {
            outDir: "dist",
            emptyOutDir: true,
            sourcemap: true,
            rollupOptions: {
                output: {
                    manualChunks: id => {
                        if (id.includes("@fluentui/react-icons")) {
                            return "fluentui-icons";
                        } else if (id.includes("@fluentui/react")) {
                            return "fluentui-react";
                        } else if (id.includes("node_modules")) {
                            return "vendor";
                        }
                    }
                }
            },
            target: "esnext"
        },
        server: {
            port: 4000,
            proxy: {
                "/content/": "http://localhost:50505",
                "/ask": "http://localhost:50505",
                "/chat": "http://localhost:50505",
                "/config": "http://localhost:50505"
            }
        },
        define: {
            'process.env.BACKEND_URI': JSON.stringify(env.BACKEND_URI),
        },
    };
});