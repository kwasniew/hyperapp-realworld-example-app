import init from "./app";
const { main } = init({
  localStorage: window.localStorage,
  fetch: window.fetch,
  location: window.location
});
global.app = main;
