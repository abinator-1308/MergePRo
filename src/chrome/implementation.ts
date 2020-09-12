import { ChromeApi } from "./api";
import { fakeChrome } from "./fake-chrome";

export let chromeApiSingleton: ChromeApi;

if (!chrome.extension && process.env.NODE_ENV === "development") {
  chromeApiSingleton = fakeChrome;
} else {
  chromeApiSingleton = chrome;
}
