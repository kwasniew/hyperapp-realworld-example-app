import { app } from "hyperapp";
import editorActionsFactory from "../editor";
import sharedActionsFactory from "../shared";
import { pageState } from "./util";

const testApp = (state, actions, otherActions) => {
  const sharedActions = sharedActionsFactory({});
  return app(state, { ...actions, ...sharedActions, ...otherActions });
};

test("load new editor page", async () => {
  // given
  const actions = editorActionsFactory({});
  const main = testApp({}, actions);

  // when
  main.loadEditorPage();

  // then
  expect(pageState(main)).toMatchObject({
    name: "Editor",
    editor: {
      title: ""
    }
  });
});

test("load existing article editor page", async () => {
  // given
  const fetchArticle = args => {
    fetchArticle.invokedWith = args;
    return Promise.resolve({
      article: {
        title: "title",
        description: "description",
        body: "body",
        tagList: ["tag1", "tag2"],
        ignoreField: "ignore"
      }
    });
  };
  const actions = editorActionsFactory({ fetchArticle });
  const main = testApp({}, actions);

  // when
  const result = main.loadEditorPage({ slug: "slug" });

  // then
  expect(pageState(main)).toMatchObject({
    name: "Editor",
    editor: {
      title: ""
    }
  });
  expect(fetchArticle.invokedWith).toEqual({ slug: "slug" });
  const asyncState = await result;
  expect(asyncState.page).toMatchObject({
    editor: {
      title: "title",
      description: "description",
      body: "body",
      tagList: ["tag1", "tag2"]
    }
  });
});

test("update field", async () => {
  // given
  const actions = editorActionsFactory({});
  const state = {
    page: {
      editor: {
        title: "title",
        description: "description"
      }
    }
  };
  const main = testApp(state, actions);

  // when
  const newState = main.updateField({ field: "title", value: "title updated" });

  // then
  expect(newState.page).toMatchObject({
    editor: {
      title: "title updated",
      description: "description"
    }
  });
});

test("add tag", async () => {
  // given
  const actions = editorActionsFactory({});
  const state = {
    page: {
      editor: {
        currentTag: "tag2",
        tagList: ["tag1"]
      }
    }
  };
  const main = testApp(state, actions);

  // when
  const newState = main.addTag();

  // then
  expect(newState.page).toMatchObject({
    editor: {
      currentTag: "",
      tagList: ["tag1", "tag2"]
    }
  });
});

test("remove tag", async () => {
  // given
  const actions = editorActionsFactory({});
  const state = {
    page: {
      editor: {
        tagList: ["tag1", "tag2", "tag3"]
      }
    }
  };
  const main = testApp(state, actions);

  // when
  const newState = main.removeTag("tag2");

  // then
  expect(newState.page).toMatchObject({
    editor: {
      tagList: ["tag1", "tag3"]
    }
  });
});

test("save article", async () => {
  // given
  const saveArticle = args => {
    saveArticle.invokedWith = args;
    return Promise.resolve({
      article: {
        slug: "slug"
      }
    });
  };
  const actions = editorActionsFactory({ saveArticle });
  const state = {
    page: {
      editor: {
        title: "title",
        description: "description",
        body: "body",
        tagList: ["tag1"]
      }
    }
  };
  const loadPage = path => {
    loadPage.invokedWith = path;
  };
  const main = testApp(state, actions, { loadPage });

  // when
  const result = main.saveArticle();

  // then
  expect(pageState(main)).toMatchObject({
    editor: {
      title: "title",
      description: "description",
      body: "body",
      tagList: ["tag1"]
    },
    inProgress: true
  });
  await result;
  expect(loadPage.invokedWith).toEqual("/article/slug");
});
