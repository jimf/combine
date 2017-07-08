const { createElement } = require('react')
const DOM = require('react-dom-factories')
const PropTypes = require('prop-types')
const Connection = require('./Connection')
const { div, li, ul } = DOM

const NodeContent = ({ children, cid, connectionModes, inputs, onConnectionClick, outputs, updateConnectionPosition }) =>
  div({ className: 'node__content card-content' }, [
    div({ key: 't', className: 'level' }, [
      div({ key: 'l', className: 'level-left' },
        ul({ className: 'node-inputs' }, Object.keys(inputs).map((key, idx) =>
          li({ key: idx }, [
            createElement(Connection, { key: `li${idx}btn`, onClick: onConnectionClick, cid, type: 'input', name: inputs[key].name, updatePosition: updateConnectionPosition, mode: connectionModes[`${cid}-input-${inputs[key].name}`] }),
            `${inputs[key].name}:${inputs[key].type}`
          ])
        ))
      ),
      div({ key: 'r', className: 'level-right' },
        ul({ className: 'node-outputs' }, Object.keys(outputs).map((key, idx) =>
          li({ key: idx }, [
            `${outputs[key].name}:${outputs[key].type}`,
            createElement(Connection, { key: `li${idx}btn`, onClick: onConnectionClick, cid, type: 'output', name: outputs[key].name, updatePosition: updateConnectionPosition, mode: connectionModes[`${cid}-output-${outputs[key].name}`] })
          ])
        ))
      )
    ]),
    div({ key: 'b', className: 'node-component' }, children)
  ])

NodeContent.propTypes = {
  connectionModes: PropTypes.object.isRequired,
  inputs: PropTypes.object.isRequired,
  onConnectionClick: PropTypes.func.isRequired,
  outputs: PropTypes.object.isRequired,
  updateConnectionPosition: PropTypes.func.isRequired
}

module.exports = NodeContent
