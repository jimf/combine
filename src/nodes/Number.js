const { Component } = require('react')
const DOM = require('react-dom-factories')
const nodePropTypes = require('./_propTypes')
const { nodeTypes } = require('../constants')
const { div, input, label } = DOM

class NumberComponent extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e) {
    this.props.updateState({
      ...this.props.state,
      value: Number(e.target.value)
    })
  }
  render () {
    const { value } = this.props.state
    return div({ className: 'field' },
      label({ className: 'label' }, [
        'value',
        div({ className: 'control', key: 'i' },
          input({ className: 'input', onChange: this.handleChange, type: 'number', value })
        )
      ])
    )
  }
}

NumberComponent.propTypes = nodePropTypes

module.exports = {
  name: 'Number',
  aliases: [],
  tags: ['math'],
  implementation: (state) => state.value,
  component: NumberComponent,
  state: {
    value: 0
  },
  inputs: {},
  outputs: {
    value: { name: 'value', type: nodeTypes.Number }
  },
  documentation: 'Provides a constant number value.',
  version: '0.0.1',
  uid: 'nodes/Number'
}
