const path = require("path");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const cdnUrl = "https://cdn.nav.no";
const hotjarUrl = "https://*.hotjar.com";

const ContentSecurityPolicy = `
  default-src 'self' 'unsafe-inline' ${cdnUrl};
  font-src 'self' ${cdnUrl} ${hotjarUrl} data:;
  img-src 'self' cdn.sanity.io https://avatars.githubusercontent.com data: ${cdnUrl} ${hotjarUrl};
  script-src 'self' ${cdnUrl} ${hotjarUrl} https://in2.taskanalytics.com/tm.js 'nonce-4e1aa203a32e' 'unsafe-eval';
  style-src 'self' ${cdnUrl} ${hotjarUrl} 'unsafe-inline';
  connect-src 'self' ${cdnUrl} ${hotjarUrl} https://*.hotjar.io wss://*.hotjar.com https://raw.githubusercontent.com/navikt/ https://hnbe3yhs.apicdn.sanity.io wss://hnbe3yhs.api.sanity.io cdn.sanity.io *.api.sanity.io https://amplitude.nav.no https://in2.taskanalytics.com/03346;
  frame-ancestors 'self' localhost:3000;
  media-src 'self' ${cdnUrl} cdn.sanity.io;
  frame-src 'self' https://web.microsoftstream.com localhost:3000 https://aksel.ekstern.dev.nav.no;
`;

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "no-referrer-when-downgrade",
  },
  {
    key: "Access-Control-Allow-Origin",
    value: "*",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
];

const useCdn = process.env.USE_CDN_ASSETS === "true";

const config = () =>
  withBundleAnalyzer({
    transpilePackages: ["@navikt/ds-tokens", "react-hotjar"],
    publicRuntimeConfig: {
      NEXT_PUBLIC_TEST: process.env.NEXT_PUBLIC_TEST,
    },
    assetPrefix: useCdn ? "https://cdn.nav.no/aksel/website" : undefined,
    async headers() {
      return [
        {
          source: "/:path*",
          headers: securityHeaders,
        },
      ];
    },
    async redirects() {
      return [
        {
          source: "/studio",
          destination: "/admin",
          permanent: true,
        },
        {
          source: "/storybook",
          destination: "https://main--5f801fb2aea7820022de2936.chromatic.com/",
          permanent: false,
        },
        {
          source: "/prinsipper",
          destination: "/",
          permanent: false,
        },
        {
          source: "/preview/:slug*",
          destination: "/api/preview?slug=:slug*",
          permanent: true,
        },
      ];
    },

    images: {
      domains: ["cdn.sanity.io", "raw.githubusercontent.com"],
      dangerouslyAllowSVG: true,
    },
    output: "standalone",
    experimental: {
      outputFileTracingRoot: path.join(__dirname, "../../"),
    },
  });

module.exports = config();
