import actions from "../router";

test("set valid route", async () => {
  const loadProfileFavoritedPage = args => {
    loadProfileFavoritedPage.invokedWith = args;
    return Promise.resolve();
  };
  await actions.setRoute("/profile/username_xyz/favorited")(
    {},
    { loadProfileFavoritedPage }
  );

  expect(loadProfileFavoritedPage.invokedWith).toEqual({
    username: "username_xyz"
  });
});

test("ignore invalid route", async () => {
  await actions.setRoute("/invalid")({}, {});
});
