const { Component } = require('react')
const DOM = require('react-dom-factories')
const nodePropTypes = require('./_propTypes')
const { nodeTypes } = require('../constants')
const { div, label, textarea } = DOM

const textareaStyles = {
  fontFamily: 'monospace',
  whiteSpace: 'nowrap',
  overflow: 'auto'
}

class EvalJavaScriptComponent extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e) {
    this.props.updateState({
      ...this.props.state,
      input: e.target.value
    })
  }
  render () {
    const { input } = this.props.state
    return div({ className: 'field' },
      label({ className: 'label' }, [
        'code',
        div({ className: 'control', key: 'i' },
          textarea({ className: 'textarea is-small', onChange: this.handleChange, value: input, style: textareaStyles })
        )
      ])
    )
  }
}

EvalJavaScriptComponent.propTypes = nodePropTypes

module.exports = {
  name: 'Eval JavaScript',
  aliases: [],
  tags: [],
  implementation: (state, inputs) => {
    /* eslint no-new-func:off */
    try {
      const fn = new Function('a', 'b', 'c', 'd', 'e', `'use strict';\n\n${state.input}`)
      return fn(inputs.a, inputs.b, inputs.c, inputs.d, inputs.e)
    } catch (err) {
      /* do nothing */
    }
  },
  component: EvalJavaScriptComponent,
  state: {
    input: ''
  },
  inputs: {
    a: { name: 'a', type: nodeTypes.Any },
    b: { name: 'b', type: nodeTypes.Any },
    c: { name: 'c', type: nodeTypes.Any },
    d: { name: 'd', type: nodeTypes.Any },
    e: { name: 'e', type: nodeTypes.Any }
  },
  outputs: {
    result: { name: 'result', type: nodeTypes.Any }
  },
  documentation: 'Evaluate input as JavaScript.',
  version: '0.0.1',
  uid: 'nodes/EvalJavaScript'
}
