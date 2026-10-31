import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tkd-huracan.com.ar',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always',
  },
});
