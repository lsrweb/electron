declare module "element-plus/dist/locale/zh-cn.min.mjs";

type ResponseChannel = {
  responseChannel: string;
};

type InvokeParams = {
  [key: string]: any;
};

declare global {
  interface Window {
    electron: {
      storage: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<void>;
        clear: (key: string) => Promise<void>;
        has: (key: string) => Promise<boolean>;
        clearAll: () => Promise<void>;
        exportConfig: () => Promise<void>;
        importConfig: (config: string) => Promise<void>;
      };
    };
  }
}
