import { h } from "hyperapp";
import { pageLens } from "../../lenses";
import ListErrors from "../shared/ListErrors";
import view from "ramda/src/view";
import { LOGIN } from "../../links";

const Register = ({ state, actions }) => {
  const { username, password, email, inProgress, errors } = view(
    pageLens,
    state
  );
  return (
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign Up</h1>
            <p class="text-xs-center">
              <a href={LOGIN}>Have an account?</a>
            </p>

            <ListErrors errors={errors} />

            <form
              onsubmit={e => {
                e.preventDefault();
                actions.register();
              }}
            >
              <fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Username"
                    value={username}
                    oninput={e => actions.changeUsername(e.target.value)}
                  />
                </fieldset>

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
                  Sign up
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
