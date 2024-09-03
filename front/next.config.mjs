/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/counter',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=60, stale-while-revalidate=59', // 캐시를 60초 동안 유지하고 그 이후에 재검증
          },
        ],
      },
      {
        source: '/setting',
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