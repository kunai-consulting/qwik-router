import { type UserConfig, defineConfig } from "vite";
import { qwikVite, type SymbolMapperFn } from "@qwik.dev/core/optimizer";
import { symbolMapper } from "@qwik.dev/core/optimizer";
import { createDevServer, createNitro, build } from "nitropack";
import { toNodeListener } from "h3";
import { createServer } from "node:http";
import type { ViteDevServer } from "vite";

declare global {
	var symbolMapperFn: SymbolMapperFn;
}

export default defineConfig((): UserConfig => {
	return {
		plugins: [
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
			{
				name: "qwik-router-plugin",
				configResolved() {
					globalThis.symbolMapperFn = symbolMapper;
				},
				async configureServer(viteServer: ViteDevServer) {
					// Create a Nitro instance for the dev server
					const nitro = await createNitro({
						dev: true,
						rootDir: process.cwd(),
						srcDir: "src",
						scanDirs: ["src/server"],
						logLevel: 1, // Info level
						imports: {
							// Add auto-imports if needed
							dirs: ["src/server/utils"],
						},
						runtimeConfig: {
							// Add runtime configuration
							apiPrefix: "api",
						},
						// Configure the dev server
						devServer: {
							watch: ["src"],
						},
						// Add virtual routes to handle missing routes like the root path
						virtual: {
							// Add a handler for the root path
							"#root-handler": `
								import { eventHandler } from 'h3'
								
								export default eventHandler(async (event) => {
									return {
										message: 'Nitro API server is running',
										documentation: 'Create API routes in src/server/api/',
										timestamp: new Date().toISOString()
									}
								})
							`,
						},
						// Register the routes
						handlers: [
							{
								route: "/",
								handler: "src/server/server.tsx",
							},
							{
								route: "/api",
								handler: "#root-handler",
							},
						],
					});

					// Create and build the Nitro dev server
					const server = createDevServer(nitro);
					await build(nitro);

					// Instead of mounting on Vite, create a standalone HTTP server for Nitro
					const nitroHttpServer = createServer(toNodeListener(server.app));

					// Start Nitro on its own port (e.g., 3001)
					const NITRO_PORT = 3001;
					nitroHttpServer.listen(NITRO_PORT, () => {
						console.log(
							`\n🚀 Nitro server running independently at http://localhost:${NITRO_PORT}\n`,
						);
						console.log(
							`API endpoints available at: http://localhost:${NITRO_PORT}/api\n`,
						);

						// Set environment variable so frontend knows the API URL
						process.env.VITE_API_BASE = `http://localhost:${NITRO_PORT}/api`;
					});

					// Handle WebSocket upgrades if needed
					nitroHttpServer.on("upgrade", server.upgrade);

					// Log Vite server info when ready
					viteServer.httpServer?.once("listening", () => {
						const address = viteServer.httpServer?.address();
						const port =
							typeof address === "object" && address ? address.port : 3000;
						console.log(
							`\n🚀 Vite dev server running at http://localhost:${port}\n`,
						);
					});
				},
			},
		],
	};
});
