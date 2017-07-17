const { Component } = require('react')
const DOM = require('react-dom-factories')
const nodePropTypes = require('./_propTypes')
const { nodeTypes } = require('../constants')
const { div, input, label } = DOM

class IntervalSeriesComponent extends Component {
  constructor () {
    super()
    this.updateValue = this.updateValue.bind(this)
    this.handleIntervalChange = this.handleIntervalChange.bind(this)
    this.handleStepChange = this.handleStepChange.bind(this)
  }
  componentDidMount () {
    const intervalId = window.setInterval(this.updateValue, this.props.state.interval)
    this.props.updateState({
      ...this.props.state,
      intervalId
    })
  }
  componentWillUnmount () {
    window.clearInterval(this.props.state.intervalId)
  }
  updateValue () {
    const { value, step } = this.props.state
    this.props.updateState({
      ...this.props.state,
      value: value + step
    })
  }
  handleIntervalChange (e) {
    window.clearInterval(this.props.state.intervalId)
    const interval = Number(e.target.value)
    const intervalId = window.setInterval(this.updateValue, interval)
    this.props.updateState({
      ...this.props.state,
      intervalId,
      interval
    })
  }
  handleStepChange (e) {
    this.props.updateState({
      ...this.props.state,
      step: Number(e.target.value)
    })
  }
  render () {
    const { interval, step } = this.props.state
    return div({ className: 'field' }, [
      label({ className: 'label', key: 'f1' }, [
        'interval (ms)',
        div({ className: 'control', key: 'i' },
          input({ className: 'input', onChange: this.handleIntervalChange, type: 'number', min: 10, value: interval })
        )
      ]),
      label({ className: 'label', key: 'f2' }, [
        'step',
        div({ className: 'control', key: 'i' },
          input({ className: 'input', onChange: this.handleStepChange, type: 'number', min: 1, value: step })
        )
      ])
    ])
  }
}

IntervalSeriesComponent.propTypes = nodePropTypes

module.exports = {
  name: 'IntervalSeries',
  aliases: [],
  tags: ['interval'],
  implementation: (state) => state.value,
  component: IntervalSeriesComponent,
  state: {
    intervalId: null,
    interval: 1000,
    step: 1,
    value: 0
  },
  inputs: {},
  outputs: {
    value: { name: 'value', type: nodeTypes.Number }
  },
  documentation: 'Provides a stream of values over time.',
  version: '0.0.1',
  uid: 'nodes/IntervalSeries'
}
