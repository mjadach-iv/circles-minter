import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/index.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist/bundle'),
    filename: 'bundle.cjs',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.js'],
    mainFields: ['module', 'main'],
    fullySpecified: false // Allow importing without extension
  },
  module: {
    rules: [
    ],
  },
  externals: {}, // Add node built-ins or externals here if needed
  plugins: [
    new webpack.DefinePlugin({
      'process.env.RPC_URL_GATEWAY': JSON.stringify(process.env.RPC_URL_GATEWAY),
      'process.env.RPC_URL_ANKR': JSON.stringify(process.env.RPC_URL_ANKR),
      'process.env.PUBLIC_CONNECT_4337_COMETH_API_KEY': JSON.stringify(process.env.PUBLIC_CONNECT_4337_COMETH_API_KEY),
      'process.env.PUBLIC_COMETH_API_KEY': JSON.stringify(process.env.PUBLIC_COMETH_API_KEY),
      'process.env.CRC_AUTO_MINT_GROUP_BE_KEY': JSON.stringify(process.env.CRC_AUTO_MINT_GROUP_BE_KEY),
    })
  ],
  optimization: {
    minimize: false // Set to true if you want minification
  },
  experiments: {
    outputModule: false,
  },
};
