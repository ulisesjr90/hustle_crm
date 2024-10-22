// next.config.js
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  basePath: isProd ? '/hustle_crm' : '',
  assetPrefix: isProd ? '/hustle_crm/' : '',
};

module.exports = nextConfig;
