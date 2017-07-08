const { createSelector } = require('reselect')
const { AppState, ConnectionState, nodeTypes } = require('./constants')
const { findWhere, flatMap, tsort } = require('./util')

const isValidTypePair = (t1, t2) =>
  t1 === t2 || t1 === nodeTypes.Any || t2 === nodeTypes.Any

const parseConnection = conn => {
  const parts = conn.split('-')
  parts[0] = Number(parts[0])
  return parts
}

const appSelector = state => state.app
const availableNodesIndexSelector = state => state.availableNodes.index
const connectionsSelector = state => state.connections
const nodesSelector = state => state.nodes

exports.connectingNodeSpecSelector = createSelector(
  appSelector,
  availableNodesIndexSelector,
  nodesSelector,
  (app, availableNodesIndex, nodes) => {
    if (app.state === AppState.Connecting) {
      const uid = findWhere({ cid: app.cid }, nodes).uid
      return availableNodesIndex[uid]
    }
  }
)

exports.validConnectionsSelector = createSelector(
  appSelector,
  availableNodesIndexSelector,
  nodesSelector,
  exports.connectingNodeSpecSelector,
  (app, availableNodesIndex, nodes, connectingNodeSpec) => {
    if (app.state !== AppState.Connecting) {
      return []
    }

    const connecting = app.state.connectionType === 'input' ? 'inputs' : 'outputs'
    const other = connecting === 'inputs' ? 'outputs' : 'inputs'

    return flatMap(
      node => (
        Object.keys(availableNodesIndex[node.uid][other])
          .filter(name => {
            return isValidTypePair(
              connectingNodeSpec[connecting][app.name].type,
              availableNodesIndex[node.uid][other][name].type
            )
          })
          .map(name => `${node.cid}-${other.slice(0, -1)}-${name}`)
      ),
      nodes.filter(node => node.cid !== app.cid)
    )
  }
)

const inverseConnectionsSelector = createSelector(
  connectionsSelector,
  (connections) => {
    return Object.keys(connections).reduce((acc, connX) => {
      connections[connX].forEach((connY) => {
        acc[connY] = acc[connY] || []
        acc[connY].push(connX)
      })
      return acc
    }, {})
  }
)

exports.calculateInputsSelector = createSelector(
  availableNodesIndexSelector,
  connectionsSelector,
  inverseConnectionsSelector,
  nodesSelector,
  (availableNodesIndex, connections, inverseConnections, nodes) => {
    const result = tsort(connections).reduce((acc, conn) => {
      const [cid, connType, name] = parseConnection(conn)
      const node = findWhere({ cid }, nodes)
      const spec = availableNodesIndex[node.uid]

      acc.inputs[cid] = acc.inputs[cid] || {}
      acc.outputs[cid] = acc.outputs[cid] || {}

      if (connType === 'output') {
        acc.outputs[cid][name] = spec.implementation(node.state, acc.inputs[cid])
      } else if (inverseConnections[conn]) {
        let [depCid, /* unused */, depName] = parseConnection(inverseConnections[conn][0])
        acc.inputs[cid][name] = acc.outputs[depCid][depName]
      }

      return acc
    }, { inputs: {}, outputs: {} })

    return result.inputs
  }
)

exports.connectionModesSelector = createSelector(
  appSelector,
  connectionsSelector,
  inverseConnectionsSelector,
  exports.validConnectionsSelector,
  (app, connections, inverseConnections, validConnections) =>
    Object.keys(connections)
      .reduce((acc, conn) => {
        let [cid, type, name] = parseConnection(conn)
        let mode = ConnectionState.Ready

        if (type === 'output' && connections[conn].length) {
          mode = ConnectionState.Connected
        } else if (type === 'input' && inverseConnections[conn]) {
          mode = ConnectionState.Connected
        }

        if (app.state === AppState.Connecting) {
          if (validConnections.includes(conn)) {
            mode = ConnectionState.Valid
          } else {
            mode = ConnectionState.Invalid
          }

          if (app.cid === cid && app.connectionType === type && app.name === name) {
            mode = ConnectionState.Connecting
          }
        }

        return { ...acc, [conn]: mode }
      }, {})
)

