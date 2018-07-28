import { app } from "hyperapp";
import articleActionsFactory from "../article";
import sharedActionsFactory from "../shared";
import { pageState } from "./util";

const testApp = (state, actions, otherActions) => {
  const sharedActions = sharedActionsFactory({});
  return app(state, { ...actions, ...sharedActions, ...otherActions });
};

test("load article page", async () => {
  // given
  const fetchArticle = () =>
    Promise.resolve({
      article: {
        title: "some title"
      }
    });
  const fetchComments = () => Promise.resolve({ comments: ["comment1"] });
  const actions = articleActionsFactory({ fetchArticle, fetchComments });
  const main = testApp({}, actions);

  // when
  const result = main.loadArticlePage();

  // then
  expect(pageState(main)).toMatchObject({
    name: "Article",
    article: {
      title: ""
    },
    comments: [],
    commentText: ""
  });
  await result;
  expect(pageState(main)).toMatchObject({
    name: "Article",
    article: {
      title: "some title"
    },
    comments: ["comment1"],
    commentText: ""
  });
});

test("create comment", async () => {
  // given
  const createComment = args => {
    createComment.invokedWith = args;
    return Promise.resolve({
      comment: "backend comment"
    });
  };
  const actions = articleActionsFactory({ createComment });
  const state = {
    page: {
      comments: ["existing"],
      commentText: "frontend comment"
    }
  };
  const main = testApp(state, actions);

  // when
  main.setCommentText("frontend comment");
  const result = main.createComment("slug");

  // then
  expect(createComment.invokedWith).toEqual({
    slug: "slug",
    comment: "frontend comment"
  });
  await result;
  expect(pageState(main)).toMatchObject({
    comments: ["backend comment", "existing"],
    commentText: ""
  });
});

test("delete comment", async () => {
  // given
  const deleteComment = args => {
    deleteComment.invokedWith = args;
    return Promise.resolve();
  };
  const actions = articleActionsFactory({ deleteComment });
  const state = {
    page: {
      comments: [{ id: "1234" }, { id: "5678" }, { id: "9101" }]
    }
  };
  const main = testApp(state, actions);

  // when
  const result = main.deleteComment({ id: "5678", slug: "slug" });

  // then
  expect(deleteComment.invokedWith).toEqual({ id: "5678", slug: "slug" });
  await result;
  expect(pageState(main)).toMatchObject({
    comments: [{ id: "1234" }, { id: "9101" }]
  });
});

test("delete article", async () => {
  // given
  const deleteArticle = args => {
    deleteArticle.invokedWith = args;
    return Promise.resolve();
  };
  const loadPage = page => {
    loadPage.invokedWith = page;
  };
  const actions = articleActionsFactory({ deleteArticle });
  const main = testApp({}, actions, { loadPage });

  // when
  const result = main.deleteArticle("slug");

  // then
  expect(deleteArticle.invokedWith).toEqual({ slug: "slug" });
  await result;
  expect(loadPage.invokedWith).toEqual("/");
});
