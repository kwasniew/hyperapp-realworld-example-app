import { h } from "hyperapp";

const DeleteButton = ({ show, deleteComment }) => {
  if (show) {
    return (
      <span class="mod-options">
        <i class="ion-trash-a" onclick={deleteComment} />
      </span>
    );
  } else {
    return "";
  }
};

export default DeleteButton;
