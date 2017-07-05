const DOM = require('react-dom-factories')
const PropTypes = require('prop-types')

const { button, div, header, i, span } = DOM

const NodeHeader = ({ cid, onRemove, title }) =>
  header({ className: 'node__header card-header' }, [
    div({ key: 'l', className: 'node-name card-header-title' }, title),
    button({ key: 'r', className: 'button is-small node-action-button card-header-icon', type: 'button', 'aria-label': 'Remove', onClick: () => onRemove(cid) },
      span({ className: 'icon is-small' },
        i({ className: 'fa fa-times' })
      )
    )
  ])

NodeHeader.propTypes = {
  cid: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

module.exports = NodeHeader
