const { createSelector } = require('reselect')
const { AppState, nodeTypes } = require('./constants')
const { findWhere, flatMap, tsort } = require('./util')

const isValidTypePair = (t1, t2) =>
  t1 === t2 || t1 === nodeTypes.Any || t2 === nodeTypes.Any

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
          .map(name => `${node.cid}-${name}`)
      ),
      nodes.filter(node => node.cid !== app.cid)
    )
  }
)

exports.calculateInputsSelector = createSelector(
  availableNodesIndexSelector,
  connectionsSelector,
  nodesSelector,
  (availableNodesIndex, connections, nodes) => {
    const result = {}

    // tsort(connections).forEach(connection => {
    //   const [cid, connType, name] = connection.split('-')

    //   result[cid] = result.cid || { inputs: {}, outputs: {} }
    // })

    return result
  }
)
