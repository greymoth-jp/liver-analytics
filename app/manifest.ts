import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Liver Analytics',
    short_name: 'Liver Analytics',
    description: 'Liver analytics platform',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0d0d14',
    theme_color: '#ef4444',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['health'],
    prefer_related_applications: false,
    related_applications: [
      {
        platform: 'play' as const,
        id: 'PLACEHOLDER_PACKAGE_NAME',
        url: 'https://play.google.com/store/apps/details?id=PLACEHOLDER_PACKAGE_NAME',
      },
    ],
  };
}
