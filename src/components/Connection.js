const { Component } = require('react')
const DOM = require('react-dom-factories')
const PropTypes = require('prop-types')
const { button, span } = DOM

class Connection extends Component {
  constructor (props) {
    super(props)
    this.setButton = this.setButton.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  setButton (button) {
    this.button = button
  }

  handleClick () {
    const { cid, type, name } = this.props
    this.props.onClick(cid, type, name)
  }

  componentDidMount () {
    this.updatePositionState()
  }

  updatePositionState () {
    const { cid, type, name } = this.props
    const rect = this.button.getBoundingClientRect()
    const x = rect.left + Math.round((rect.right - rect.left) / 2)
    const y = rect.top + Math.round((rect.bottom - rect.top) / 2)
    this.props.updatePosition(cid, type, name, x, y)
  }

  render () {
    const { type, name } = this.props
    return button({ className: `connector ${type}-connector`, onClick: this.handleClick, ref: this.setButton },
      span({ className: 'visually-hidden' }, name)
    )
  }
}

Connection.propTypes = {
  cid: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['input', 'output']).isRequired,
  onClick: PropTypes.func.isRequired,
  updatePosition: PropTypes.func.isRequired
}

module.exports = Connection
