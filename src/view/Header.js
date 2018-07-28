import { h } from "hyperapp";
import {
  EDITOR,
  HOME,
  LOGIN,
  NEW_EDITOR,
  REGISTER,
  SETTINGS,
  profileLink
} from "../links";
import { pathnameLens, userLens } from "../lenses";
import view from "ramda/src/view";
import isEmpty from "ramda/src/isEmpty";

const active = (activePathname, path) => {
  return activePathname === path ? "active" : "";
};

const NavItem = ({ path, activePathname }, children) => (
  <li class="nav-item">
    <a class={"nav-link " + active(activePathname, path)} href={path}>
      {children}
    </a>
  </li>
);

const LoggedInView = ({ currentUser, activePathname }) => (
  <ul class="nav navbar-nav pull-xs-right">
    <NavItem activePathname={activePathname} path={HOME}>
      Home
    </NavItem>
    <NavItem activePathname={activePathname} path={NEW_EDITOR}>
      <i class="ion-compose" />&nbsp;New Post
    </NavItem>
    <NavItem activePathname={activePathname} path={SETTINGS}>
      <i class="ion-gear-a" />&nbsp;Settings
    </NavItem>
    <NavItem
      activePathname={activePathname}
      path={profileLink(currentUser.username)}
    >
      {currentUser.image ? (
        <img
          src={currentUser.image}
          class="user-pic"
          alt={currentUser.username}
        />
      ) : (
        ""
      )}
      {currentUser.username}
    </NavItem>
  </ul>
);
const LoggedOutView = ({ activePathname }) => (
  <ul class="nav navbar-nav pull-xs-right">
    <NavItem activePathname={activePathname} path={HOME}>
      Home
    </NavItem>
    <NavItem activePathname={activePathname} path={LOGIN}>
      Sign in
    </NavItem>
    <NavItem activePathname={activePathname} path={REGISTER}>
      Sign up
    </NavItem>
  </ul>
);

const Header = ({ currentUser, activePathname }) => {
  return (
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href={HOME}>
          conduit
        </a>
        {currentUser ? (
          <LoggedInView
            activePathname={activePathname}
            currentUser={currentUser}
          />
        ) : (
          <LoggedOutView activePathname={activePathname} />
        )}
      </div>
    </nav>
  );
};

export default Header;
