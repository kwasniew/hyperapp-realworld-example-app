import { h } from "hyperapp";
import {
  ARTICLE_PAGE,
  EDITOR_PAGE,
  FAVORITE_PROFILE_PAGE,
  HOME_PAGE,
  LOGIN_PAGE,
  REGISTER_PAGE,
  SETTINGS_PAGE,
  USER_PROFILE_PAGE
} from "../consts";
import { pageNameLens, pathnameLens, userLens } from "../lenses";
import Editor from "./Editor/Editor";
import Login from "./Auth/Login";
import { FavoriteProfile, UserProfile } from "./Profile/Profile";
import Home from "./Home/Home";
import Settings from "./Settings/Settings";
import Register from "./Auth/Register";
import clientSideNav from "internal-nav-helper";
import Article from "./Article/Article";
import view from "ramda/src/view";
import Header from "./Header";

const pages = {
  [HOME_PAGE]: Home,
  [LOGIN_PAGE]: Login,
  [REGISTER_PAGE]: Register,
  [SETTINGS_PAGE]: Settings,
  [EDITOR_PAGE]: Editor,
  [ARTICLE_PAGE]: Article,
  [USER_PROFILE_PAGE]: UserProfile,
  [FAVORITE_PROFILE_PAGE]: FavoriteProfile
};

const appView = (state, actions) => {
  const pageName = view(pageNameLens, state);
  return (
    <div onclick={clientSideNav(actions.loadPage)}>
      <Header
        currentUser={view(userLens, state)}
        activePathname={view(pathnameLens, state)}
      />
      {pageName ? pages[pageName]({ state, actions }) : ""}
    </div>
  );
};

export default appView;
