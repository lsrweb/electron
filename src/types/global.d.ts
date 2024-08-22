declare module "element-plus/dist/locale/zh-cn.min.mjs";

type ResponseChannel = {
  responseChannel: string;
};

type InvokeParams = {
  [key: string]: any;
};

declare global {
  interface Window {
    cache: {
      getData: () => Promise<any>;
    };

    system: {};

    renderSetting: {};
  }
}

export {}; // Make this a module
