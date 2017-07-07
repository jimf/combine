# Combine

This is my own implementation of the Combine app demoed by
[Jonas Gebhardt](https://twitter.com/jonasgebhardt) in his React Europe 2016
talk [Evolving the Visual Programming Environment with React](https://www.youtube.com/watch?v=WjJdaDXN5Vs).
Credit to Jonas for the ideas. I thought the concepts seemed fun, both to
implement and use, and wanted to take a stab at it.

_Work in progress_

## Todo

- Add svg for visually indicating connected nodes
  - Partially done, but still needs to update on node move/delete
- Wire up `validConnections` state to disallow connecting ports of invalid types
- Update remove-node handling to properly update connections graph
- Define additional nodes
- Refine node searching (search tags and aliases)
- Add keyboard shortcuts with proximity sorting for connecting nodes
- Add ability to "select" multiple nodes at once
  - (Unclear in video what this does. Bulk drag-n-drop?)
- Improve styles
- General cleanup
  - remove unused utils
  - clean up state tree
  - additional test coverage
  - consider whether react-redux would be worth pulling in
  - consider whether RxJS/most.js would make things any more elegant

## How to run

Clone this repo, install dependencies, and start the local development server:

    $ npm install
    $ npm start

## Running tests

    $ npm test

## Tech stack

### Core

- [React](https://facebook.github.io/react/) (w/o JSX)
- [Redux](http://redux.js.org/)
- [React DnD](http://react-dnd.github.io/react-dnd/)
- [React Select](http://jedwatson.github.io/react-select/)
- [reselect](https://github.com/reactjs/reselect)

I'm currently *not* using [RxJS](http://reactivex.io/rxjs/), which Jonas
used and commended in his talk. I may still elect to try it out (see Todo
section above), but think for the time being, Redux should be sufficient
without adding additional mental overhead of where state is coming from.

### Development

- [Babel](https://babeljs.io/)
- [budō](https://github.com/mattdesl/budo)
- [standard](https://standardjs.com/)
- [tape](https://github.com/substack/tape)

## License

MIT
