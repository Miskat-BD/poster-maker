/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/my-posters',
        destination: '/my-poster',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
