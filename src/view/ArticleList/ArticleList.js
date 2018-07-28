import { h } from "hyperapp";
import ArticlePreview from "./ArticlePreview";
import ListPagination from "./ListPagination";

const ArticleList = ({
  articles,
  articlesCount,
  currentPage,
  changePage,
  favorite,
  unfavorite,
  isLoading
}) => {
  if (isLoading) {
    return <div class="article-preview">Loading...</div>;
  }
  if (articles.length === 0) {
    return <div class="article-preview">No articles are here... yet.</div>;
  }
  return (
    <div>
      {articles.map(article => (
        <ArticlePreview
          article={article}
          key={article.slug}
          favorite={favorite}
          unfavorite={unfavorite}
        />
      ))}
      <ListPagination
        articlesCount={articlesCount}
        currentPage={currentPage}
        changePage={changePage}
      />
    </div>
  );
};

export default ArticleList;
