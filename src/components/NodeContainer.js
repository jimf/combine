const { Component, createElement } = require('react')
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

class NodeContainer extends Component {
  constructor () {
    super()
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.state = { isDraggable: true }
  }
  handleMouseOver (e) {
    this.setState({
      isDraggable: e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT'
    })
  }
  render () {
    const props = this.props
    const rendering = (
      div({ className: 'node card', style: props.style, onMouseOver: this.handleMouseOver }, [
        createElement(NodeHeader, { ...props, key: 'h' }),
        createElement(NodeContent, { ...props, key: 'c' }, props.children)
      ])
    )
    return this.state.isDraggable
      ? props.connectDragSource(rendering)
      : rendering
  }
}

NodeContainer.propTypes = {
  style: PropTypes.object
}

module.exports = DragSource(nodeDragType, nodeDragSource, collect)(NodeContainer)
