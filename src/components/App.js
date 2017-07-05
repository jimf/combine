const { Component, createElement } = require('react')
const DOM = require('react-dom-factories')
const { DragDropContext } = require('react-dnd')
const Html5Backend = require('react-dnd-html5-backend')
const Container = require('./Container')
const { div } = DOM

class App extends Component {
  render () {
    const props = this.props
    return (
      div({ className: 'combine-app' },
        createElement(Container, props)
      )
    )
  }
}

module.exports = DragDropContext(Html5Backend)(App)
