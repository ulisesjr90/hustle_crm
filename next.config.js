const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  assetPrefix: isProd ? '/hustle_crm/' : '',
  basePath: isProd ? '/hustle_crm' : '',
  trailingSlash: true,
};
