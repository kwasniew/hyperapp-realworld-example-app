import { app } from "hyperapp";
import authActionsFactory from "../auth";
import sharedActionsFactory from "../shared";
import { pageState, userState } from "./util";

const testApp = (state, actions, otherActions) => {
  const sharedActions = sharedActionsFactory({});
  return app(state, { ...actions, ...sharedActions, ...otherActions });
};

test("load login page", async () => {
  // given
  const actions = authActionsFactory({});
  const main = testApp({}, actions);

  // when
  const state = main.loadLoginPage();

  // then
  expect(state.page).toEqual({
    name: "Login",
    email: "",
    password: "",
    inProgress: false,
    errors: {}
  });
});

test("load register page", async () => {
  // given
  const actions = authActionsFactory({});
  const main = testApp({}, actions);

  // when
  const state = main.loadRegisterPage();

  // then
  expect(state.page).toEqual({
    name: "Register",
    email: "",
    password: "",
    username: "",
    inProgress: false,
    errors: {}
  });
});

test("change fields", async () => {
  // given
  const actions = authActionsFactory({});
  const main = testApp({}, actions);

  // when
  main.changeEmail("email");
  main.changeUsername("username");
  const state = main.changePassword("password");

  // then
  expect(state.page).toEqual({
    email: "email",
    password: "password",
    username: "username"
  });
});

test("login success", async () => {
  // given
  const login = args => {
    login.invokedWith = args;
    return Promise.resolve({ user: {} });
  };
  const actions = authActionsFactory({ login });
  const state = {
    page: {
      email: "email",
      password: "password"
    }
  };
  const loadPage = path => (loadPage.invokedWith = path);
  const sessionRepository = {
    save(args) {
      sessionRepository.save.invokedWith = args;
    }
  };
  const sharedActions = sharedActionsFactory({ sessionRepository });
  const main = app(state, { ...actions, ...sharedActions, loadPage });

  // when
  const result = main.login();

  // then
  expect(login.invokedWith).toEqual({ email: "email", password: "password" });
  expect(pageState(main)).toEqual({
    email: "email",
    password: "password",
    inProgress: true
  });
  await result;
  expect(userState(main)).toEqual({});
  expect(sessionRepository.save.invokedWith).toEqual({});
  expect(loadPage.invokedWith).toEqual("/");
});

test("login failure", async () => {
  // given
  const login = args => {
    login.invokedWith = args;
    return Promise.reject({ errors: "errors" });
  };
  const actions = authActionsFactory({ login });
  const state = {
    page: {
      email: "email",
      password: "password"
    }
  };
  const sharedActions = sharedActionsFactory({});
  const main = app(state, { ...actions, ...sharedActions });

  // when
  const result = main.login();

  // then
  expect(login.invokedWith).toEqual({ email: "email", password: "password" });
  expect(pageState(main)).toEqual({
    email: "email",
    password: "password",
    inProgress: true
  });
  const failedState = await result;
  expect(failedState.page).toEqual({
    email: "email",
    password: "password",
    inProgress: false,
    errors: "errors"
  });
});

test("logout", async () => {
  // given user is logged in
  const sessionRepository = {
    clear() {
      sessionRepository.clear.invoked = true;
    }
  };
  const state = {
    session: {
      user: {}
    }
  };
  const loadPage = path => (loadPage.invokedWith = path);
  const actions = authActionsFactory({ sessionRepository });
  const sharedActions = sharedActionsFactory({ sessionRepository });
  const main = app(state, { ...actions, ...sharedActions, loadPage });

  // when I logout
  const result = main.logout();

  // then use is logged out
  expect(userState(main)).toBe(null);
  expect(sessionRepository.clear.invoked).toBe(true);
  await result;
  expect(loadPage.invokedWith).toBe("/");
});
