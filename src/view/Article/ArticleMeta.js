import { h } from "hyperapp";
import { profileLink } from "../../links";
import ArticleActions from "./ArticleActions";
import { format } from "../shared/date";

const ArticleMeta = ({ article, deleteArticle, canModify }) => {
  return (
    <div class="article-meta">
      <a href={profileLink(article.author.username)}>
        <img src={article.author.image} alt={article.author.username} />
      </a>

      <div class="info">
        <a href={profileLink(article.author.username)} class="author">
          {article.author.username}
        </a>
        <span class="date">{format(article.createdAt)}</span>
      </div>

      <ArticleActions
        canModify={canModify}
        article={article}
        deleteArticle={() => deleteArticle(article.slug)}
      />
    </div>
  );
};

export default ArticleMeta;
