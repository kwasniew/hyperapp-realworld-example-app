import isMatch from "lodash.ismatch";

const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

export const createFetch = (...interactions) => {
  const defaultResponse = data =>
    Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve(data);
      }
    });

  const response = val => {
    if (!val.status) {
      return defaultResponse(val);
    } else {
      return Promise.resolve({
        status: val.status,
        json() {
          return Promise.resolve(val.body);
        }
      });
    }
  };
  const throwError = (url, options) => {
    throw new Error(
      "Unexpected interaction: " + url + " " + JSON.stringify(options)
    );
  };
  return (url, options) => {
    const recorded = interactions.find(recorded => {
      if (recorded.length === 2) {
        return url.endsWith(recorded[0]);
      } else {
        return url.endsWith(recorded[0]) && isMatch(options, recorded[1]);
      }
    });
    // force macro task queue instead of micro task queue
    return recorded
      ? delay(0).then(() => response(recorded[recorded.length - 1]))
      : throwError(url, options);
  };
};