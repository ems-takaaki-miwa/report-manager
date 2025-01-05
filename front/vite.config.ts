import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
// import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [reactRouter(), tsconfigPaths(), tailwindcss()],
});
