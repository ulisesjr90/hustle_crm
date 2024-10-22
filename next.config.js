<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
=======
const isProd = process.env.NODE_ENV === 'production';
>>>>>>> 3febdd1cd61d4b7c4d11801466c3696ca7ebcd00

module.exports = {
  assetPrefix: isProd ? '/hustle_crm/' : '',
  basePath: isProd ? '/hustle_crm' : '',
  trailingSlash: true,
};
