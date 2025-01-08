import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: "https://guidescout.web3templates.com",
  integrations: [tailwind(), mdx(), sitemap(), icon()],
  adapter: netlify(),
});
