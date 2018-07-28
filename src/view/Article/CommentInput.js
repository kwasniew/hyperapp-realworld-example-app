import { h } from "hyperapp";

const CommentInput = ({
  slug,
  body,
  createComment,
  setCommentText,
  currentUser
}) => {
  return (
    <form
      class="card comment-form"
      onsubmit={e => {
        e.preventDefault();
        createComment(slug);
      }}
    >
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          value={body}
          oninput={e => setCommentText(e.target.value)}
          rows="3"
        />
      </div>
      <div class="card-footer">
        {currentUser.image ? (
          <img
            src={currentUser.image}
            class="comment-author-img"
            alt={currentUser.username}
          />
        ) : (
          ""
        )}
        <button class="btn btn-sm btn-primary" type="submit">
          Post Comment
        </button>
      </div>
    </form>
  );
};

export default CommentInput;
