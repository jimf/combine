const PropTypes = require('prop-types')

module.exports = {
  state: PropTypes.object.isRequired,
  inputs: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired
}
