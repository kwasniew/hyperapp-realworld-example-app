import view from "ramda/src/view";
import {
  FAVORITE_PROFILE_PAGE,
  GLOBAL_FEED,
  HOME_PAGE,
  USER_FEED,
  USER_PROFILE_PAGE
} from "../consts";
import over from "ramda/src/over";
import set from "ramda/src/set";
import {
  activeFeedLens,
  articlesLens,
  articlesListLens,
  currentPageLens,
  isLoadingLens,
  sessionUsernameLens,
  tagsLens,
  tokenLens
} from "../lenses";
import map from "ramda/src/map";
import { LOGIN } from "../links";
import { FEED, DEFAULT_ARTICLES } from "./shared";

const DEFAULT_ARTICLES_PAGE = active => ({
  ...FEED(active),
  name: HOME_PAGE
});
const DEFAULT_FEED = DEFAULT_ARTICLES_PAGE(GLOBAL_FEED);
const DEFAULT_USER_FEED = DEFAULT_ARTICLES_PAGE(USER_FEED);

const actionsFactory = ({
  fetchGlobalFeed,
  fetchUserFeed,
  fetchFavoritedFeed,
  fetchAuthorFeed,
  fetchTagFeed,
  fetchTags,
  favoriteArticle,
  unfavoriteArticle
}) => ({
  fetchArticles: ({ page = 0, username } = {}) => (state, actions) => {
    const activeFeed = view(activeFeedLens, state);

    const feedActions = {
      [GLOBAL_FEED]: fetchGlobalFeed,
      [USER_FEED]: fetchUserFeed,
      [FAVORITE_PROFILE_PAGE]: fetchFavoritedFeed,
      [USER_PROFILE_PAGE]: fetchAuthorFeed
    };
    actions.loadingArticlesStarted();
    return (feedActions[activeFeed] || fetchTagFeed)({
      page,
      tag: activeFeed,
      username
    })
      .then(actions.setArticles)
      .then(() => actions.loadingArticlesFinished());
  },
  fetchUserArticles: ({ username, page = 0 }) => (state, actions) => {
    return actions.fetchArticles({
      page,
      username: username || view(sessionUsernameLens, state)
    });
  },
  fetchTags: () => (state, actions) => {
    return fetchTags().then(data => actions.setTags(data.tags));
  },
  favorite: slug => (state, actions) => {
    return view(tokenLens, state)
      ? favoriteArticle({
          slug
        }).then(data => actions.updateSingleArticle(data.article))
      : actions.loadPage(LOGIN);
  },
  unfavorite: slug => (state, actions) => {
    return unfavoriteArticle({
      slug
    }).then(data => actions.updateSingleArticle(data.article));
  },
  updateSingleArticle: article => state => {
    return over(
      articlesListLens,
      map(current => (current.slug === article.slug ? article : current)),
      state
    );
  },
  setArticles: articles => state => {
    return set(articlesLens, articles, state);
  },
  resetArticles: () => state => {
    return set(articlesLens, DEFAULT_ARTICLES, state);
  },
  setTags: tags => state => {
    return set(tagsLens, tags, state);
  },
  changePage: page => (state, actions) => {
    return actions
      .fetchArticles({ page })
      .then(() => actions.setCurrentPage(page));
  },
  changeUserPage: page => (state, actions) => {
    return actions
      .fetchUserArticles({ page })
      .then(() => actions.setCurrentPage(page));
  },
  setCurrentPage: currentPage => state => {
    return set(currentPageLens, currentPage, state);
  },
  setTab: tab => state => {
    return set(activeFeedLens, tab, state);
  },
  changeTab: tab => (state, actions) => {
    actions.setTab(tab);
    actions.resetArticles();
    actions.setCurrentPage(0);
    return actions.fetchArticles();
  },
  loadingArticlesStarted: () => state => {
    return set(isLoadingLens, true, state);
  },
  loadingArticlesFinished: () => state => {
    return set(isLoadingLens, false, state);
  },
  loadUserArticles: ({ type, username }) => (state, actions) => {
    actions.setTab(type);
    return actions.fetchUserArticles({ username });
  },
  loadHomePage: () => (state, actions) => {
    view(tokenLens, state)
      ? actions.setPage(DEFAULT_USER_FEED)
      : actions.setPage(DEFAULT_FEED);
    return Promise.all([actions.fetchArticles(), actions.fetchTags()]);
  }
});

export default actionsFactory;
