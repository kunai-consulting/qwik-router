import { renderToString } from "@qwik.dev/core/server";
import { manifest } from "@qwik-client-manifest";
import App from "./routes/index";

export async function render() {
  return await renderToString(<App />, {
    manifest,
  });
}
