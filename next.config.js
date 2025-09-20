/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            { source: '/', destination: '/en', permanent: false },
        ];
    },
};

module.exports = nextConfig;