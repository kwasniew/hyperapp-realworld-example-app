import Comment from "./Comment";
import { h } from "hyperapp";

const CommentList = ({ comments, slug, myCommentSelector, deleteComment }) => {
  return (
    <div>
      {comments.map(comment => {
        return (
          <Comment
            comment={comment}
            slug={slug}
            myCommentSelector={myCommentSelector}
            deleteComment={deleteComment}
            key={comment.id}
          />
        );
      })}
    </div>
  );
};

export default CommentList;
