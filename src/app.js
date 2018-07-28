import { app } from "hyperapp";
import { location as locationModule } from "./router/location";
import { withLogger } from "@hyperapp/logger";
import sessionRepositoryFactory from "./storage/sessionRepository";
import { userLens } from "./lenses";
import set from "ramda/src/set";
import apiGatewayFactory from "./api/apiGateway";
import editorActionsFactory from "./actions/editor";
import articleActionsFactory from "./actions/article";
import settingsActionsFactory from "./actions/settings";
import authActionsFactory from "./actions/auth";
import articlesActionsFactory from "./actions/articles";
import profileActionsFactory from "./actions/profile";
import sharedActionsFactory from "./actions/shared";
import routerActions from "./actions/router";
import view from "./view";

export default function init({ localStorage, fetch, location }) {
  const sessionRepository = sessionRepositoryFactory(localStorage);
  const {
    fetchGlobalFeed,
    fetchUserFeed,
    fetchTagFeed,
    favoriteArticle,
    unfavoriteArticle,
    saveArticle,
    deleteArticle,
    fetchArticle,
    fetchComments,
    createComment,
    deleteComment,
    fetchProfile,
    follow,
    unfollow,
    login,
    register,
    fetchTags,
    fetchFavoritedFeed,
    fetchAuthorFeed,
    updateSettings,
    fetchUser
  } = apiGatewayFactory(fetch, sessionRepository);

  const editorActions = editorActionsFactory({ saveArticle, fetchArticle });
  const articleActions = articleActionsFactory({
    fetchArticle,
    fetchComments,
    deleteComment,
    createComment,
    deleteArticle
  });
  const settingsActions = settingsActionsFactory({ updateSettings, fetchUser });
  const authActions = authActionsFactory({
    login,
    register,
    fetchUser,
    sessionRepository
  });
  const articlesActions = articlesActionsFactory({
    fetchGlobalFeed,
    fetchUserFeed,
    fetchFavoritedFeed,
    fetchAuthorFeed,
    fetchTagFeed,
    fetchTags,
    favoriteArticle,
    unfavoriteArticle
  });
  const profileActions = profileActionsFactory({
    fetchProfile,
    follow,
    unfollow
  });
  const sharedActions = sharedActionsFactory({ sessionRepository });

  const DEFAULT_STATE = {
    location: { previous: location.pathname, pathname: location.pathname },
    page: null,
    session: {
      user: null
    }
  };
  const initState = set(userLens, sessionRepository.load(), DEFAULT_STATE);

  const actions = {
    location: locationModule.actions,
    ...editorActions,
    ...articleActions,
    ...settingsActions,
    ...authActions,
    ...articlesActions,
    ...profileActions,
    ...sharedActions,
    ...routerActions
  };

  // const main = withLogger(app)(initState, actions, view, document.body)
  const main = app(initState, actions, view, document.body);

  const unsubscribe = locationModule.subscribe(main.location);
  addEventListener("popstate", () => main.setRoute(location.pathname));
  main.loadPage(location.pathname);

  return { main, unsubscribe };
}
