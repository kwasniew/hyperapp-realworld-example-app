import { parseRoute } from "../router/parseRoute";
import * as links from "../links";

const findRoute = (routes, path) => {
  const route = routes.find(route => match(route[0], path));
  return route ? [...route, match(route[0], path).params] : [];
};

const match = (routeTemplate, path) => {
  return parseRoute(routeTemplate, path, { exact: true });
};

const actions = {
  setRoute: path => (state, actions) => {
    const routes = [
      [links.HOME, actions.loadHomePage],
      [links.LOGIN, actions.loadLoginPage],
      [links.REGISTER, actions.loadRegisterPage],
      [links.SETTINGS, actions.loadSettingsPage],
      [links.NEW_EDITOR, actions.loadEditorPage],
      [links.EDITOR, actions.loadEditorPage],
      [links.ARTICLE, actions.loadArticlePage],
      [links.PROFILE, actions.loadUserProfilePage],
      [links.PROFILE_FAVORITED, actions.loadProfileFavoritedPage]
    ];
    const [, action, params] = findRoute(routes, path);
    return action ? action(params) : Promise.resolve();
  },
  loadPage: path => (state, actions) => {
    actions.setRoute(path);
    actions.location.go(path);
  }
};

export default actions;
