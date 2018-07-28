import { app } from "hyperapp";
import articlesActionsFactory from "../articles";
import sharedActionsFactory from "../shared";
import { pageState } from "./util";

const testApp = (state, actions, otherActions) => {
  const sharedActions = sharedActionsFactory({});
  return app(state, { ...actions, ...sharedActions, ...otherActions });
};

test("load home page as anonymous", async () => {
  // given
  const fetchGlobalFeed = arg => {
    fetchGlobalFeed.invokedWith = arg;
    return Promise.resolve({
      articles: [{ title: "title" }],
      articlesCount: 1
    });
  };
  const fetchTags = () => Promise.resolve({ tags: ["tag"] });
  const actions = articlesActionsFactory({
    fetchGlobalFeed,
    fetchTags
  });
  const main = testApp({}, actions);

  // when
  const result = main.loadHomePage();

  // then
  expect(main.getState()).toEqual({
    page: {
      name: "Home",
      tags: [],
      feed: {
        currentPage: 0,
        errors: [],
        feed: {
          articles: [],
          articlesCount: 0
        },
        feedSources: {
          active: "global"
        },
        isLoading: true
      }
    }
  });
  expect(fetchGlobalFeed.invokedWith).toMatchObject({ page: 0 });
  await result;
  expect(main.getState()).toEqual({
    page: {
      name: "Home",
      tags: ["tag"],
      feed: {
        currentPage: 0,
        errors: [],
        feed: {
          articles: [{ title: "title" }],
          articlesCount: 1
        },
        feedSources: {
          active: "global"
        },
        isLoading: false
      }
    }
  });
});

test("load home page as logged in user", async () => {
  // given
  const fetchUserFeed = args => {
    fetchUserFeed.invokedWith = args;
    return Promise.resolve({
      articles: [{ title: "title" }],
      articlesCount: 100
    });
  };
  const fetchTags = () => Promise.resolve({ tags: ["tag"] });
  const actions = articlesActionsFactory({
    fetchUserFeed,
    fetchTags
  });
  const state = {
    page: null,
    session: {
      user: {
        token: "some token"
      }
    }
  };
  const main = testApp(state, actions);

  // when
  const result = main.loadHomePage();

  // then
  expect(fetchUserFeed.invokedWith).toMatchObject({
    page: 0
  });
  expect(pageState(main)).toEqual({
    name: "Home",
    tags: [],
    feed: {
      currentPage: 0,
      errors: [],
      feed: {
        articles: [],
        articlesCount: 0
      },
      feedSources: {
        active: "user"
      },
      isLoading: true
    }
  });
  await result;
  expect(pageState(main)).toEqual({
    name: "Home",
    tags: ["tag"],
    feed: {
      currentPage: 0,
      errors: [],
      feed: {
        articles: [{ title: "title" }],
        articlesCount: 100
      },
      feedSources: {
        active: "user"
      },
      isLoading: false
    }
  });
});

test("change tab", async () => {
  // given
  const fetchTagFeed = args => {
    fetchTagFeed.invokedWith = args;
    return Promise.resolve({
      articles: [{ title: "title" }],
      articlesCount: 1
    });
  };
  const actions = articlesActionsFactory({
    fetchTagFeed
  });
  const state = {
    page: {
      name: "Home",
      tags: ["tag"],
      feed: {
        currentPage: 2,
        errors: [],
        feed: {
          articles: [{ title: "title" }],
          articlesCount: 1
        },
        feedSources: {
          active: "global"
        },
        isLoading: false
      }
    }
  };
  const main = testApp(state, actions);

  // when
  const result = main.changeTab("tag");

  /// then
  expect(fetchTagFeed.invokedWith).toEqual({ page: 0, tag: "tag" });
  expect(pageState(main)).toEqual({
    name: "Home",
    tags: ["tag"],
    feed: {
      currentPage: 0,
      errors: [],
      feed: {
        articles: [],
        articlesCount: 0
      },
      feedSources: {
        active: "tag"
      },
      isLoading: true
    }
  });
  await result;
  expect(pageState(main)).toEqual({
    name: "Home",
    tags: ["tag"],
    feed: {
      currentPage: 0,
      errors: [],
      feed: {
        articles: [{ title: "title" }],
        articlesCount: 1
      },
      feedSources: {
        active: "tag"
      },
      isLoading: false
    }
  });
});

test("favorite article", async () => {
  // given
  const favoriteArticle = arg => {
    favoriteArticle.invokedWith = arg;
    return Promise.resolve({ article: { slug: "slug2", favoritesCount: 50 } });
  };

  const actions = articlesActionsFactory({
    favoriteArticle
  });
  const state = {
    page: {
      feed: {
        feed: {
          articles: [
            { slug: "slug1", favoritesCount: 0 },
            { slug: "slug2", favoritesCount: 49 }
          ]
        }
      }
    }
  };
  const main = testApp(state, actions);

  // when
  const result = main.favorite("slug2");

  // then
  expect(favoriteArticle.invokedWith).toEqual({
    slug: "slug2"
  });
  await result;
  expect(main.getState()).toMatchObject({
    page: {
      feed: {
        feed: {
          articles: [
            { slug: "slug1", favoritesCount: 0 },
            { slug: "slug2", favoritesCount: 50 }
          ]
        }
      }
    }
  });
});
