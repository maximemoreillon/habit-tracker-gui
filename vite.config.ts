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
		SvelteKitPWA({
			// Not sure if necessary
			// https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html#web-app-manifest
			manifest: {
				name: 'Habit Tracker',
				short_name: 'HabitTracker',
				description: 'A simple habit tracker',
				theme_color: '#000',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			// This is not an error: https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#sveltekit-pwa-plugin-options
			adapterFallback: 'index.html'
		})
	]
};

export default config;
