import { h } from "hyperapp";
import ListErrors from "../shared/ListErrors";
import view from "ramda/src/view";
import { pageLens, editorLens } from "../../lenses";

const updateField = action => field => e =>
  action({ field, value: e.target.value });

const Editor = ({ state, actions }) => {
  const update = updateField(actions.updateField);

  const watchForEnter = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      actions.addTag();
    }
  };

  const { errors, inProgress } = view(pageLens, state);
  const { title, description, body, currentTag, tagList } = view(
    editorLens,
    state
  );

  return (
    <div class="editor-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-10 offset-md-1 col-xs-12">
            <ListErrors errors={errors} />

            <form>
              <fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Article Title"
                    value={title}
                    oninput={update("title")}
                  />
                </fieldset>

                <fieldset class="form-group">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="What's this article about?"
                    value={description}
                    oninput={update("description")}
                  />
                </fieldset>

                <fieldset class="form-group">
                  <textarea
                    class="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    value={body}
                    oninput={update("body")}
                  />
                </fieldset>

                <fieldset class="form-group">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Enter tags"
                    value={currentTag}
                    oninput={update("currentTag")}
                    onkeyup={watchForEnter}
                  />

                  <div class="tag-list">
                    {(tagList || []).map(tag => {
                      return (
                        <span class="tag-default tag-pill" key={tag}>
                          <i
                            class="ion-close-round"
                            onclick={e => actions.removeTag(tag)}
                          />
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </fieldset>

                <button
                  class="btn btn-lg pull-xs-right btn-primary"
                  type="button"
                  disabled={inProgress}
                  onclick={actions.saveArticle}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
