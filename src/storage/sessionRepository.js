export default function sessionRepositoryFactory(localStorage) {
  return {
    save(user) {
      try {
        localStorage.setItem("session", JSON.stringify(user));
      } catch (e) {
        // console.error(e);
      }
    },
    load() {
      try {
        return JSON.parse(localStorage.getItem("session"));
      } catch (e) {
        return null;
      }
    },
    clear() {
      try {
        localStorage.removeItem("session");
      } catch (e) {
        // console.error(e);
      }
    }
  };
}
