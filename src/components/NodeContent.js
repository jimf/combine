const DOM = require('react-dom-factories')
const PropTypes = require('prop-types')
const { button, div, li, span, ul } = DOM

const NodeContent = ({ children, cid, inputs, onConnectionClick, outputs }) =>
  div({ className: 'node__content card-content' }, [
    div({ key: 't', className: 'level' }, [
      div({ key: 'l', className: 'level-left' },
        ul({ className: 'node-inputs' }, Object.keys(inputs).map((key, idx) =>
          li({ key: idx }, [
            button({ key: `li${idx}btn`, className: 'connector input-connector', onClick: () => { onConnectionClick(cid, 'input', inputs[key].name) } },
              span({ className: 'visually-hidden' }, inputs[key].name)
            ),
            `${inputs[key].name}:${inputs[key].type}`
          ])
        ))
      ),
      div({ key: 'r', className: 'level-right' },
        ul({ className: 'node-outputs' }, Object.keys(outputs).map((key, idx) =>
          li({ key: idx }, [
            `${outputs[key].name}:${outputs[key].type}`,
            button({ key: `li${idx}btn`, className: 'connector output-connector', onClick: () => { onConnectionClick(cid, 'output', outputs[key].name) } },
              span({ className: 'visually-hidden' }, outputs[key].name)
            )
          ])
        ))
      )
    ]),
    div({ key: 'b', className: 'node-component' }, children)
  ])

NodeContent.propTypes = {
  cid: PropTypes.number.isRequired,
  inputs: PropTypes.object.isRequired,
  onConnectionClick: PropTypes.func.isRequired,
  outputs: PropTypes.object.isRequired
}

module.exports = NodeContent
