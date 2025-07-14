import path from 'path';
import { fileURLToPath } from 'url';

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
  optimization: {
    minimize: false // Set to true if you want minification
  },
  experiments: {
    outputModule: false,
  },
};
