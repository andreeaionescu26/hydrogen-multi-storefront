import {
  createCookieSessionStorage
} from "react-router";
class AppSession {
  constructor(sessionStorage, session) {
    this.isPending = false;
    this.#sessionStorage = sessionStorage;
    this.#session = session;
  }
  #sessionStorage;
  #session;
  static async init(request, secrets) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: "session",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secrets
      }
    });
    const session = await storage.getSession(request.headers.get("Cookie")).catch(() => storage.getSession());
    return new this(storage, session);
  }
  get has() {
    return this.#session.has;
  }
  get get() {
    return this.#session.get;
  }
  get flash() {
    return this.#session.flash;
  }
  get unset() {
    this.isPending = true;
    return this.#session.unset;
  }
  get set() {
    this.isPending = true;
    return this.#session.set;
  }
  destroy() {
    return this.#sessionStorage.destroySession(this.#session);
  }
  commit() {
    this.isPending = false;
    return this.#sessionStorage.commitSession(this.#session);
  }
}
export {
  AppSession
};
