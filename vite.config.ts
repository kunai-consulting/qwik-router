import { type UserConfig, defineConfig } from "vite";
import { qwikVite } from "@qwik.dev/core/optimizer";
import nitro from "@analogjs/vite-plugin-nitro";

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
        }
      ),
    ],
  };
});
