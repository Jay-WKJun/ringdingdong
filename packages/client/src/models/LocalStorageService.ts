const DEFAULT_KEY = "talk-to-me-token";

export class LocalStorageService {
  private key: string;

  constructor(key = DEFAULT_KEY) {
    this.isWindowExist();

    this.key = key;
  }

  private isWindowExist() {
    if (!window) {
      throw new Error("window is not defined - Talk to me");
    }
    return true;
  }

  getLocalStorage() {
    this.isWindowExist();
    return window.localStorage.getItem(this.key);
  }

  setLocalStorage(value: string) {
    this.isWindowExist();
    window.localStorage.setItem(this.key, value);
  }
}
