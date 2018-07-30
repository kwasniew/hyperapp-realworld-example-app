# ![RealWorld Example App](./logo.png)

> ### Hyperapp codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


### [Demo](https://hyperapp.netlify.com/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a fully fledged fullstack application built with [Hyperapp](https://github.com/hyperapp/hyperapp) including CRUD operations, authentication, routing, pagination, and more.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.


# How it works

The section below is not intended as a beginner's intro to hyperapp, but rather some notes with tradeoffs to consider 
when building a bigger application with Hyperapp.

## Build

I use [parcel](https://parceljs.org/) to automate application build. Ideally I'd like to avoid bundling and transpilation
during development as most modern browsers support the latest ES features. 
Unfortunately browsers can't resolve npm based dependencies with imports. 
Also, browsers don't understand JSX. My main motivation for using JSX over ES6 tagged template literals is better 
code formatting support in most tools.

index.html is our main entry point and parcel resolves graph of dependencies from there. First it goes to src/main.js and then
resolves all the other JS dependencies.

## App structure

main.js - injects browser specific dependencies to our app. It's only used for production code, in tests we can inject test doubles
instead of real fetch or localStorage. In the remaining parts of my codebase I try to avoid using window or any other global object
in favor of argument passing (dependency injection).

app.js - this is where we build main **dependency graph** for our application. Here we initialize localStorage based **session repository** and fetch
based **API gateway** and inject them into corresponding action factories. 

**Actions** (article, articles, auth, editor, profile, settings) are split along **business capabilities**.
Actions manage their parts of the **state**.
To keep actions testable we always inject all heavy dependencies. 
Scaling application logic and state follows a simple strategy: if a given object gets too big split it into smaller objects and delegate.

All view code resides in one view directory and consists only of **view functions/page fragments**. 
Scaling view code follows a simple strategy: if a given view fragment gets too big split it into smaller fragments and delegate.

Hyperapp itself expects state, actions, view and mount point. app function is our main contact point with the framework.
```
app(state, actions, view, document.body)
```
In app.js we provide initial value of the application state, then we aggregate actions from all the modules that make up the app
and finally we provide aggregate view of the entire app. 

## Data model

State/model is inspired by [Elm RealWorld](https://github.com/rtfeldman/elm-spa-example/).
To keep it simple I don't use things like Maybe types as they don't seem to be idiomatic in the JS world.
Data modelling is where I missed Elm like static type system the most.

Hyperapp enforces one big state object and doesn't allow you to mutate it. It raises 2 questions:
* how to get deeply nested fields w/o duplicating code in many places
* how to update deeply nested field in the immutable world

Usually people write selectors to solve the first problem.  
To overcome the second issue we either use Object.assign() or spread objects extensively.


Lenses (e.g. provided by ramda) solve this problem is a more composable, realiable and elegant way.


Instead of writing
```
const authorSelector = state => state.page.article.author // read
{...state, page: {...state.page, article: {...state.page.article, author: 'new author'}}} //write
```
we can do the following
```
R.view(R.lensPath(['page', 'article', 'author']), state) //read
R.set(R.lensPath(['page', 'article', 'author']), 'new author', state) // simple write
R.over(R.lensPath(['page', 'article', 'author']), R.toUpper, state) // more complex write 
```

Please note that there's a symmetry between getting and setting the data. 

For state derived values/selectors I decided to write some JS code on the top of lenses view without any extra library like [reselect](https://github.com/reduxjs/reselect).
I can add memoization on top when needed. However my runtime performance analysis didn't show bottlenecks in this area so far. 

## Views

All view related code is pure functions/view fragments/stateless components mapping state to Virtual DOM in JSX.

I reused most of the code from [React-Redux RealWorld](https://github.com/gothinkster/react-redux-realworld-example-app).
The main difference is that there's only functions and no components with local state. I find it easier to reason about
and manage one state object rather than state split between different components. 

I decided to pass all function arguments explicitly at the expense of more boilerplate. Another option would be to use
[lazy components](https://github.com/hyperapp/hyperapp#lazy-components) which is basically Hyperapp equivalent
of React's mapStateToProps/mapDispatchToProps where we allow each view fragment to peek inside state and actions.

Compared to React conventions, hyperapp favors native DOM events and attributes (e.g onclick over onClick and class over className).
This is nice since I can transfer my DOM knowledge.

## Routing

Routing state is part of the main state object. Router also enhances actions with a history.pushState() wrapper (actions.location.go).
I copy pasted parts of the original [@hyperapp/router](https://github.com/hyperapp/router) that I found useful and they
live in the router directory (locations and parseRoute). 
I don't use Route components modelled after React Router components as they encourage data fetching from lifecycle hooks
which I don't like.
I also prefer regular anchor tags over Link components which don't allow to inject API calls before we change URL. 
I use [internal-nav-helper](https://github.com/HenrikJoreteg/internal-nav-helper)
to have a single click handler in the root element of the application. By default all links end up in this common handler unless you
opt out by stopping event propagation.

Client side routing cycle looks like this: 
* click a link with href 
* load new page (set new page name based on href and preload its data from API)
* dynamically load page by name (API data arrives in the background)
This way our view functions don't need any oncreate/onupdate hooks (think componentDidMount and co. in the React world).
We select views dynamically based on the current page name, not on the current state of the URL.

To make back button work correctly we also track popstate events.

## API and async patterns

Most async code in this app revolves around API interactions that are simple enough to be handled with promises (no sagas/observables etc.).
I factored out repeatable async flows into helper functions. E.g. actions/forms.js has withErrorHandling function
that keeps track of starting/stoping async requests and handling potential errors.
Future version of Hyperapp should have the concept of "effects as data" similar to Elm and I'm looking forward to it as 
it should make testing easier. 

## Error handling

I only did the minimum to replicate basic form error handling (client errors) as shown in the reference React version.
We could go one step further and add better server error handling for API errors/network failures.

## JS - the best parts

In this codebase I try to use simple and predictable language constructs so I avoid this (unknown behavior without looking
at call site) and classes (way too complex [mental model](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch6.md#mental-models-compared)). 
The code is mostly based on functions, closures and object literals. 

## Code size

[JS startup performance](https://medium.com/reloading/javascript-start-up-performance-69200f43b201) is a problem for many SPAs.
To stay within a [reasonable performance budget](https://infrequently.org/2017/10/can-you-afford-it-real-world-web-performance-budgets/)
your framework should be as tiny as possible. One could even argue that this kind of app shouldn't be a SPA in the first place.
Anyway, I digress. 
Hyperapp itself is only around 1kb gzipped and minified which is 400 lines of code. It's not only good for performance reasons
but also allows me to understand the framework code.

The whole app weights around 25kB gzipped/minified split equally between my app code and libraries (mostly functional
 utilities and markdown parser).
 
 ![App](https://i.imgur.com/TZ1GD5Q.png) 
 
 Application code itself is about 2200 LoC split equally between views and application logic. 
 It makes it comparable to [React-Redux RealWorld](https://github.com/gothinkster/react-redux-realworld-example-app) version in terms of the 
 userland codebase size.
 
 ## Startup time
 
Clean start is about 5 seconds on my Macbook Air and with parcel caching enabled it's about 1 second.

## Tests

Because all moving parts as exposed as arguments we can explicitly pass test doubles instead hacking import mechanism with jest.mock.
I find the jest clean startup times a little bit too slow but decided to use it anyway because of the convenience of snapshots and jsdom.

### Slow: Approval text based/snapshot tests with jsdom

```npm run test:slow```

I use approval snapshot tests for the entire app. We simulate user interacting with our app and take snapshots after
each significant action. The tests rely on built-in jsdom support in jest so there's no need to spin up a browser.
Yet the tests still take about [3 seconds](https://github.com/jsdom/jsdom/issues/1454). 
To automate interactions and waiting for elements to appear in async fashion I use [dom-testing-library](https://github.com/kentcdodds/dom-testing-library).

To stub out localStorage and fetch calls I created manual test doubles. It makes our tests predictable.
Snapshots don't capture user intent very well but on the other hand are really cheap to create. It's a tradeoff I'm willing to make here
as the role of this tests will be to provide coarse grained verification.
As the code grows we can add page objects/screenplays/another technique du jour in the testing world.

### Fast: Unit tests

```npm run test:fast```

I want to have [subsecond feedback](https://skillsmatter.com/skillscasts/9971-testable-software-architecture-with-aslak-hellesoy) from those tests even with clean start. 
Those tests live next to code they test.
Since we clearly separated state and actions from the view, we can test state transitions very easily.
The test format follows this template: 
* given some initial state
* trigger some action/behavior
* verify state afterwards.

Some state transitions are two step. First we get immediate and synchronous state transition. Then it's followed by the async state transition.
Each async action returns a promise allowing the test code to wait for it.  

For IO and modules I'm interacting with I use manually written test doubles (I personally find no need for mocking library in JS). 

# Getting started

```
npm i
npm start
npm test
```

Go to: [http://localhost:1234]()

