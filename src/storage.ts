import Cookies from "js-cookie";

export enum LesJoursStorageTypes {
  localStorage = 1,
  cookies = 2,
}

export abstract class AbstractStorageStore {
  public readonly type: LesJoursStorageTypes;

  public constructor(type: LesJoursStorageTypes) {
    this.type = type;
  }

  /**
   * Return the key's value, or null if the key does not exist.
   * @param {string} key the name of the key you want to retrieve the value of
   * @returns {undefined|string } the value of the key or undefined if the key does not exist
   */
  public abstract getItem(key: string): undefined | string;

  /**
   * Add the key to the store, or update that key's value if it already exists.
   * @param {string} key the name of the key you want to create/update
   * @param {string} value the value you want to give the key you are creating/updating
   */
  public abstract setItem(key: string, value: string): void;

  /**
   * Remove the key from the store if it exists.
   * @param {string} keythe name of the key you want to remove
   */
  public abstract removeItem(key: string): void;
}

export class LesJoursLocalStorageStore extends AbstractStorageStore {
  public constructor() {
    super(LesJoursStorageTypes.localStorage);
  }

  public getItem(key: string): undefined | string {
    const value = window.localStorage.getItem(key);
    return value === null ? undefined : value;
  }

  public setItem(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  public removeItem(key: string): void {
    window.localStorage.removeItem(key);
  }
}

export class LesJoursCookiesStore extends AbstractStorageStore {
  private readonly expires: number;

  public constructor(expires: number) {
    super(LesJoursStorageTypes.cookies);
    this.expires = expires;
  }

  public getItem(key: string): undefined | string {
    const value = Cookies.get(key);
    return value;
  }

  public setItem(key: string, value: string): void {
    Cookies.set(key, value, { expires: this.expires });
  }

  public removeItem(key: string): void {
    Cookies.remove(key);
  }
}

/**
 * Check if we can use the localStorage.
 * @returns {boolean}
 */
export function isLocalStorageAvailable(): boolean {
  const mod = "localStorageTest";
  try {
    localStorage.setItem(mod, mod);
    localStorage.removeItem(mod);
    return true;
  } catch (e) {
    return false;
  }
}

let store: AbstractStorageStore | null = null;

/**
 * Get the default store for the browser.
 * The default store is the localStorage if it's available or the cookies.
 *
 * @param {number} expires the expires value for the cookies
 * @returns {AbstractStorageStore} the default store
 */
export function getStore(expires: number = 365): AbstractStorageStore {
  if (store === null) {
    store = isLocalStorageAvailable() ? new LesJoursLocalStorageStore() : new LesJoursCookiesStore(expires);
  }

  return store;
}
