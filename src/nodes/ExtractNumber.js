const { Component } = require('react')
const DOM = require('react-dom-factories')
const nodePropTypes = require('./_propTypes')
const { path } = require('./util')
const { nodeTypes } = require('../constants')
const { div, input, label } = DOM

const strToPath = str =>
  str.split(/\./g)

class ExtractNumberComponent extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e) {
    this.props.updateState({
      ...this.props.state,
      path: e.target.value
    })
  }
  render () {
    const { path } = this.props.state
    return div({ className: 'field' },
      label({ className: 'label' }, [
        'path',
        div({ className: 'control', key: 'i' },
          input({ className: 'input', onChange: this.handleChange, value: path })
        )
      ])
    )
  }
}

ExtractNumberComponent.propTypes = nodePropTypes

module.exports = {
  name: 'Extract Number',
  aliases: [],
  tags: ['extract'],
  implementation: (state, inputs) =>
    Number(path(strToPath(state.path), inputs.value)),
  component: ExtractNumberComponent,
  state: {
    path: ''
  },
  inputs: {
    value: { name: 'value', type: nodeTypes.Any }
  },
  outputs: {
    value: { name: 'value', type: nodeTypes.Number }
  },
  documentation: 'Inspect a value as it moves through the pipeline.',
  version: '0.0.1',
  uid: 'nodes/ExtractNumber'
}
