import { renderToString } from "@qwik.dev/core/server";
import { manifest } from "@qwik-client-manifest";
import App from "./routes/index";

export default async function render(document: string) {
	const result = await renderToString(<App />, {
		containerTagName: "body",
		manifest,
	});

	return result.html;
}
