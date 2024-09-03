/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/api',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store', // 캐시 사용 안 함
          },
        ],
      },
    ];
  },
};

export default nextConfig;