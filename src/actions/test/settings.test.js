import { app } from "hyperapp";
import settingsActionsFactory from "../settings";
import sharedActionsFactory from "../shared";
import { pageState } from "./util";

test("load settings page as anonymous doesn't change previous state", async () => {
  // given
  const sharedActions = sharedActionsFactory({});
  const actions = settingsActionsFactory({});
  const state = {
    page: "irrelevant"
  };
  const main = app(state, { ...actions, ...sharedActions });

  // when
  main.loadSettingsPage();

  // then
  expect(main.getState()).toEqual(state);
});

test("load settings page as user", async () => {
  // given
  const fetchUser = () =>
    Promise.resolve({
      user: {
        image: "image updated",
        username: "username updated",
        bio: "bio updated",
        email: "email updated",
        token: "token"
      }
    });
  const sessionRepository = {
    save(user) {
      sessionRepository.save.invokedWith = user;
    }
  };
  const sharedActions = sharedActionsFactory({ sessionRepository });
  const actions = settingsActionsFactory({ fetchUser });
  const state = {
    page: "irrelevant",
    session: {
      user: {
        image: "image",
        username: "username",
        bio: "bio",
        email: "email",
        token: "token"
      }
    }
  };
  const main = app(state, { ...actions, ...sharedActions });

  // when
  const result = main.loadSettingsPage();

  // then
  expect(pageState(main)).toEqual({
    name: "Settings",
    inProgress: false,
    errors: {},
    user: {
      image: "image",
      username: "username",
      bio: "bio",
      email: "email"
    }
  });
  await result;
  expect(pageState(main)).toEqual({
    name: "Settings",
    inProgress: false,
    errors: {},
    user: {
      image: "image updated",
      username: "username updated",
      bio: "bio updated",
      email: "email updated"
    }
  });
});

test("update setting field", async () => {
  // given
  const actions = settingsActionsFactory({});
  const state = {
    page: {
      user: {}
    }
  };

  // when
  const newState = actions.updateSettingField({
    field: "bio",
    value: "updated"
  })(state);

  // then
  expect(newState).toEqual({
    page: {
      user: {
        bio: "updated"
      }
    }
  });
});

test("update settings success", async () => {
  // given
  const updateSettings = ({ user }) => Promise.resolve({ user: {} });
  const sessionRepository = {
    save(user) {
      sessionRepository.save.invokedWith = user;
    }
  };
  const loadPage = path => (loadPage.invokedWith = path);
  const sharedActions = sharedActionsFactory({ sessionRepository });
  const actions = settingsActionsFactory({ updateSettings });
  const state = {
    page: {
      user: {}
    }
  };
  const main = app(state, { ...actions, ...sharedActions, loadPage });

  // when
  const result = main.updateSettings();

  // then
  expect(main.getState()).toEqual({
    page: {
      inProgress: true,
      user: {}
    }
  });
  await result;
  expect(sessionRepository.save.invokedWith).toEqual({});
  expect(loadPage.invokedWith).toEqual("/");
});
