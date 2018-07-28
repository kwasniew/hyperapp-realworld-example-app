import { h } from "hyperapp";

const ListErrors = ({ errors }) => {
  if (errors) {
    return (
      <ul class="error-messages">
        {Object.keys(errors).map(key => {
          return (
            <li key={key}>
              {key} {errors[key].join(" and ")}
            </li>
          );
        })}
      </ul>
    );
  } else {
    return "";
  }
};

export default ListErrors;
