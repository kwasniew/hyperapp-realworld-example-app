import { h } from "hyperapp";
import { local } from "../shared/events";

const GlobalFeedTab = ({ tab, onTabClick }) => {
  const clickHandler = local(() => onTabClick(tab));
  return (
    <li class="nav-item">
      <a
        href=""
        class={tab === "global" ? "nav-link active" : "nav-link"}
        onclick={clickHandler}
      >
        Global Feed
      </a>
    </li>
  );
};

export default GlobalFeedTab;
