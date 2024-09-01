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
      readVersionFolderData: () => Promise<any>;
      openExplorer: (data: string) => Promise<void>;
      createProject: (data: any) => Promise<void>;

      generateKeyStoreFile: (data: any) => Promise<void>;
      readKeyStoreFile: (data: any) => Promise<void>;
      readKeyStoreList: () => Promise<any>;
      deleteKeyStore: (data: any) => Promise<void>;
    };

    system: {
      minimize: () => Promise<void>;
      quit: () => Promise<void>;
      minimizeApp: () => Promise<void>;
      maximizeApp: () => Promise<void>;
    };

    renderSetting: {};

    tools: {
      getJavaVersionList: () => Promise<any>;
      setJavaVersionFolder: (data: any) => Promise<void>;
      setJavaVersionAsEnv: (data: any) => Promise<void>;
      generateKeyStoreFile: (data: any) => Promise<void>;
    };
  }
}

export {}; // Make this a module
