import view from "ramda/src/view";
import {
  emailLens,
  pageLens,
  passwordLens,
  userLens,
  usernameLens
} from "../lenses";
import set from "ramda/src/set";
import { handleUserForm } from "./forms";
import { LOGIN_PAGE, REGISTER_PAGE } from "../consts";
import { HOME } from "../links";

const DEFAULT_LOGIN = {
  name: LOGIN_PAGE,
  email: "",
  password: "",
  inProgress: false,
  errors: {}
};
const DEFAULT_REGISTER = {
  ...DEFAULT_LOGIN,
  username: "",
  name: REGISTER_PAGE
};

const actionsFactory = ({ login, register, sessionRepository }) => {
  const handleLoginForm = handleUserForm(state => {
    const { email, password } = view(pageLens, state);
    return login({ email, password });
  });

  const handleRegisterForm = handleUserForm(state => {
    const { email, password, username } = view(pageLens, state);
    return register({ email, password, username });
  });

  return {
    login: () => (state, actions) => {
      return handleLoginForm(state, actions);
    },
    register: () => (state, actions) => {
      return handleRegisterForm(state, actions);
    },
    logout: () => (state, actions) => {
      sessionRepository.clear();
      actions.removeUserSession();
      return actions.loadPage(HOME);
    },
    changePassword: password => state => {
      return set(passwordLens, password, state);
    },
    changeEmail: email => state => {
      return set(emailLens, email, state);
    },
    changeUsername: username => state => {
      return set(usernameLens, username, state);
    },
    removeUserSession: () => state => {
      return set(userLens, null, state);
    },
    loadLoginPage: () => (state, actions) => {
      return actions.setPage(DEFAULT_LOGIN);
    },
    loadRegisterPage: () => (state, actions) => {
      return actions.setPage(DEFAULT_REGISTER);
    }
  };
};

export default actionsFactory;
