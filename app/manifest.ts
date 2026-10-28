import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Онлайн-метроном',
    short_name: 'Метроном',
    description:
      'Точный онлайн-метроном в браузере: темп, размеры от 2/4 до 12/8, tap tempo, акценты и дробление.',
    lang: 'ru',
    start_url: '/',
    display: 'standalone',
    background_color: '#efede7',
    theme_color: '#efede7',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
