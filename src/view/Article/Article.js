import { h } from "hyperapp";
import ArticleMeta from "./ArticleMeta";
import CommentContainer from "./CommentContainer";
import marked from "marked";
import {
  articleLens,
  commentsLens,
  userLens,
  canModifyArticleSelector,
  canModifySelector,
  commentTextLens
} from "../../lenses";
import view from "ramda/src/view";

const ArticleBanner = ({ article, canModify, deleteArticle }) => {
  return (
    <div class="banner">
      <div class="container">
        <h1>{article.title}</h1>
        <ArticleMeta
          article={article}
          canModify={canModify}
          deleteArticle={deleteArticle}
        />
      </div>
    </div>
  );
};

const Article = ({ state, actions }) => {
  const article = view(articleLens, state);
  const comments = view(commentsLens, state);
  const commentText = view(commentTextLens, state);
  const canModifyArticle = canModifyArticleSelector(state);
  const canModify = canModifySelector(state);
  const currentUser = view(userLens, state);
  if (!article.title) {
    return "";
  }
  return (
    <div class="article-page" key="article-page">
      <ArticleBanner
        article={article}
        canModify={canModifyArticle}
        deleteArticle={actions.deleteArticle}
      />

      <div class="container page">
        <div class="row article-content">
          <div class="col-xs-12">
            <div innerHTML={marked(article.body, { sanitize: true })} />

            <ul class="tag-list">
              {article.tagList.map(tag => {
                return (
                  <li class="tag-default tag-pill tag-outline" key={tag}>
                    {tag}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <hr />

        <div class="article-actions" />

        <div class="row">
          <CommentContainer
            slug={article.slug}
            currentUser={currentUser}
            comments={comments}
            body={commentText}
            createComment={actions.createComment}
            setCommentText={actions.setCommentText}
            myCommentSelector={canModify}
            deleteComment={actions.deleteComment}
          />
        </div>
      </div>
    </div>
  );
};

export default Article;
