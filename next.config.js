const withNextIntl = require('next-intl/plugin')(
    // This is the default location for the i18n config
    './src/i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ensure Next.js uses this project directory as the workspace root
    outputFileTracingRoot: __dirname,
    eslint: {
        // Allow production builds to successfully complete even if there are ESLint warnings
        ignoreDuringBuilds: false,
    },
    images: {
        remotePatterns: [{
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    serverExternalPackages: ['@genkit-ai/googleai', 'genkit'],
    transpilePackages: [
        '@radix-ui/react-accordion',
        '@radix-ui/react-alert-dialog',
        '@radix-ui/react-avatar',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-collapsible',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-label',
        '@radix-ui/react-menubar',
        '@radix-ui/react-popover',
        '@radix-ui/react-progress',
        '@radix-ui/react-radio-group',
        '@radix-ui/react-scroll-area',
        '@radix-ui/react-select',
        '@radix-ui/react-separator',
        '@radix-ui/react-slider',
        '@radix-ui/react-slot',
        '@radix-ui/react-switch',
        '@radix-ui/react-tabs',
        '@radix-ui/react-toast',
        '@radix-ui/react-tooltip'
    ],
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Exclude Genkit and OpenTelemetry from client-side bundle
            config.resolve.fallback = {
                ...config.resolve.fallback,
                '@opentelemetry/auto-instrumentations-node': false,
                '@opentelemetry/sdk-node': false,
                '@opentelemetry/api': false,
                '@genkit-ai/googleai': false,
                'genkit': false,
            };
        }
        return config;
    },
    env: {
        SKIP_AI_IMPORTS: process.env.NODE_ENV === 'production' ? 'true' : 'false'
    }
};

module.exports = withNextIntl(nextConfig);
