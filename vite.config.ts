import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

import type { UserConfig } from 'vite';

const config: UserConfig = {
	optimizeDeps: {
		exclude: [
			'firebase',
			'firebase/app',
			'firebase/auth',
			'firebase/firestore',
			'firebase/analytics',
			'firebase/functions',
			'firebase/storage'
		]
	},

	plugins: [
		sveltekit(),
		// This is not an error: https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#sveltekit-pwa-plugin-options
		SvelteKitPWA({ adapterFallback: 'index.html' })
	]
};

export default config;
