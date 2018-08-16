import set from "ramda/src/set";
import { errorsLens, inProgressLens, pageLens, userLens } from "../lenses";

export const DEFAULT_ARTICLES = { articles: [], articlesCount: 0 };
export const FEED = active => ({
  feed: {
    currentPage: 0,
    errors: [],
    feed: DEFAULT_ARTICLES,
    isLoading: false,
    feedSources: {
      active
    }
  },
  tags: []
});

const sharedActions = ({ sessionRepository }) => ({
  requestStarted: () => state => {
    return set(inProgressLens, true, state);
  },
  requestComplete: () => state => {
    return set(inProgressLens, false, state);
  },
  setErrors: errors => state => {
    return set(errorsLens, errors, state);
  },
  setPage: page => state => {
    return set(pageLens, page, state);
  },
  saveUser: user => (state, actions) => {
    sessionRepository.save(user);
    actions.setUser(user);
  },
  setUser: user => state => {
    return set(userLens, user, state);
  },
  getState: () => state => {
    return state;
  }
});
export default sharedActions;
