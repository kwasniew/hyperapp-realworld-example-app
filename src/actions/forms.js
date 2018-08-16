import { HOME } from "../links";

export const withErrorHandling = fn => (state, actions) => {
  actions.requestStarted();

  return fn(state, actions).catch(({ errors }) => {
    actions.requestComplete();
    return actions.setErrors(errors);
  });
};

export const handleUserForm = fn =>
  withErrorHandling((state, actions) => {
    return fn(state).then(data => {
      actions.saveUser(data.user);
      return actions.loadPage(HOME);
    });
  });
