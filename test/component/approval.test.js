import init from "../../src/app";
import pretty from "pretty";
import globalFeed from "./test_data/globalFeed";
import globalFeedPaginated from "./test_data/globalFeedPaginated";
import tagFeed from "./test_data/tagFeed";
import tags from "./test_data/tags";
import registerError from "./test_data/registerError";
import signupSuccess from "./test_data/signupSuccess";
import emptyFeed from "./test_data/emptyFeed";
import loginError from "./test_data/loginError";
import loginSuccess from "./test_data/loginSuccess";
import profileSuccess from "./test_data/profileSuccess";
import createArticleError from "./test_data/createArticleError";
import createArticleSuccess from "./test_data/createArticleSuccess";
import commentsFeed from "./test_data/comments";
import {
  getByText,
  wait,
  waitForElement
} from "dom-testing-library";
import "jest-dom/extend-expect";
import {createLocalStorage} from "./localStorage";
import {createFetch} from "./fetch";
import {click, type, enter, elements, elementWithValue, element} from "./dom";


const setLocation = path => window.history.pushState(null, "", path);

const headers = {
  Authorization:
    "Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MzI5MDcsInVzZXJuYW1lIjoidGVzdHVzZXI5OSIsImV4cCI6MTUzNjQ5NjU1OH0.FahoNcPFJ-nsxnaZjvVVS_FVyGnl0167nWglkiUVxsQ"
};
const ARTICLE_PREVIEW = ".article-preview";
const TAG = ".tag-pill";
const PAGINATION_LINK = ".page-item.active > a";
const TAG_PILL = ".tag-list .tag-pill";
const TAGGED_PREVIEW = ".article-preview .tag-pill";
const NAV = ".nav-link";
const BUTTON = "button";
const DISABLED_BUTTON = "button[disabled]";
const ERRORS = ".error-messages > li";
const USERNAME_INPUT = 'input[placeholder="Username"]';
const EMAIL_INPUT = 'input[placeholder="Email"]';
const PASSWORD_INPUT = 'input[placeholder="Password"]';
const USER_INFO = ".user-info";
const ARTICLE_TITLE = 'input[placeholder="Article Title"]';
const ARTICLE_DESCRIPTION = 'input[placeholder="What\'s this article about?"]';
const ARTICLE_BODY = 'textarea[placeholder^="Write your article"]';
const ARTICLE_TAGS = 'input[placeholder="Enter tags"]';

const withApp = ({ localStorage, fetch, initPath = "/" }) => async testBody => {
  document.body.innerHTML = "";
  setLocation(initPath);

  const { unsubscribe, main } = init({
    localStorage,
    fetch,
    location: window.location
  });
  try {
    await testBody(main);
  } finally {
    unsubscribe();
  }
};

test("global feed", async () => {
  const localStorage = createLocalStorage();
  const fetch = createFetch(
    ["/api/articles?limit=10&offset=0", globalFeed],
    ["/api/tags", tags]
  );
  await withApp({ localStorage, fetch })(async () => {
    await wait(() => {
      expect(element(ARTICLE_PREVIEW)()).toBeInTheDOM();
      expect(element(TAG)()).toBeInTheDOM();
    });
    expect(pretty(document.body.innerHTML)).toMatchSnapshot();
  });
});

test("global feed pagination", async () => {
  const localStorage = createLocalStorage();
  const fetch = createFetch(
    ["/api/articles?limit=10&offset=0", globalFeed],
    ["/api/articles?limit=10&offset=50", globalFeedPaginated],
    ["/api/tags", tags]
  );
  await withApp({ localStorage, fetch })(async () => {
    await wait(() => {
      expect(element(ARTICLE_PREVIEW)()).toBeInTheDOM();
      expect(element(TAG)()).toBeInTheDOM();
    });

    click(getByText(document.body, "6"));

    await wait(() =>
      expect(elementWithValue(PAGINATION_LINK, "6")()).toBeInTheDOM()
    );
    expect(pretty(document.body.innerHTML)).toMatchSnapshot();
  });
});

test("tag feed", async () => {
  const localStorage = createLocalStorage();
  const fetch = createFetch(
    ["/api/articles?limit=10&offset=0", globalFeed],
    ["/api/tags", tags],
    ["/api/articles?tag=sushi&limit=10&offset=0", tagFeed]
  );
  await withApp({ localStorage, fetch })(async () => {
    const tagElement = await waitForElement(
      elementWithValue(TAG_PILL, "sushi"),
      { container: document.body }
    );
    click(tagElement);

    await wait(() =>
      expect(elements(TAGGED_PREVIEW, "sushi")()).toHaveLength(10)
    );
    expect(pretty(document.body.innerHTML)).toMatchSnapshot();
  });
});

