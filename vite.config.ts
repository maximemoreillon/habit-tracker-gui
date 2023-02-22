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
	plugins: [sveltekit(), SvelteKitPWA()]
};

export default config;
