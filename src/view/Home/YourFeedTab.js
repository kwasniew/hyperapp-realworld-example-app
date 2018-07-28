import { h } from "hyperapp";
import { USER_FEED } from "../../consts";
import { local } from "../shared/events";

const YourFeedTab = ({ token, tab, onTabClick }) => {
  if (token) {
    const clickHandler = local(onTabClick);

    return (
      <li class="nav-item">
        <a
          href=""
          class={tab === USER_FEED ? "nav-link active" : "nav-link"}
          onclick={clickHandler}
        >
          Your Feed
        </a>
      </li>
    );
  }
  return null;
};

export default YourFeedTab;
