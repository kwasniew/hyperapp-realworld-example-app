import { h } from "hyperapp";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";
import { LOGIN, REGISTER } from "../../links";

const CommentContainer = ({
  comments,
  slug,
  body,
  currentUser,
  createComment,
  setCommentText,
  myCommentSelector,
  deleteComment
}) => {
  return (
    <div class="col-xs-12 col-md-8 offset-md-2">
      {currentUser ? (
        <div>
          <CommentInput
            slug={slug}
            currentUser={currentUser}
            createComment={createComment}
            setCommentText={setCommentText}
            body={body}
          />
        </div>
      ) : (
        <p>
          <a href={LOGIN}>Sign in</a>
          &nbsp;or&nbsp;
          <a href={REGISTER}>sign up</a>
          &nbsp;to add comments on this article.
        </p>
      )}

      <CommentList
        comments={comments}
        slug={slug}
        myCommentSelector={myCommentSelector}
        deleteComment={deleteComment}
      />
    </div>
  );
};

export default CommentContainer;
