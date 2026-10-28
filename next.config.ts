import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Статический экспорт: страница раскладывается в обычные HTML+CSS+JS,
  // которые можно положить на любой хостинг или в CDN.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
