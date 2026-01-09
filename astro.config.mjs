// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://apprendremake.fr',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    icon({
      include: {
        lucide: ['*'],
      },
      iconDir: 'src/icons',
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
