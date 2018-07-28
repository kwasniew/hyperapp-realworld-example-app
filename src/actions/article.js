import {
  articleLens,
  commentsLens,
  commentTextLens,
  pageLens
} from "../lenses";
import set from "ramda/src/set";
import view from "ramda/src/view";
import filter from "ramda/src/filter";
import mergeDeepLeft from "ramda/src/mergeDeepLeft";
import over from "ramda/src/over";
import { ARTICLE_PAGE } from "../consts";
import { HOME } from "../links";

const EMPTY_ARTICLE = {
  title: "",
  author: {},
  body: "",
  slug: "",
  tagList: []
};
const DEFAULT_ARTICLE_PAGE = {
  name: ARTICLE_PAGE,
  article: EMPTY_ARTICLE,
  comments: [],
  commentText: ""
};

const actionsFactory = ({
  fetchArticle,
  fetchComments,
  deleteComment,
  createComment,
  deleteArticle
}) => ({
  deleteArticle: slug => (state, actions) => {
    return deleteArticle({ slug }).then(() => {
      return actions.loadPage(HOME);
    });
  },
  setArticle: article => state => {
    return set(articleLens, article, state);
  },
  setComments: comments => state => {
    return set(commentsLens, comments, state);
  },
  createComment: slug => (state, actions) => {
    const comment = view(commentTextLens, state);
    return createComment({ slug, comment }).then(data =>
      actions.appendComment(data.comment)
    );
  },
  deleteComment: ({ id, slug }) => (state, actions) => {
    return deleteComment({ id, slug }).then(() => actions.removeComment(id));
  },
  appendComment: comment => state => {
    // return over(pageLens, evolve({commentText: always(""), comments: prepend(comment)}), state);
    return over(
      pageLens,
      mergeDeepLeft({
        commentText: "",
        comments: [comment, ...view(commentsLens, state)]
      }),
      state
    );
  },
  removeComment: id => state => {
    return over(commentsLens, filter(comment => comment.id !== id), state);
  },
  setCommentText: body => state => {
    return set(commentTextLens, body, state);
  },
  loadArticlePage: ({ slug } = {}) => (state, actions) => {
    actions.setPage(DEFAULT_ARTICLE_PAGE);
    return Promise.all([
      fetchArticle({ slug }).then(data => actions.setArticle(data.article)),
      fetchComments({ slug }).then(data => actions.setComments(data.comments))
    ]);
  }
});

export default actionsFactory;
