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
        importConfig: (filePath: string) => Promise<void>; // Updated method signature
        initializeConfig: (
          fileName: string,
          initialConfig: Record<string, any>
        ) => Promise<void>; // Added new method
      };
    };

    system: {
      maximize: () => Promise<void>;
      unmaximize: () => Promise<void>;
      minimize: () => Promise<void>;
      close: () => Promise<void>;
    };

    renderSetting: {
      setGlobalSetting: (setting: any) => Promise<boolean>;
    };
  }
}

export {}; // Make this a module
