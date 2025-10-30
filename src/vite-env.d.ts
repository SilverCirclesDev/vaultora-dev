/// <reference types="vite/client" />

interface Window {
  LiveChatWidget?: {
    call: (method: string, ...args: any[]) => void;
    on: (event: string, callback: (...args: any[]) => void) => void;
  };
  __lc?: {
    license: number;
    asyncInit?: boolean;
  };
}
