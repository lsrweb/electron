export interface ElectronStoreApi {
  store: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
  };
}

declare global {
  interface Window {
    electron:  ElectronStoreApi;
  }
}
