const reducer = require('../src/reducers')

exports.reduceActions = (actions, initialState = reducer(undefined, {})) =>
  actions.reduce(
    (state, action) => reducer(state, action),
    initialState
  )

exports.dummyNodes = {
  True: {
    name: 'True',
    aliases: [],
    tags: [],
    implementation: () => true,
    component: null,
    state: {},
    inputs: {},
    outputs: {
      value: { name: 'value', type: 'Boolean' }
    },
    documentation: 'Always true.',
    version: '0.0.1',
    uid: 'dummy/True'
  },
  Number: {
    name: 'Number',
    aliases: [],
    tags: [],
    implementation: (state) => state.value,
    component: null,
    state: {
      value: 0
    },
    inputs: {},
    outputs: {
      value: { name: 'value', type: 'Number' }
    },
    documentation: 'Number value.',
    version: '0.0.1',
    uid: 'dummy/Number'
  },
  Add: {
    name: 'Add',
    aliases: [],
    tags: [],
    implementation: (state, inputs) => inputs.operand1 + inputs.operand2,
    component: null,
    state: {},
    inputs: {
      operand1: { name: 'operand1', type: 'Number' },
      operand2: { name: 'operand2', type: 'Number' }
    },
    outputs: {
      result: { name: 'result', type: 'Number' }
    },
    documentation: 'Sum.',
    version: '0.0.1',
    uid: 'dummy/Add'
  },
  Tap: {
    name: 'Tap',
    aliases: [],
    tags: [],
    implementation: (state, inputs) => inputs,
    component: null,
    state: {},
    inputs: {
      value: { name: 'value', type: 'Any' }
    },
    outputs: {
      value: { name: 'value', type: 'Any' }
    },
    documentation: 'Tap.',
    version: '0.0.1',
    uid: 'dummy/Tap'
  }
}
