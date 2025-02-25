import { type UserConfig, defineConfig } from "vite";
import { qwikVite, type SymbolMapperFn } from "@qwik.dev/core/optimizer";
import nitro from "@analogjs/vite-plugin-nitro";
import { symbolMapper } from "@qwik.dev/core/optimizer";

declare global {
	var symbolMapperFn: SymbolMapperFn;
}

export default defineConfig((): UserConfig => {
	return {
		plugins: [
			{
				name: "qwik-router-plugin",
				configResolved() {
					globalThis.symbolMapperFn = symbolMapper;
				},
			},
			qwikVite({
				lint: false,
				devSsrServer: false,
				ssr: {
					input: "src/server/server.tsx",
				},
				client: {
					input: "src/root.tsx",
				},
			}),
			nitro(
				{
					ssr: true,
					entryServer: "src/server/server.tsx",
				},
				{
					output: {
						dir: ".output",
						publicDir: ".output/public",
					},
				},
			),
		],
	};
});
