/** @type {import('next').NextConfig} */
const nextConfig = {}

const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);

dotenv.config({ path: envPath });

module.exports = {
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    config.module.rules.push({
      test: /\.webp$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]',
            outputPath: 'static/images/',
            publicPath: '/_next/static/images/',
          },
        },
      ],
    });

    if (!isServer) {
      config.resolve.fallback = {
        fs: false
      };
    }

    return config
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  }
};
