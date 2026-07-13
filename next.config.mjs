/** @type {import('next').NextConfig} */
const backendApiBaseUrl = (
  process.env.LEARNIA_API_BASE_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000/api/v1'
    : 'https://learnaiapi.algorixinsights.com/api/v1')
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
