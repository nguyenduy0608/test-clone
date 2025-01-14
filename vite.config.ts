import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig({
    resolve: {
        alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
        mainFields: [],
    },
    plugins: [react(), qrcode()],
    build: {
        outDir: './build',
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [esbuildCommonjs(['react-moment'])],
        },
    },
});
