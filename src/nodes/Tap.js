const { Component } = require('react')
const DOM = require('react-dom-factories')
const nodePropTypes = require('./_propTypes')
const { nodeTypes } = require('../constants')
const { pre } = DOM

class TapComponent extends Component {
  render () {
    const { value } = this.props.inputs
    let rendered = ''

    switch (value) {
      case null:
        rendered = 'null'
        break

      case undefined:
        rendered = 'undefined'
        break

      default:
        rendered = JSON.stringify(value, true, 2)
        break
    }

    return pre(null, `value = ${rendered}`)
  }
}

TapComponent.propTypes = nodePropTypes

module.exports = {
  name: 'Tap',
  aliases: [],
  tags: [],
  implementation: (state, inputs) => inputs.value,
  component: TapComponent,
  state: {},
  inputs: {
    value: { name: 'value', type: nodeTypes.Any }
  },
  outputs: {
    value: { name: 'value', type: nodeTypes.Any }
  },
  documentation: 'Inspect a value as it moves through the pipeline.',
  version: '0.0.1',
  uid: 'nodes/Tap'
}
