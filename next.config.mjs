import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Next.js 기본 설정 유지
  images: {
    domains: ["yswjnlalguzoxdcmydxr.supabase.co"], // 허용할 이미지 도메인
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false }; // Webpack 오류 방지
    }
    return config;
  },
};

// PWA 설정 분리
const pwaConfig = {
  dest: "public", // PWA 파일 저장 위치
  disable: process.env.NODE_ENV === "development", // 개발 환경에서는 PWA 비활성화
  register: true, // 서비스 워커 자동 등록
  skipWaiting: true, // 기존 서비스 워커 즉시 대체
};

// Next.js 설정에 PWA 설정 적용 (완전히 분리)
export default withPWA(pwaConfig)(nextConfig);
