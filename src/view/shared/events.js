export const local = fn => e => {
  e.preventDefault();
  e.stopPropagation();
  fn();
};
