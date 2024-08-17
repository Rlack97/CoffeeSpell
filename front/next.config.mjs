/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/setting/menu", // 설정할 페이지 경로
        headers: [
          {
            key: "Cache-Control", // 응답 헤더의 키
            value: "s-maxage=1, stale-while-revalidate=0", // 캐시 제어 값
          },
        ],
      },
    ];
  },
};

export default nextConfig;
