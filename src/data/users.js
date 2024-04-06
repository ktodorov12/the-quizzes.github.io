import { clearUserData, getUserData, setUserData } from "../util.js";
import { post } from "./requester.js";

const endpoints = {
  login: "/login",
  register: "/users",
  logout: "/logout",
};

/** @param {{username: string, password: string}} data*/
export async function login(data) {
  const loginData = await post(endpoints.login, data);
  setUserData(loginData);
  updateNav();
}

/** @param {{username: string, password: string, email:string}} data */
export async function register(data) {
  const registerData = await post(endpoints.register, data);
  setUserData(registerData);
  updateNav();
}

export async function logout() {
  const promise = post(endpoints.logout, {});
  clearUserData();
  updateNav();
  await promise;
}

export function updateNav() {
  //TODO update the corresponding nav
  const userdata = getUserData();
  document.querySelector(".user").style.display = userdata ? "inline-block" : "none";
  document.querySelector(".guest").style.display = userdata ? "none" : "inline-block";
}
