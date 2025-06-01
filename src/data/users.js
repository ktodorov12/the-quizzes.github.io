import { clearUserData, setUserData } from "../../src/util.js";
import { post } from "../../src/data/requester.js";

const endpoints = {
  login: "/login",
  register: "/users",
  logout: "/logout",
};

/** @param {{username: string, password: string}} data*/
export async function login(data) {
  const loginData = await post(endpoints.login, data);
  setUserData(loginData);
}

/** @param {{username: string, password: string, email:string}} data */
export async function register(data) {
  const registerData = await post(endpoints.register, data);
  setUserData(registerData);
}

export async function logout() {
  const promise = post(endpoints.logout, {});
  clearUserData();
  await promise;
}