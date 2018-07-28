import { h } from "hyperapp";
import Banner from "./Banner";
import ArticleList from "../ArticleList/ArticleList";
import Tags from "./Tags";
import GlobalFeedTab from "./GlobalFeedTab";
import TagFilterTab from "./TagFilterTab";
import YourFeedTab from "./YourFeedTab";
import {
  articlesLens,
  currentPageLens,
  tagsLens,
  activeFeedLens,
  tokenLens,
  isLoadingLens
} from "../../lenses";
import view from "ramda/src/view";
import { GLOBAL_FEED, USER_FEED } from "../../consts";

const Home = ({ state, actions }) => {
  const { articles, articlesCount } = view(articlesLens, state);
  const currentPage = view(currentPageLens, state);
  const activeFeed = view(activeFeedLens, state);
  const tags = view(tagsLens, state);
  const token = view(tokenLens, state);
  const isLoading = view(isLoadingLens, state);

  return (
    <div class="home-page" key="home-page">
      <Banner />

      <div class="container page">
        <div class="row">
          <div class="col-md-9">
            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">
                <YourFeedTab
                  token={token}
                  tab={activeFeed}
                  onTabClick={() => actions.changeTab(USER_FEED)}
                />
                <GlobalFeedTab
                  tab={activeFeed}
                  onTabClick={() => actions.changeTab(GLOBAL_FEED)}
                />
                <TagFilterTab tag={activeFeed} />
              </ul>
            </div>

            <ArticleList
              articles={articles}
              articlesCount={articlesCount}
              currentPage={currentPage}
              changePage={actions.changePage}
              favorite={actions.favorite}
              unfavorite={actions.unfavorite}
              isLoading={isLoading}
            />
          </div>

          <div class="col-md-3">
            <div class="sidebar">
              <p>Popular Tags</p>

              <Tags tags={tags} onClickTag={actions.changeTab} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
