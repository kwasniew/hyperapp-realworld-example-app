import { settingsUserLens, userFieldLens, userLens } from "../lenses";
import set from "ramda/src/set";
import view from "ramda/src/view";
import { handleUserForm } from "./forms";
import { SETTINGS_PAGE } from "../consts";
import pick from "ramda/src/pick";

const DEFAULT_SETTING_PAGE = user => ({
  user,
  name: SETTINGS_PAGE,
  inProgress: false,
  errors: {}
});

const userFormFields = user =>
  pick(["image", "username", "bio", "email"], user);

const actionsFactory = ({ updateSettings, fetchUser }) => {
  const handleUpdateSettingsForm = handleUserForm(state => {
    const user = view(settingsUserLens, state);
    return updateSettings({ user });
  });

  return {
    updateSettings: () => (state, actions) => {
      return handleUpdateSettingsForm(state, actions);
    },
    updateSettingField: ({ field, value }) => state => {
      return set(userFieldLens(field), value, state);
    },
    fetchUser: () => (state, actions) => {
      return fetchUser().then(data => {
        actions.saveUser(data.user);
        actions.setSettingsFields(data.user);
      });
    },
    setSettingsFields: user => state => {
      return set(settingsUserLens, userFormFields(user), state);
    },
    loadSettingsPage: () => (state, actions) => {
      const user = view(userLens, state);
      if (!user) return Promise.resolve();

      actions.setPage(
        DEFAULT_SETTING_PAGE(userFormFields(view(userLens, state)))
      );
      return actions.fetchUser();
    }
  };
};

export default actionsFactory;
