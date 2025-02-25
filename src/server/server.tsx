import { renderToString } from "@qwik.dev/core/server";
import { manifest } from "@qwik-client-manifest";
import App from "./routes/index";
import { symbolMapper } from "@qwik.dev/core/optimizer";
import { isDev } from "@qwik.dev/core";

export default async function render(document: string) {
	const result = await renderToString(<App />, {
		containerTagName: "body",
		symbolMapper: isDev ? globalThis.symbolMapperFn : undefined,
		manifest: isDev ? undefined : manifest,
	});

	return result.html;
}
