export default function sessionRepositoryFactory(
  localStorage,
  addEventListener
) {
  const api = {
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
    },
    onChange(callback) {
      addEventListener(
        "storage",
        function(event) {
          if (event.storageArea === localStorage && event.key === "session") {
            callback(api.load());
          }
        },
        false
      );
    }
  };

  return api;
}
