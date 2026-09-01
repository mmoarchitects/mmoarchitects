import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Canonical origin — used for absolute URLs in <link rel="canonical">, OG tags, sitemap.
  site: 'https://mmoarchitects.com',
  // Astro generates static site in 'dist' directory by default.
  // This is natively supported by Vercel out of the box.
});
