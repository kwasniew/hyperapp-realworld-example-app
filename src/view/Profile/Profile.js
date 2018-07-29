import { h } from "hyperapp";
import {
  profileLens,
  isUserSelector,
  articlesLens,
  currentPageLens,
  isLoadingLens
} from "../../lenses";
import ArticleList from "../ArticleList/ArticleList";
import { FAVORITE_PROFILE_PAGE, USER_PROFILE_PAGE } from "../../consts";
import view from "ramda/src/view";
import { userArticlesLink, favoritedArticlesLink } from "../../links";
import { SETTINGS } from "../../links";
import { local } from "../shared/events";

const Tabs = ({ profile, type }) => {
  return (
    <ul class="nav nav-pills outline-active">
      <li class="nav-item">
        <a
          class={type === USER_PROFILE_PAGE ? "nav-link active" : "nav-link"}
          href={userArticlesLink(profile.username)}
        >
          My Articles
        </a>
      </li>

      <li class="nav-item">
        <a
          class={
            type === FAVORITE_PROFILE_PAGE ? "nav-link active" : "nav-link"
          }
          href={favoritedArticlesLink(profile.username)}
        >
          Favorited Articles
        </a>
      </li>
    </ul>
  );
};

const EditProfileSettings = ({ isUser }) => {
  if (isUser) {
    return (
      <a href={SETTINGS} class="btn btn-sm btn-outline-secondary action-btn">
        <i class="ion-gear-a" /> Edit Profile Settings
      </a>
    );
  }
  return "";
};

const FavoriteProfile = ({ state, actions }) => (
  <Profile state={state} actions={actions} type={FAVORITE_PROFILE_PAGE} />
);

const UserProfile = ({ state, actions }) => (
  <Profile state={state} actions={actions} type={USER_PROFILE_PAGE} />
);

const FollowUserButton = ({ isUser, user, follow, unfollow }) => {
  if (isUser) {
    return "";
  }

  const classes =
    "btn btn-sm action-btn" +
    (user.following ? " btn-secondary" : " btn-outline-secondary");
  const handleClick = local(
    () => (user.following ? unfollow(user.username) : follow(user.username))
  );

  return (
    <button class={classes} onclick={handleClick}>
      <i class="ion-plus-round" />
      &nbsp;
      {user.following ? "Unfollow" : "Follow"} {user.username}
    </button>
  );
};

const Profile = ({ type, state, actions }) => {
  const profile = view(profileLens, state);
  const isUser = isUserSelector(state);
  const { articles, articlesCount } = view(articlesLens, state);
  const currentPage = view(currentPageLens, state);
  const isLoading = view(isLoadingLens, state);

  return (
    <div class="profile-page" key={"profile-" + type}>
      {profile.username ? (
        <div>
          <div class="user-info">
            <div class="container">
              <div class="row">
                <div class="col-xs-12 col-md-10 offset-md-1">
                  <img
                    class="user-img"
                    src={profile.image}
                    alt={profile.username}
                  />
                  <h4>{profile.username}</h4>
                  <p>{profile.bio}</p>

                  <EditProfileSettings isUser={isUser} />
                  <FollowUserButton
                    isUser={isUser}
                    user={profile}
                    follow={actions.follow}
                    unfollow={actions.unfollow}
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="container">
            <div class="row">
              <div class="col-xs-12 col-md-10 offset-md-1">
                <div class="articles-toggle">
                  <Tabs profile={profile} type={type} />
                </div>

                <ArticleList
                  articles={articles}
                  articlesCount={articlesCount}
                  currentPage={currentPage}
                  changePage={actions.changeUserPage}
                  favorite={actions.favorite}
                  unfavorite={actions.unfavorite}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export { FavoriteProfile, UserProfile };
