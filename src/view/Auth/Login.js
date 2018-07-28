import { h } from "hyperapp";
import ListErrors from "../shared/ListErrors";
import { pageLens } from "../../lenses";
import view from "ramda/src/view";
import { REGISTER } from "../../links";

const Login = ({ state, actions }) => {
  const { email, password, inProgress, errors } = view(pageLens, state);
  return (
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign In</h1>
            <p class="text-xs-center">
              <a href={REGISTER}>Need an account?</a>
            </p>

            <ListErrors errors={errors} />

            <form
              onsubmit={e => {
                e.preventDefault();
                actions.login();
              }}
            >
              <fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    value={email}
                    oninput={e => actions.changeEmail(e.target.value)}
                  />
                </fieldset>

                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    oninput={e => actions.changePassword(e.target.value)}
                  />
                </fieldset>

                <button
                  class="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={inProgress}
                >
                  Sign in
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
