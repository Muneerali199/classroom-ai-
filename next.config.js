const withNextIntl = require('next-intl/plugin')('./next-intl.config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            { source: '/', destination: '/en', permanent: false },
        ];
    },
};

module.exports = withNextIntl(nextConfig);