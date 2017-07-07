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

const ConnectionLines = ({ connections, connectionPositions, onClick }) =>
  svg({ className: 'connection-lines', width: 0, height: 0, onClick },
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

ConnectionLines.propTypes = {
  connections: PropTypes.object.isRequired,
  connectionPositions: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

module.exports = ConnectionLines
