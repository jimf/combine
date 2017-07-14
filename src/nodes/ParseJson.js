const { Component } = require('react')
const DOM = require('react-dom-factories')
const nodePropTypes = require('./_propTypes')
const { nodeTypes } = require('../constants')
const { div, textarea, label } = DOM

class ParseJsonComponent extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e) {
    this.props.updateState({
      ...this.props.state,
      json: e.target.value
    })
  }
  render () {
    const { json } = this.props.state
    return div({ className: 'field' },
      label({ className: 'label' }, [
        'json',
        div({ className: 'control', key: 'i' },
          textarea({ className: 'textarea', onChange: this.handleChange, value: json })
        )
      ])
    )
  }
}

ParseJsonComponent.propTypes = nodePropTypes

module.exports = {
  name: 'Parse JSON',
  aliases: [],
  tags: ['parse'],
  implementation: (state) => {
    try {
      return JSON.parse(state.json)
    } catch (e) {
      return {}
    }
  },
  component: ParseJsonComponent,
  state: {
    json: '{}'
  },
  inputs: {},
  outputs: {
    value: { name: 'value', type: nodeTypes.Object }
  },
  documentation: 'Parse a JSON string.',
  version: '0.0.1',
  uid: 'nodes/ParseJson'
}