test("navigate to sign up", async () => {
  const localStorage = createLocalStorage();
  const fetch = createFetch(
    ["/api/articles?limit=10&offset=0", globalFeed],
    ["/api/tags", tags]
  );
  await withApp({ localStorage, fetch })(async () => {
    const signUpLink = await waitForElement(elementWithValue(NAV, "Sign up"), {
      container: document.body
    });
    click(signUpLink);

    await wait(
      () => expect(elementWithValue(BUTTON, "Sign up")()).toBeInTheDOM
    );
    expect(pretty(document.body.innerHTML)).toMatchSnapshot();
  });
});

test("sign up failure", async () => {
  // given
  const localStorage = createLocalStorage();
  const fetch = createFetch([
    "/api/users",
    {
      method: "POST",
      body: JSON.stringify({
        user: {
          email: "",
          password: "",
          username: ""
        }
      })
    },
    { status: 422, body: registerError }
  ]);
  await withApp({ localStorage, fetch, initPath: "/register" })(async () => {
    const signUpButton = await waitForElement(
      elementWithValue(BUTTON, "Sign up"),
      { container: document.body }
    );
    click(signUpButton);

    await wait(
      () => elementWithValue(DISABLED_BUTTON, "Sign up")().toBeInTheDOM
    );
    await wait(() => element(ERRORS)().toBeInTheDOM);

    expect(pretty(document.body.innerHTML)).toMatchSnapshot();
  });
});

test("sign up success", async () => {
  const localStorage = createLocalStorage();
  const fetch = createFetch(
    ["/api/tags", tags],
    [
      "/api/users",
      {
        method: "POST",
        body: JSON.stringify({
          user: {
            email: "testuser@gmail.com",
            password: "testuserpass",
            username: "testuser"
          }
        })
      },
      { status: 200, body: signupSuccess }
    ],
    [
      "/api/articles/feed?limit=10&offset=0",
      {
        headers: {
          Authorization: headers.Authorization
        }
      },
      { status: 200, body: emptyFeed }
    ]
  );
  await withApp({ localStorage, fetch, initPath: "/register" })(async () => {
    const signUpButton = await waitForElement(
      elementWithValue(BUTTON, "Sign up"),
      { container: document.body }
    );
    type(element(USERNAME_INPUT), "testuser");
    type(element(EMAIL_INPUT), "testuser@gmail.com");
    type(element(PASSWORD_INPUT), "testuserpass");
    click(signUpButton);

    await wait(() => {
      expect(
        elementWithValue(ARTICLE_PREVIEW, "No articles are here... yet.")()
      ).toBeInTheDOM();
      expect(element(TAG)()).toBeInTheDOM();
    });
    expect(pretty(document.body.innerHTML)).toMatchSnapshot();
  });
});

test("log in failure", async () => {
  const localStorage = createLocalStorage();
  const fetch = createFetch(
    ["/api/tags", tags],
    [
      "/api/users/login",
      {
        method: "POST",
        body: JSON.stringify({
          user: {
            email: "",
            password: ""
          }
        })
      },
      { status: 422, body: loginError }
    ]
  );
  await withApp({ localStorage, fetch, initPath: "/login" })(async () => {
    const signInButton = await waitForElement(
      elementWithValue(BUTTON, "Sign in"),
      { container: document.body }
    );
    click(signInButton);

    await wait(
      () => elementWithValue(DISABLED_BUTTON, "Sign in")().toBeInTheDOM
    );
    await wait(() => element(ERRORS)().toBeInTheDOM);
    expect(pretty(document.body.innerHTML)).toMatchSnapshot();
  });
});

