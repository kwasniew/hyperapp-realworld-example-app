import sessionRepositoryFactory from "../sessionRepository";

test("can save user", () => {
  const localStorage = {
    setItem(...args) {
      localStorage.setItem.invokedWith = args;
    }
  };
  const sessionRepository = sessionRepositoryFactory(localStorage);

  sessionRepository.save({ user: "foo" });

  expect(localStorage.setItem.invokedWith).toEqual([
    "session",
    '{"user":"foo"}'
  ]);
});

test("save with local storage failure", () => {
  const localStorage = {
    setItem() {
      throw new Error("something bad happened");
    }
  };
  const sessionRepository = sessionRepositoryFactory(localStorage);

  sessionRepository.save({ user: "foo" });
});

test("can load user", () => {
  const localStorage = {
    getItem(arg) {
      localStorage.getItem.invokedWith = arg;
      return '{"user":"foo"}';
    }
  };
  const sessionRepository = sessionRepositoryFactory(localStorage);

  const result = sessionRepository.load();

  expect(localStorage.getItem.invokedWith).toEqual("session");
  expect(result).toEqual({ user: "foo" });
});

test("load incorrect data", () => {
  const localStorage = {
    getItem() {
      return "invalid JSON";
    }
  };
  const sessionRepository = sessionRepositoryFactory(localStorage);

  const result = sessionRepository.load();

  expect(result).toBe(null);
});

test("clear data", () => {
  const localStorage = {
    removeItem(arg) {
      localStorage.removeItem.invokedWith = arg;
    }
  };

  const sessionRepository = sessionRepositoryFactory(localStorage);

  const result = sessionRepository.clear();

  expect(localStorage.removeItem.invokedWith).toEqual("session");
});
