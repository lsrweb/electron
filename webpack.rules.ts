import type { ModuleOptions } from "webpack";

export const rules: Required<ModuleOptions>["rules"] = [
  // vue
  {
    test: /\.vue$/,
    use: {
      loader: "vue-loader",
    },
  },
  // this will apply to both plain `.js` files
  // AND `<script>` blocks in `.vue` files
  {
    test: /\.js$/,
    loader: "babel-loader",
  },
  // this will apply to both plain `.css` files
  // AND `<style>` blocks in `.vue` files
  {
    test: /\.css$/,
    use: ["vue-style-loader", "css-loader"],
  },
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: "node-loader",
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@vercel/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  },
];
