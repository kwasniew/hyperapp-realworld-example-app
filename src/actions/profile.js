import { profileLens } from "../lenses";
import set from "ramda/src/set";
import {
  AUTHOR_FEED,
  FAVORITE_PROFILE_PAGE,
  USER_PROFILE_PAGE
} from "../consts";
import { FEED } from "./shared";

const EMPTY_PROFILE = { profile: {} };
const DEFAULT_PROFILE_PAGE = name => ({
  ...FEED(AUTHOR_FEED),
  ...EMPTY_PROFILE,
  name
});

const actionsFactory = ({ fetchProfile, follow, unfollow }) => ({
  fetchProfile: username => (state, actions) => {
    return fetchProfile({
      username
    }).then(data => actions.setProfile(data.profile));
  },
  follow: username => (state, actions) => {
    return follow({ username }).then(data => actions.setProfile(data.profile));
  },
  unfollow: username => (state, actions) => {
    return unfollow({ username }).then(data =>
      actions.setProfile(data.profile)
    );
  },
  setProfile: profile => state => {
    return set(profileLens, profile, state);
  },
  loadUserProfilePage: ({ username }) => (state, actions) => {
    return actions.loadProfilePage({ username, type: USER_PROFILE_PAGE });
  },
  loadProfileFavoritedPage: ({ username }) => (state, actions) => {
    return actions.loadProfilePage({ username, type: FAVORITE_PROFILE_PAGE });
  },
  loadProfilePage: ({ username, type }) => (state, actions) => {
    actions.setPage(DEFAULT_PROFILE_PAGE(type));
    return Promise.all([
      actions.fetchProfile(username),
      actions.loadUserArticles({ username, type })
    ]);
  }
});

export default actionsFactory;
