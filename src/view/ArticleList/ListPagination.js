import { h } from "hyperapp";
import { local } from "../shared/events";

function pages({ articlesCount, currentPage }) {
  const range = [];
  for (let i = 0; i < Math.ceil(articlesCount / 10); ++i) {
    range.push({ number: i, isCurrent: i === currentPage });
  }
  return range;
}

const ListPagination = ({ articlesCount, currentPage, changePage }) => {
  if (articlesCount <= 10) {
    return "";
  }
  return (
    <nav>
      <ul class="pagination">
        {pages({ articlesCount, currentPage }).map(page => {
          const onClick = local(() => changePage(page.number));
          return (
            <li
              onclick={onClick}
              class={page.isCurrent ? "page-item active" : "page-item"}
              key={String(page.number)}
            >
              <a class="page-link" href="">
                {page.number + 1}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default ListPagination;
