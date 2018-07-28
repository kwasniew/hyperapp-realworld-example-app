import { h } from "hyperapp";
import { local } from "../shared/events";

const Tags = ({ tags, onClickTag }) => {
  return (
    <div class="tag-list">
      {tags.map(tag => {
        const handleClick = local(() => onClickTag(tag));
        return (
          <a
            href=""
            class="tag-pill tag-default"
            key={tag}
            onclick={handleClick}
          >
            {tag}
          </a>
        );
      })}
    </div>
  );
};

export default Tags;
