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
      setData: (data: any) => Promise<void>;
      getJsonKey: (key: string) => Promise<any>;
      setJsonKey: (key: string, value: any) => Promise<void>;
    };

    system: {
      minimize: () => Promise<void>;
      quit: () => Promise<void>;
      minimizeApp: () => Promise<void>;
      maximizeApp: () => Promise<void>;
    };

    renderSetting: {};
  }
}

export {}; // Make this a module
