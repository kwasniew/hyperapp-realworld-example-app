import { h } from "hyperapp";
import ListErrors from "../shared/ListErrors";
import { pageLens, settingsUserLens } from "../../lenses";
import view from "ramda/src/view";

const handleSetting = updateSetting => field => e =>
  updateSetting({ field, value: e.target.value });

const SettingsForm = ({ submitForm, currentUser, updateSetting }) => {
  const { image, username, bio, email, password, inProgress } = currentUser;
  return (
    <form
      onsubmit={e => {
        e.preventDefault();
        submitForm();
      }}
    >
      <fieldset>
        <fieldset class="form-group">
          <input
            class="form-control"
            type="text"
            placeholder="URL of profile picture"
            value={image}
            oninput={updateSetting("image")}
          />
        </fieldset>

        <fieldset class="form-group">
          <input
            class="form-control form-control-lg"
            type="text"
            placeholder="Username"
            value={username}
            oninput={updateSetting("username")}
          />
        </fieldset>

        <fieldset class="form-group">
          <textarea
            class="form-control form-control-lg"
            rows="8"
            placeholder="Short bio about you"
            value={bio}
            oninput={updateSetting("bio")}
          />
        </fieldset>

        <fieldset class="form-group">
          <input
            class="form-control form-control-lg"
            type="email"
            placeholder="Email"
            value={email}
            oninput={updateSetting("email")}
          />
        </fieldset>

        <fieldset class="form-group">
          <input
            class="form-control form-control-lg"
            type="password"
            placeholder="New Password"
            value={password}
            oninput={updateSetting("password")}
          />
        </fieldset>

        <button
          class="btn btn-lg btn-primary pull-xs-right"
          type="submit"
          disabled={!!inProgress}
        >
          Update Settings
        </button>
      </fieldset>
    </form>
  );
};

const Settings = ({ state, actions }) => {
  const currentUser = view(settingsUserLens, state);
  return (
    <div class="settings-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Your Settings</h1>

            <ListErrors errors={currentUser.errors} />

            <SettingsForm
              currentUser={currentUser}
              updateSetting={handleSetting(actions.updateSettingField)}
              submitForm={actions.updateSettings}
            />

            <hr />

            <button class="btn btn-outline-danger" onclick={actions.logout}>
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
