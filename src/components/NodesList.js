const { createElement } = require('react')
const DOM = require('react-dom-factories')
const PropTypes = require('react-proptypes')
const NodeContainer = require('./NodeContainer')
const { div } = DOM

const NodesList = ({
  availableNodes,
  nodes,
  onConnectionClick,
  onRemoveNode,
  updateNodeState
}) =>
  div({ className: 'nodes-list' }, [
    nodes.map(({ uid, cid, top, left, state }) => {
      const nodeSpec = availableNodes.index[uid]
      return createElement(NodeContainer, {
        cid,
        inputs: nodeSpec.inputs,
        key: cid,
        onConnectionClick: onConnectionClick,
        onRemove: onRemoveNode,
        outputs: nodeSpec.outputs,
        style: { top, left },
        title: nodeSpec.name
      }, nodeSpec.component && createElement(nodeSpec.component, {
        state,
        inputs: {},
        updateState: updateNodeState(cid)
      }))
    })
  ])

NodesList.propTypes = {
  availableNodes: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  onRemoveNode: PropTypes.func.isRequired,
  updateNodeState: PropTypes.func.isRequired
}

module.exports = NodesList
