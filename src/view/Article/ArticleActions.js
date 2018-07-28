import { h } from "hyperapp";
import { editorLink } from "../../links";

const ArticleActions = ({ article, canModify, deleteArticle }) => {
  if (canModify) {
    return (
      <span>
        <a
          href={editorLink(article.slug)}
          class="btn btn-outline-secondary btn-sm"
        >
          <i class="ion-edit" /> Edit Article
        </a>

        <button class="btn btn-outline-danger btn-sm" onclick={deleteArticle}>
          <i class="ion-trash-a" /> Delete Article
        </button>
      </span>
    );
  } else {
    return <span />;
  }
};

export default ArticleActions;