test("log in success", async () => {
  // given
  const localStorage = createLocalStorage();
  const fetch = createFetch(
    ["/api/tags", tags],
    [
      "/api/users/login",
      {
        method: "POST",
        body: JSON.stringify({
          user: {
            email: "testuser@gmail.com",
            password: "testuserpass"
          }
        })
      },
      { status: 200, body: loginSuccess }
    ],
    [
      "/api/articles/feed?limit=10&offset=0",
      {
        headers: {
          Authorization: headers.Authorization
        }
      },
      { status: 200, body: emptyFeed }
    ]
  );
  await withApp({ localStorage, fetch, initPath: "/login" })(async () => {
    const signInButton = await waitForElement(
      elementWithValue(BUTTON, "Sign in"),
      { container: document.body }
    );

    type(element(EMAIL_INPUT), "testuser@gmail.com");
    type(element(PASSWORD_INPUT), "testuserpass");
    click(signInButton);

    await wait(() => {
      expect(
        elementWithValue(ARTICLE_PREVIEW, "No articles are here... yet.")()
      ).toBeInTheDOM();
      expect(element(TAG)()).toBeInTheDOM();
    });

    expect(pretty(document.body.innerHTML)).toMatchSnapshot();
  });
});

test("user profile page with empty feed", async () => {
  // given
  const localStorage = createLocalStorage();
  localStorage.setItem("session", JSON.stringify(loginSuccess.user));
  const fetch = createFetch(
    [
      "/api/profiles/testuser",
      {
        headers: {
          Authorization: headers.Authorization
        }
      },
      profileSuccess
    ],
    [
      "/api/articles?author=testuser&limit=5&offset=0",
      {
        headers: {
          Authorization: headers.Authorization
        }
      },
      { status: 200, body: emptyFeed }
    ]
  );
  await withApp({ localStorage, fetch, initPath: "/profile/testuser" })(
    async () => {
      await wait(() => {
        expect(element(USER_INFO)()).toBeInTheDOM();
        expect(
          elementWithValue(ARTICLE_PREVIEW, "No articles are here... yet.")()
        ).toBeInTheDOM();
      });

      expect(pretty(document.body.innerHTML)).toMatchSnapshot();
    }
  );
});

test("post creation failure", async () => {
  // given
  const localStorage = createLocalStorage();
  localStorage.setItem("session", JSON.stringify(loginSuccess.user));
  const fetch = createFetch([
    "/api/articles",
    {
      method: "POST",
      headers: {
        Authorization: headers.Authorization
      },
      body: JSON.stringify({
        article: {
          title: "",
          description: "",
          body: "",
          tagList: []
        }
      })
    },
    { status: 422, body: createArticleError }
  ]);
  await withApp({ localStorage, fetch, initPath: "/editor" })(async () => {
    const publishButton = await waitForElement(
      elementWithValue(BUTTON, "Publish Article"),
      { container: document.body }
    );
    click(publishButton);

    await wait(() =>
      expect(
        elementWithValue(DISABLED_BUTTON, "Publish Article")()
      ).toBeInTheDOM()
    );
    await wait(() => expect(element(ERRORS)()).toBeInTheDOM());
    expect(pretty(document.body.innerHTML)).toMatchSnapshot();
  });
});

test("post creation success", async () => {
  // given
  const localStorage = createLocalStorage();
  localStorage.setItem("session", JSON.stringify(loginSuccess.user));
  const fetch = createFetch(
    [
      "/api/articles",
      {
        method: "POST",
        headers: {
          Authorization: headers.Authorization
        },
        body: JSON.stringify({
          article: {
            title: "title",
            description: "description",
            body: "### markdown",
            tagList: ["dragons", "sushi"]
          }
        })
      },
      { status: 200, body: createArticleSuccess }
    ],
    ["/api/articles/test-sdiuuj", createArticleSuccess],
    ["/api/articles/test-sdiuuj/comments", commentsFeed]
  );

  await withApp({ localStorage, fetch, initPath: "/editor" })(async () => {
    const publishButton = await waitForElement(
      elementWithValue(BUTTON, "Publish Article"),
      { container: document.body }
    );

    type(element(ARTICLE_TITLE), "title");
    type(element(ARTICLE_DESCRIPTION), "description");
    type(element(ARTICLE_BODY), "### markdown");
    type(element(ARTICLE_TAGS), "dragons");
    enter(element(ARTICLE_TAGS));
    type(element(ARTICLE_TAGS), "sushi");
    enter(element(ARTICLE_TAGS));
    type(element(ARTICLE_TAGS), "mistake");
    enter(element(ARTICLE_TAGS));
    const mistakeTag = await waitForElement(
      () => document.querySelector(".tag-pill:last-of-type i"),
      { container: document.body }
    );
    click(mistakeTag);

    click(publishButton);

    await wait(() =>
      expect(window.location.pathname).toBe("/article/test-sdiuuj")
    );
  });
});
