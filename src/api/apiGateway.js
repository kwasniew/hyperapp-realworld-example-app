const API_ROOT = "https://conduit.productionready.io/api";
import mergeDeepWith from "ramda/src/mergeDeepWith";
import concat from "ramda/src/concat";

const authHeader = sessionRepository => {
  const session = sessionRepository.load();
  return session && session.token
    ? {
        headers: {
          Authorization: `Token ${session.token}`
        }
      }
    : {};
};

const isJson = response =>
  response.headers.get("content-type").indexOf("application/json") !== -1;

const configureFetch = (fetch, sessionRepository) => (url, options = {}) => {
  return fetch(
    API_ROOT + url,
    mergeDeepWith(concat, authHeader(sessionRepository), options)
  ).then(response => {
    if (isJson(response)) {
      if (response.status === 200) {
        return response.json();
      } else {
        return response.json().then(body => Promise.reject(body));
      }
    }
  });
};

const pagination = ({ page, limit }) => `limit=${limit}&offset=${page * 10}`;
const jsonBody = body => ({
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
});

const apiGateway = (fetch, sessionRepository) => {
  const fetchWithToken = configureFetch(fetch, sessionRepository);

  const get = url => fetchWithToken(url);
  const del = url => fetchWithToken(url, { method: "DELETE" });
  const post = (url, body) => {
    const options = Object.assign(
      {},
      { method: "POST" },
      body ? jsonBody(body) : {}
    );
    return fetchWithToken(url, options);
  };
  const put = (url, body) => {
    const options = Object.assign(
      {},
      { method: "PUT" },
      body ? jsonBody(body) : {}
    );
    return fetchWithToken(url, options);
  };

  const fetchGlobalFeed = ({ page }) =>
    get(`/articles?${pagination({ page, limit: 10 })}`);
  const fetchUserFeed = ({ page }) =>
    get(`/articles/feed?${pagination({ page, limit: 10 })}`);
  const fetchFavoritedFeed = ({ page, username }) =>
    get(
      `/articles?favorited=${encodeURIComponent(username)}&${pagination({
        page,
        limit: 5
      })}`
    );
  const fetchAuthorFeed = ({ page, username }) =>
    get(
      `/articles?author=${encodeURIComponent(username)}&${pagination({
        page,
        limit: 5
      })}`
    );
  const fetchTagFeed = ({ page, tag }) =>
    get(`/articles?tag=${tag}&${pagination({ page, limit: 10 })}`);
  const favoriteArticle = ({ slug }) => post(`/articles/${slug}/favorite`);
  const unfavoriteArticle = ({ slug }) => del(`/articles/${slug}/favorite`);
  const saveArticle = ({ ...article }) => post("/articles", { article });
  const deleteArticle = ({ slug }) => del(`/articles/${slug}`);
  const fetchArticle = ({ slug }) => get(`/articles/${slug}`);

  const fetchComments = ({ slug }) => get(`/articles/${slug}/comments`);
  const createComment = ({ slug, comment }) =>
    post(`/articles/${slug}/comments`, { comment: { body: comment } });
  const deleteComment = ({ slug, id }) =>
    del(`/articles/${slug}/comments/${id}`);

  const fetchProfile = ({ username }) =>
    get(`/profiles/${encodeURIComponent(username)}`);
  const follow = ({ username }) =>
    post(`/profiles/${encodeURIComponent(username)}/follow`);
  const unfollow = ({ username }) =>
    del(`/profiles/${encodeURIComponent(username)}/follow`);

  const fetchTags = () => get("/tags");

  const login = ({ email, password }) =>
    post("/users/login", { user: { email, password } });
  const register = ({ email, password, username }) =>
    post("/users", { user: { email, password, username } });
  const fetchUser = () => get(`/user`);
  const updateSettings = ({ user }) => put(`/user`, { user });

  return {
    fetchGlobalFeed,
    fetchUserFeed,
    fetchTagFeed,
    favoriteArticle,
    unfavoriteArticle,
    saveArticle,
    deleteArticle,
    fetchArticle,
    fetchComments,
    createComment,
    deleteComment,
    fetchProfile,
    login,
    register,
    follow,
    unfollow,
    fetchTags,
    fetchFavoritedFeed,
    fetchAuthorFeed,
    updateSettings,
    fetchUser
  };
};

export default apiGateway;
