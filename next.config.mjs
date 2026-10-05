/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["jkzditenqjeeconzvnwv.supabase.co"],
  },
  experimental: {
    serverActions: {
        allowedOrigins: ["fantastic-palm-tree-wrrgxpwqrgwxh5g5x-3000.app.github.dev", "localhost:3000"],
    },
},
async headers() {
  return [
    {
      source: '/firebase-messaging-sw.js',
      headers: [
        { key: 'Service-Worker-Allowed', value: '/' },
      ],
    },
  ];
},
logging: {
  fetches: {
    fullUrl: true,
  },
},
};

export default nextConfig;
