const { createElement } = require('react')
const DOM = require('react-dom-factories')
const PropTypes = require('react-proptypes')
const NodeContainer = require('./NodeContainer')
const { div } = DOM

const NodesList = ({
  availableNodes,
  connectionModes,
  inputs,
  nodes,
  onConnectionClick,
  onRemoveNode,
  updateConnectionPosition,
  updateNodeState
}) =>
  div({ className: 'nodes-list' }, [
    nodes.map(({ uid, cid, top, left, state }) => {
      const nodeSpec = availableNodes.index[uid]
      return createElement(NodeContainer, {
        cid,
        connectionModes,
        inputs: nodeSpec.inputs,
        key: cid,
        onConnectionClick: onConnectionClick,
        onRemove: onRemoveNode,
        outputs: nodeSpec.outputs,
        style: { top, left },
        title: nodeSpec.name,
        updateConnectionPosition
      }, nodeSpec.component && createElement(nodeSpec.component, {
        state,
        inputs: inputs[cid],
        updateState: updateNodeState(cid)
      }))
    })
  ])

NodesList.propTypes = {
  availableNodes: PropTypes.object.isRequired,
  inputs: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  onRemoveNode: PropTypes.func.isRequired,
  updateNodeState: PropTypes.func.isRequired
}

module.exports = NodesList
