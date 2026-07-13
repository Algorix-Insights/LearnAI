/** @type {import('next').NextConfig} */
const backendApiBaseUrl = (
  process.env.LEARNIA_API_BASE_URL ||
  'https://learnaiapi.algorixinsights.com/api/v1'
).replace(/\/$/, '');

const nextConfig = {
  typedRoutes: false,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/backend/:path*',
          destination: `${backendApiBaseUrl}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
