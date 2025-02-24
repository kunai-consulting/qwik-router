import {
  renderToStream,
  type RenderToStreamOptions,
} from "@qwik.dev/core/server";
import { manifest } from "@qwik-client-manifest";
import App from "./routes/index";

export function render(opts: RenderToStreamOptions) {
  return renderToStream(<App />, {
    manifest,
    ...opts,
    containerAttributes: {
      lang: "en-us",
      ...opts.containerAttributes,
    },
  });
}
