import { app } from "hyperapp";
import profileActionsFactory from "../profile";
import sharedActionsFactory from "../shared";
import { pageState } from "./util";

const testApp = (state, actions, otherActions) => {
  const sharedActions = sharedActionsFactory({});
  return app(state, { ...actions, ...sharedActions, ...otherActions });
};

test("load profile page", async () => {
  // given
  const fetchProfile = args => {
    fetchProfile.invokedWith = args;
    return Promise.resolve({
      profile: {
        username: "username"
      }
    });
  };
  const loadUserArticles = args => {
    loadUserArticles.invokedWith = args;
    return Promise.resolve();
  };
  const actions = profileActionsFactory({ fetchProfile });
  const main = testApp({}, actions, { loadUserArticles });

  // when
  const result = main.loadUserProfilePage({ username: "username" });

  // then
  expect(fetchProfile.invokedWith).toEqual({ username: "username" });
  expect(loadUserArticles.invokedWith).toEqual({
    username: "username",
    type: "UserProfile"
  });
  await result;
  expect(pageState(main)).toMatchObject({
    profile: {
      username: "username"
    }
  });
});

test("follow", async () => {
  // given
  const follow = args => {
    follow.invokedWith = args;
    return Promise.resolve({
      profile: {
        username: "username",
        following: true
      }
    });
  };
  const actions = profileActionsFactory({ follow });
  const main = testApp({}, actions);

  // when
  const result = main.follow("username");

  // then
  expect(follow.invokedWith).toEqual({ username: "username" });
  await result;
  expect(pageState(main)).toMatchObject({
    profile: {
      username: "username",
      following: true
    }
  });
});

test("unfollow", async () => {
  // given
  const unfollow = args => {
    unfollow.invokedWith = args;
    return Promise.resolve({
      profile: {
        username: "username",
        following: false
      }
    });
  };
  const actions = profileActionsFactory({ unfollow });
  const main = testApp({}, actions);

  // when
  const result = main.unfollow("username");

  // then
  expect(unfollow.invokedWith).toEqual({ username: "username" });
  await result;
  expect(pageState(main)).toMatchObject({
    profile: {
      username: "username",
      following: false
    }
  });
});
