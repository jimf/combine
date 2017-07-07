const { createElement } = require('react')
const PropTypes = require('react-proptypes')
const DOM = require('react-dom-factories')
const { DragSource } = require('react-dnd')
const NodeHeader = require('./NodeHeader')
const NodeContent = require('./NodeContent')
const { nodeDragType } = require('../constants')

const { div } = DOM

const nodeDragSource = {
  beginDrag (props) {
    return { cid: props.cid }
  }
}

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
})

const NodeContainer = ({
  children,
  cid,
  connectDragSource,
  inputs,
  onConnectionClick,
  onRemove,
  outputs,
  style,
  title,
  updateConnectionPosition
}) =>
  connectDragSource(
    div({ className: 'node card', style }, [
      createElement(NodeHeader, { key: 'h', cid, onRemove, title }),
      createElement(NodeContent, { key: 'c', cid, inputs, onConnectionClick, outputs, updateConnectionPosition }, children)
    ])
  )

NodeContainer.propTypes = {
  style: PropTypes.object
}

module.exports = DragSource(nodeDragType, nodeDragSource, collect)(NodeContainer)
