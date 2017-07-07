const { createElement } = require('react')
const DOM = require('react-dom-factories')
const { DropTarget } = require('react-dnd')
const NodesList = require('./NodesList')
const Search = require('./Search')
const ConnectionLines = require('./ConnectionLines')
const { AppState, nodeDragType } = require('../constants')
const { div } = DOM

const dropTarget = {
  drop (props, monitor) {
    const { x, y } = monitor.getDifferenceFromInitialOffset()
    props.onMoveNode(monitor.getItem().cid, x, y)
  }
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
})

const handleContainerClick = props => e => {
  if (e.target.classList.contains('connection-lines')) {
    props.onCanvasClick(e.clientX, e.clientY, props.win.innerWidth)
  }
}

const Container = props =>
  props.connectDropTarget(
    div({ className: 'main-container' }, [
      createElement(ConnectionLines, { ...props, key: 'lines', onClick: handleContainerClick(props) }),
      createElement(NodesList, { ...props, key: 'nodes-list' }),
      props.app.state === AppState.Searching && createElement(Search, {
        ...props.app,
        key: 'search',
        items: props.availableNodes.uids.map(uid => props.availableNodes.index[uid]),
        onSearch: props.onSearch
      })
    ])
  )

Container.propTypes = {}

module.exports = DropTarget(nodeDragType, dropTarget, collect)(Container)
