const { nodeTypes } = require('../constants')

module.exports = {
  name: 'Add',
  aliases: ['sum'],
  tags: ['math'],
  implementation: (state, inputs) => inputs.operand1 + inputs.operand2,
  component: null,
  state: {},
  inputs: {
    operand1: { name: 'operand1', type: nodeTypes.Number },
    operand2: { name: 'operand2', type: nodeTypes.Number }
  },
  outputs: {
    result: { name: 'result', type: nodeTypes.Number }
  },
  documentation: 'Add two numbers together.',
  version: '0.0.1',
  uid: 'nodes/Add'
}
