import { h } from "hyperapp";
import { articleLink, profileLink } from "../../links";
import { format } from "../shared/date";

const FavoriteButton = ({ article, favorite, unfavorite }) => {
  const FAVORITED_CLASS = "btn btn-sm btn-primary pull-xs-right";
  const NOT_FAVORITED_CLASS = "btn btn-sm btn-outline-primary pull-xs-right";

  const favoriteButtonClass = article.favorited
    ? FAVORITED_CLASS
    : NOT_FAVORITED_CLASS;

  const handleClick = ev => {
    ev.preventDefault();
    if (article.favorited) {
      unfavorite(article.slug);
    } else {
      favorite(article.slug);
    }
  };

  return (
    <button class={favoriteButtonClass} onclick={handleClick}>
      <i class="ion-heart" /> {article.favoritesCount}
    </button>
  );
};

const ArticlePreview = ({ article, favorite, unfavorite }) => (
  <div class="article-preview">
    <div class="article-meta">
      <a href={profileLink(article.author.username)}>
        <img src={article.author.image} alt={article.author.username} />
      </a>
      <div class="info">
        <a class="author" href={profileLink(article.author.username)}>
          {article.author.username}
        </a>
        <span class="date">{format(article.createdAt)}</span>
      </div>
      <FavoriteButton
        article={article}
        favorite={favorite}
        unfavorite={unfavorite}
      />
    </div>
    <a href={articleLink(article.slug)} class="preview-link">
      <h1>{article.title}</h1>
      <p>{article.description}</p>
      <span>Read more...</span>
      <ul class="tag-list">
        {article.tagList.map(tag => {
          return (
            <li class="tag-default tag-pill tag-outline" key={tag}>
              {tag}
            </li>
          );
        })}
      </ul>
    </a>
  </div>
);

export default ArticlePreview;
