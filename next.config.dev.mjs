// next.config.mjs - Add HTTPS for development
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable HTTPS in development
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      https: true,
    },
  }),
};

export default nextConfig;