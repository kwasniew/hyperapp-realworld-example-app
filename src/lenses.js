import lensPath from "ramda/src/lensPath";
import lensProp from "ramda/src/lensProp";
import compose from "ramda/src/compose";
import view from "ramda/src/view";

const pageLens = lensProp("page");
const feedLens = compose(
  pageLens,
  lensProp("feed")
);
const isLoadingLens = compose(
  feedLens,
  lensProp("isLoading")
);
const feedSourcesLens = compose(
  feedLens,
  lensProp("feedSources")
);
const activeFeedLens = compose(
  feedSourcesLens,
  lensProp("active")
);

const userLens = lensPath(["session", "user"]);
const sessionUsernameLens = compose(
  userLens,
  lensProp("username")
);

const tokenLens = compose(
  userLens,
  lensProp("token")
);
const articlesLens = compose(
  feedLens,
  lensProp("feed")
);
const articlesListLens = compose(
  articlesLens,
  lensProp("articles")
);
const currentPageLens = compose(
  feedLens,
  lensProp("currentPage")
);
const pageFieldLens = field =>
  compose(
    pageLens,
    lensProp(field)
  );
const tagsLens = pageFieldLens("tags");
const pageNameLens = pageFieldLens("name");
const emailLens = pageFieldLens("email");
const passwordLens = pageFieldLens("password");
const usernameLens = pageFieldLens("username");
const inProgressLens = pageFieldLens("inProgress");
const errorsLens = pageFieldLens("errors");
const settingsUserLens = pageFieldLens("user");
const userFieldLens = field =>
  compose(
    settingsUserLens,
    lensProp(field)
  );
const editorLens = pageFieldLens("editor");
const tagListLens = compose(
  editorLens,
  lensProp("tagList")
);
const articleLens = pageFieldLens("article");
const commentsLens = pageFieldLens("comments");
const articleAuthorUsernameLens = lensPath([
  "page",
  "article",
  "author",
  "username"
]);
const commentTextLens = pageFieldLens("commentText");

const profileLens = pageFieldLens("profile");
const profileUsernameLens = compose(
  profileLens,
  lensProp("username")
);
const editorFieldLens = field => lensPath(["page", "editor", field]);
const pathnameLens = lensPath(["location", "pathname"]);

const canModifyArticleSelector = state =>
  canModifySelector(state)(view(articleAuthorUsernameLens, state));

const canModifySelector = state => author => {
  const loggedIn = view(sessionUsernameLens, state);
  return loggedIn && author && loggedIn === author;
};
const isUserSelector = state => {
  const username = view(sessionUsernameLens, state);
  const profilename = view(profileUsernameLens, state);
  return username && username === profilename;
};

export {
  isLoadingLens,
  activeFeedLens,
  feedSourcesLens,
  tokenLens,
  articlesLens,
  articlesListLens,
  currentPageLens,
  tagsLens,
  pageLens,
  emailLens,
  usernameLens,
  passwordLens,
  inProgressLens,
  errorsLens,
  userLens,
  pageNameLens,
  pageFieldLens,
  userFieldLens,
  tagListLens,
  articleLens,
  commentsLens,
  commentTextLens,
  profileLens,
  profileUsernameLens,
  canModifyArticleSelector,
  canModifySelector,
  isUserSelector,
  settingsUserLens,
  editorFieldLens,
  editorLens,
  pathnameLens,
  sessionUsernameLens
};
