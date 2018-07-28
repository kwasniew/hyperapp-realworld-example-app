import { EDITOR_PAGE } from "../consts";
import { editorFieldLens, editorLens, tagListLens } from "../lenses";
import set from "ramda/src/set";
import view from "ramda/src/view";
import mergeDeepLeft from "ramda/src/mergeDeepLeft";
import over from "ramda/src/over";
import filter from "ramda/src/filter";
import { articleLink } from "../links";
import { withErrorHandling } from "./forms";

const actionsFactory = ({ saveArticle, fetchArticle }) => {
  const handleEditorForm = withErrorHandling((state, actions) => {
    const { title, description, body, tagList } = view(editorLens, state);

    return saveArticle({ title, description, body, tagList }).then(data => {
      return actions.loadPage(articleLink(data.article.slug));
    });
  });

  const DEFAULT_EDITOR_PAGE = {
    name: EDITOR_PAGE,
    editor: {
      title: "",
      description: "",
      body: "",
      currentTag: "",
      tagList: []
    },
    errors: {},
    inProgress: false
  };

  return {
    updateField: ({ field, value }) => state => {
      return set(editorFieldLens(field), value, state);
    },
    addTag: () => state => {
      const { currentTag, tagList } = view(editorLens, state);
      return over(
        editorLens,
        mergeDeepLeft({ currentTag: "", tagList: [...tagList, currentTag] }),
        state
      );
    },
    removeTag: tag => state => {
      return over(tagListLens, filter(t => t !== tag), state);
    },
    setEditor: ({ title, description, body, tagList }) => state => {
      return over(
        editorLens,
        mergeDeepLeft({ title, description, body, tagList }),
        state
      );
    },
    saveArticle: () => (state, actions) => {
      return handleEditorForm(state, actions);
    },
    fetchArticleForUpdate: slug => (state, actions) => {
      return fetchArticle({ slug }).then(data =>
        actions.setEditor(data.article)
      );
    },
    loadEditorPage: ({ slug } = {}) => (state, actions) => {
      actions.setPage(DEFAULT_EDITOR_PAGE);
      return slug ? actions.fetchArticleForUpdate(slug) : Promise.resolve();
    }
  };
};

export default actionsFactory;
