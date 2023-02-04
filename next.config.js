/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: { dangerouslyAllowSVG: true, domains: ["i.scdn.co"] },
};
