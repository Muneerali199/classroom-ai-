/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
        locales: ['en', 'es', 'hi'],
        defaultLocale: 'en',
    },
    experimental: {
        appDir: true,
    },
};

export default nextConfig;