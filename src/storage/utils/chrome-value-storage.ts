import { ChromeApi } from "../../chrome/api";
import { ValueStorage } from "../api";

export function chromeValueStorage<T>(
  chromeApi: ChromeApi,
  key: string
): ValueStorage<T | null> {
  return {
    load() {
      return loadFromStorage<T>(chromeApi, key);
    },
    save(value: T | null) {
      return saveToStorage<T>(chromeApi, key, value);
    },
  };
}

export function chromeValueStorageWithDefault<T>(
  chromeApi: ChromeApi,
  key: string,
  defaultValue: T
): ValueStorage<T> {
  return {
    async load() {
      return (await loadFromStorage<T>(chromeApi, key)) || defaultValue;
    },
    save(value: T | null) {
      return saveToStorage<T>(chromeApi, key, value);
    },
  };
}

function loadFromStorage<T>(
  chromeApi: ChromeApi,
  key: string
): Promise<T | null> {
  return new Promise<T | null>((resolve) => {
    chromeApi.storage.local.get([key], (dict) => {
      let result;
      try {
        result = JSON.parse(dict[key]);
      } catch (e) {
        result = dict[key];
      }
      resolve(result || null);
    });
  });
}

function saveToStorage<T>(
  chromeApi: ChromeApi,
  key: string,
  value: T | null
): Promise<void> {
  return new Promise<void>((resolve) => {
    chromeApi.storage.local.set(
      {
        [key]: JSON.stringify(value),
      },
      resolve
    );
  });
}
