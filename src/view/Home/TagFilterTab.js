import { h } from "hyperapp";

const TagFilterTab = ({ tag }) => {
  if (!tag || ["global", "user"].includes(tag)) {
    return "";
  }
  const clickHandler = ev => {
    ev.preventDefault();
  };

  return (
    <li class="nav-item">
      <a href="" class="nav-link active" onclick={clickHandler}>
        <i class="ion-pound" /> {tag}
      </a>
    </li>
  );
};

export default TagFilterTab;
