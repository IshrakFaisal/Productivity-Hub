export {};

type UpdateStateName = "idle" | "checking" | "available" | "downloading" | "downloaded" | "current" | "development" | "error";

declare global {
  type ProductivityHubUpdateState = {
    state: UpdateStateName;
    message: string;
    currentVersion: string;
    supported: boolean;
    releaseUrl: string;
    version?: string;
    progress?: number;
  };

  interface Window {
    productivityHub?: {
      updates: {
        getState: () => Promise<ProductivityHubUpdateState>;
        check: () => Promise<ProductivityHubUpdateState>;
        download: () => Promise<ProductivityHubUpdateState>;
        install: () => Promise<void>;
        onState: (callback: (state: ProductivityHubUpdateState) => void) => () => void;
      };
      openExternal: (url: string) => Promise<void>;
    };
  }
}
