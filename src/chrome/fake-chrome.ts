import { RecursivePartial } from "../testing/recursive-partial";
import { ChromeApi, ChromeStorageItems } from "./api";

// fake implementation for dev purpose

const partialFakeChrome: RecursivePartial<ChromeApi> = {
  browserAction: {},
  runtime: {
    // Sending a message won't do anything, but we can at least log it.
    sendMessage(message: unknown) {
      console.log("chrome.runtime.sendMessage", message);
    },
    onMessage: {
      addListener(
        callback: (
          message: unknown,
          sender: chrome.runtime.MessageSender,
          sendResponse: (response?: unknown) => void
        ) => void
      ) {
        console.log("chrome.runtime.onMessage.addListener", callback);
      },
    },
  },
  permissions: {
    request(
      _permissions: chrome.permissions.Permissions,
      callback?: (granted: boolean) => void
    ) {
      if (callback) {
        callback(true);
      }
    },
    getAll(callback: (permissions: chrome.permissions.Permissions) => void) {
      callback({});
    },
  },
  storage: {
    // To simulate chrome.storage.local, we simply fall back to the localStorage API.
    local: {
      set(items: ChromeStorageItems, callback?: () => void) {
        for (const [key, value] of Object.entries(items)) {
          localStorage.setItem(key, JSON.stringify(value));
        }
        if (callback) {
          callback();
        }
      },
      get(keys: string[], callback: (items: ChromeStorageItems) => void) {
        callback(
          keys.reduce<ChromeStorageItems>((acc, key) => {
            const json = localStorage.getItem(key);
            acc[key] = json ? JSON.parse(json) : null;
            return acc;
          }, {})
        );
      },
    },
  },
};

export const fakeChrome = partialFakeChrome as ChromeApi;
