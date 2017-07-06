const { Component } = require('react')
const DOM = require('react-dom-factories')
const nodePropTypes = require('./_propTypes')
const { nodeTypes } = require('../constants')
const { div, input, label } = DOM

const URL_REGEX = /^https?:\/\/.{3,}$/i

// TODO: could be better
const isValidUrl = url =>
  URL_REGEX.test(url)

class FetchComponent extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e) {
    const url = e.target.value.trim()

    this.props.updateState({
      ...this.props.state,
      url
    })

    if (isValidUrl(url)) {
      window.fetch(url)
        .then(res => res.json())
        .then(body => {
          this.props.updateState({
            ...this.props.state,
            body
          })
        })
        .catch(err => {
          this.props.updateState({
            ...this.props.state,
            body: err
          })
        })
    }
  }
  render () {
    const { url } = this.props.state
    return div({ className: 'field' },
      label({ className: 'label' }, [
        'url',
        div({ className: 'control', key: 'i' },
          input({ className: 'input', onChange: this.handleChange, value: url })
        )
      ])
    )
  }
}

FetchComponent.propTypes = nodePropTypes

module.exports = {
  name: 'Fetch',
  aliases: [],
  tags: [],
  implementation: (state) => state.body,
  component: FetchComponent,
  state: {
    url: '',
    body: {}
  },
  inputs: {},
  outputs: {
    body: { name: 'body', type: nodeTypes.Object }
  },
  documentation: 'Fetch a JSON resource.',
  version: '0.0.1',
  uid: 'nodes/Fetch'
}
