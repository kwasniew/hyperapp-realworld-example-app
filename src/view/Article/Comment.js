import { h } from "hyperapp";
import DeleteButton from "./DeleteButton";
import { userArticlesLink } from "../../links";
import { format } from "../shared/date";

const Comment = ({ comment, slug, myCommentSelector, deleteComment }) => {
  return (
    <div class="card">
      <div class="card-block">
        <p class="card-text">{comment.body}</p>
      </div>
      <div class="card-footer">
        <a
          href={userArticlesLink(comment.author.username)}
          class="comment-author"
        >
          <img
            src={comment.author.image}
            class="comment-author-img"
            alt={comment.author.username}
          />
        </a>
        &nbsp;
        <a
          href={userArticlesLink(comment.author.username)}
          class="comment-author"
        >
          {comment.author.username}
        </a>
        <span class="date-posted">{format(comment.createdAt)}</span>
        <DeleteButton
          show={myCommentSelector(comment.author.username)}
          deleteComment={() => deleteComment({ id: comment.id, slug })}
        />
      </div>
    </div>
  );
};

export default Comment;
