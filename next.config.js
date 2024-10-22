module.exports = {
  output: 'export',
  assetPrefix: './', // ensure relative path handling for assets
  images: {
    unoptimized: true, // disable image optimization to make static export work on GitHub Pages
  },
};
