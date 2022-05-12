// const { NormalModuleReplacementPlugin } = require('webpack');

module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    return {
      ...config,
      plugins: [...config.plugins, new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        if (!isServer) {
          resource.request = resource.request.replace(/^node:/, "");
        }
      })],
    }
  },
}
