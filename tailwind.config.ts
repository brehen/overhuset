import { join } from 'path';
import type { Config } from 'tailwindcss';

import { skeleton } from '@skeletonlabs/tw-plugin';
import typography from '@tailwindcss/typography';

const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			minHeight: {
				dh: '100dvh'
			},
			minWidth: {
				dw: '100dvw'
			},
			maxWidth: {
				'8xl': '1440px'
			},
			screens: {
				dw: '100dvw',
				dh: '100dvh'
			},
			colors: {
				// flowbite-svelte
				primary: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				}
			}
		}
	},
	plugins: [
		require('flowbite/plugin'),
		typography,
		skeleton({
			themes: {
				preset: ['skeleton', 'wintry', 'vintage']
			}
		})
	]
} satisfies Config;

export default config;
