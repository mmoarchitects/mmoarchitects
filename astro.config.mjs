import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Canonical origin — used for absolute URLs in <link rel="canonical">, OG tags, sitemap.
  site: 'https://mmoarchitects.com',
  // Astro generates static site in 'dist' directory by default.
  // This is natively supported by Vercel out of the box.
  build: {
    // Inline every page's CSS into its <head> instead of emitting render-blocking
    // <link> files. Each page's CSS is small (~10KB) and this removes the extra
    // round-trips that let content paint briefly unstyled.
    inlineStylesheets: 'always',
  },
});
