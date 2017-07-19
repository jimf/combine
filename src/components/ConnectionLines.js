const { Component } = require('react')
const DOM = require('react-dom-factories')
const PropTypes = require('prop-types')
const { svg, path } = DOM
const { flatMap } = require('../util')

const getPathDescription = (p1, p2) => {
  const offset = Math.round(Math.abs(p2.x - p1.x) * 0.3)
  return 'M%d,%d C%d,%d %d,%d %d,%d'
    .replace('%d', p1.x)
    .replace('%d', p1.y)
    .replace('%d', p1.x + offset)
    .replace('%d', p1.y)
    .replace('%d', p2.x - offset)
    .replace('%d', p2.y)
    .replace('%d', p2.x)
    .replace('%d', p2.y)
}

class ConnectionLines extends Component {
  constructor () {
    super()
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.state = {
      mouseDown: false,
      isDragging: false,
      originX: 0,
      originY: 0
    }
  }
  handleMouseDown (e) {
    if (e.button !== 0) { return }
    this.setState({
      mouseDown: true,
      originX: e.pageX,
      originY: e.pageY
    })
  }
  handleMouseMove (e) {
    if (!this.state.mouseDown) {
      return
    }
    if (!this.state.isDragging) {
      this.setState({
        isDragging: true
      })
    }
    this.props.onDrag(
      e.pageX - this.state.originX,
      e.pageY - this.state.originY
    )
  }
  handleMouseUp (e) {
    if (this.state.isDragging) {
      this.props.onDragEnd(
        e.pageX - this.state.originX,
        e.pageY - this.state.originY
      )
    } else {
      this.props.onClick(e)
    }
    this.setState({ mouseDown: false, isDragging: false })
  }
  render () {
    const { connections, connectionPositions } = this.props

    return (
      svg({ className: 'connection-lines', width: 0, height: 0, onMouseDown: this.handleMouseDown, onMouseMove: this.handleMouseMove, onMouseUp: this.handleMouseUp },
        flatMap(
          inputConn =>
            connections[inputConn].map(outputConn =>
              [connectionPositions[inputConn], connectionPositions[outputConn]]
            )
            .filter(([p1, p2]) => p1 && p2)
            .map(([p1, p2]) =>
              path({ d: getPathDescription(p1, p2), key: `${p1.x}${p1.y}${p2.x}${p2.y}` })
            ),
          Object.keys(connections).filter(inputConn => connections[inputConn].length)
        )
      )
    )
  }
}

ConnectionLines.propTypes = {
  connections: PropTypes.object.isRequired,
  connectionPositions: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired
}

module.exports = ConnectionLines
