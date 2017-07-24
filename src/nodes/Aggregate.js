const { Component } = require('react')
const DOM = require('react-dom-factories')
const nodePropTypes = require('./_propTypes')
const { nodeTypes } = require('../constants')
const { div, select, label, option } = DOM

const aggregates = {
  Sum: {
    concat: (x, y) => x + y,
    empty: 0
  },
  Product: {
    concat: (x, y) => x * y,
    empty: 1
  },
  Any: {
    concat: (x, y) => x || y,
    empty: false
  },
  All: {
    concat: (x, y) => x && y,
    empty: true
  },
  Min: {
    concat: (x, y) => Math.Min(x, y),
    empty: Infinity
  },
  Max: {
    concat: (x, y) => Math.max(x, y),
    empty: -Infinity
  }
}

class AggregateComponent extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e) {
    this.props.updateState({
      ...this.props.state,
      combineWith: e.target.value
    })
  }
  render () {
    const { combineWith } = this.props.state
    return div({ className: 'field' },
      div({ className: 'select' },
        label({ className: 'label' }, [
          'combine with',
          select({ key: 's', onChange: this.handleChange, value: combineWith }, Object.keys(aggregates).map(key =>
            option({ key }, key)
          ))
        ])
      )
    )
  }
}

AggregateComponent.propTypes = nodePropTypes

module.exports = {
  name: 'Aggregate',
  aliases: ['reduce', 'flatmap', 'summarize', 'combine'],
  tags: [],
  implementation: (state, inputs) =>
    (inputs.data || []).reduce(
      aggregates[state.combineWith].concat,
      aggregates[state.combineWith].empty
    ),
  component: AggregateComponent,
  state: {
    combineWith: 'Sum'
  },
  inputs: {
    data: { name: 'data', type: nodeTypes.ArrayAny }
  },
  outputs: {
    value: { name: 'value', type: nodeTypes.Any }
  },
  documentation: 'Reduce an array of values down to a single value.',
  version: '0.0.1',
  uid: 'nodes/Aggregate'
}
