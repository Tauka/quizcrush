import adapter from '@sveltejs/adapter-cloudflare';
import sveltePreprocess from 'svelte-preprocess';
import makeAttractionsImporter from 'attractions/importer.js';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [sveltePreprocess({
    scss: {
      importer: makeAttractionsImporter({
        themeFile: path.resolve('static/css/theme.scss'),
      }),
    },
    includePaths: [path.resolve('./static/css')],
  })],
	kit: {
		adapter: adapter()
	}
};

export default config;
