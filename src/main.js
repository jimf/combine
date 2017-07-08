const { createElement } = require('react')
const { render } = require('react-dom')
const { createStore } = require('redux')
const App = require('./components/App')
const actions = require('./actions')
const reducer = require('./reducers')
const selectors = require('./selectors')

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
const addRule = actions.addNode()
const dispatch = actionCreator => (...args) =>
  store.dispatch(actionCreator(...args))

const mapStateToProps = state => ({
  ...state,
  onCanvasClick: dispatch(actions.clickCanvas),
  onConnectionClick: dispatch(actions.clickConnection),
  onMoveNode: dispatch(actions.translateNode),
  onRemoveNode: dispatch(actions.removeNode),
  onSearch: dispatch(addRule),
  updateNodeState: cid => state => store.dispatch(actions.updateNodeState(cid, state)),
  updateConnectionPosition: dispatch(actions.updateConnectionPosition),
  win: window,
  inputs: selectors.calculateInputsSelector(state),
  connectionModes: (function () {
    const r = selectors.connectionModesSelector(state)
    // console.log('connModes', r)
    return r
  })(),
})

store.subscribe(() => {
  render(
    createElement(App, mapStateToProps(store.getState())),
    document.getElementById('app')
  )
})

store.dispatch(actions.loadNodeList(require('./nodes').list))
window.store = store
