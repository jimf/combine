const { Component, createElement } = require('react')
const DOM = require('react-dom-factories')
const Chart = require('react-chartist').default
const nodePropTypes = require('./_propTypes')
const { div } = DOM

class BarChartComponent extends Component {
  render () {
    const { data } = this.props.inputs

    return div(null,
      data && createElement(Chart, {
        type: 'Bar',
        data: {
          labels: data.map(datum => datum.x),
          series: [data.map(datum => datum.y)]
        }
      })
    )
  }
}

BarChartComponent.propTypes = nodePropTypes

module.exports = {
  name: 'Bar Chart',
  aliases: [],
  tags: ['chart'],
  implementation: (state, inputs) => inputs.data,
  component: BarChartComponent,
  state: {},
  inputs: {
    data: { name: 'data', type: 'Array Object' }
  },
  outputs: {
    data: { name: 'data', type: 'Array Object' }
  },
  documentation: 'Render a series of x/y pairs as a bar chart.',
  version: '0.0.1',
  uid: 'nodes/BarChart'
}
