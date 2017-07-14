const { Component } = require('react')
const DOM = require('react-dom-factories')
const parseCsv = require('csv-string/lib/parser')
const nodePropTypes = require('./_propTypes')
const { nodeTypes } = require('../constants')
const { div, textarea, label } = DOM

class ParseCsvComponent extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e) {
    this.props.updateState({
      ...this.props.state,
      data: e.target.value
    })
  }
  render () {
    const { data } = this.props.state
    return div({ className: 'field' },
      label({ className: 'label' }, [
        'data',
        div({ className: 'control', key: 'i' },
          textarea({ className: 'textarea', onChange: this.handleChange, value: data })
        )
      ])
    )
  }
}

ParseCsvComponent.propTypes = nodePropTypes

module.exports = {
  name: 'Parse CSV',
  aliases: [],
  tags: ['parse'],
  implementation: (state) =>
    parseCsv(state.data, ',').File(),
  component: ParseCsvComponent,
  state: {
    data: '',
    delimiter: ','
  },
  inputs: {},
  outputs: {
    value: { name: 'value', type: nodeTypes.ArrayArrayString }
  },
  documentation: 'Parse CSV data.',
  version: '0.0.1',
  uid: 'nodes/ParseCsv'
}
