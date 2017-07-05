const test = require('tape')
const subject = require('../src/reducers')
const actions = require('../src/actions')
const { AppState, SEARCH_WIDTH } = require('../src/constants')
const { dummyNodes, reduceActions } = require('./util')

test('Reducers: initial state', t => {
  t.deepEqual(subject(undefined, {}), {
    app: {
      state: AppState.Ready
    },
    availableNodes: {
      uids: [],
      index: {}
    },
    connections: {},
    nodes: []
  })
  t.end()
})

test('Reducers: unknown action', t => {
  const state1 = reduceActions([])
  const state2 = reduceActions([
    { type: 'DUMMY_UNKNOWN_TYPE' }
  ], state1)
  t.equal(state1, state2, 'returns previous state')
  t.end()
})

test('Reducers: ADD_NODE action', t => {
  const state = reduceActions([
    actions.loadNodeList([dummyNodes.True]),
    actions.clickCanvas(0, 0, 900),
    actions.addNode()(dummyNodes.True.uid)
  ])
  t.equal(state.app.state, AppState.Ready, 'puts app in ready state')
  t.deepEqual(state.nodes[0], {
    uid: dummyNodes.True.uid,
    cid: 1,
    top: 0,
    left: 0,
    state: dummyNodes.True.state
  }, 'adds node of the given uid with initial state and position')
  t.deepEqual(state.connections, {
    '1-output-value': []
  }, 'adds new inputs/outputs to connections graph')
  t.end()
})

test('Reducers: CLICK_CANVAS action', t => {
  const state1 = reduceActions([
    actions.clickCanvas(0, 0, 900)
  ])
  t.deepEqual(state1.app, {
    state: AppState.Searching,
    left: 0,
    searchValue: '',
    top: 0,
    width: 400
  }, 'when app is in ready state, enters searching state')

  const state2 = reduceActions([
    actions.clickCanvas(0, 0, 900),
    actions.clickCanvas(0, 0, 900)
  ])
  t.deepEqual(state2.app, {
    state: AppState.Ready
  }, 'when app is in searching state, enters ready state')

  const state3 = reduceActions([
    actions.clickCanvas(-900, -900, 900)
  ])
  t.ok(state3.app.left === 0 && state3.app.top === 0,
    'ensures search will not be positioned above/left-of viewport')

  const state4 = reduceActions([
    actions.clickCanvas(2000, 0, 900)
  ])
  t.ok(state4.app.left === (900 - SEARCH_WIDTH) && state3.app.top === 0,
    'ensures search will not be positioned right of viewport')
  t.end()
})

test('Reducers: CLICK_CONNECTION', t => {
  const addNode = actions.addNode()
  const initial = reduceActions([
    actions.loadNodeList([dummyNodes.Number, dummyNodes.Add]),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.Number.uid),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.Number.uid),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.Add.uid)
  ])

  // Test output-to-input connection:
  const beginOutputConnection = reduceActions([
    actions.clickConnection(1, 'output', 'value')
  ], initial)
  t.deepEqual(beginOutputConnection.app, {
    state: AppState.Connecting,
    cid: 1,
    connectionType: 'output',
    name: 'value'
  }, 'when app is in ready state and an output is clicked, enters connecting state')
  const outputInputConnection = reduceActions([
    actions.clickConnection(3, 'input', 'operand1')
  ], beginOutputConnection)
  t.deepEqual(outputInputConnection.app, {
    state: AppState.Ready
  }, 'when app is in connecting state, enters ready state')
  t.deepEqual(outputInputConnection.connections['1-output-value'], ['3-input-operand1'],
    'adds new connection in connections graph'
  )

  // Test input-to-output connection:
  const beginInputConnection = reduceActions([
    actions.clickConnection(3, 'input', 'operand1')
  ], initial)
  t.deepEqual(beginInputConnection.app, {
    state: AppState.Connecting,
    cid: 3,
    connectionType: 'input',
    name: 'operand1'
  }, 'when app is in ready state and an input is clicked, enters connecting state')
  const inputOutputConnection = reduceActions([
    actions.clickConnection(1, 'output', 'value')
  ], beginInputConnection)
  t.deepEqual(inputOutputConnection.app, {
    state: AppState.Ready
  }, 'when app is in connecting state, enters ready state')
  t.deepEqual(inputOutputConnection.connections['1-output-value'], ['3-input-operand1'],
    'adds new connection in connections graph'
  )

  // Test searching and a connection is clicked:
  const searchingAndConnClick = reduceActions([
    actions.clickCanvas(0, 0, 900),
    actions.clickConnection(1, 'output', 'value')
  ], initial)
  t.deepEqual(searchingAndConnClick.app, {
    state: AppState.Ready
  }, 'when app is in searching state, enters ready state')

  t.end()
})

test('Reducers: LOAD_NODE_LIST action', t => {
  const state = reduceActions([
    actions.loadNodeList([dummyNodes.True])
  ])
  t.deepEqual(state.availableNodes.uids, [
    dummyNodes.True.uid
  ], 'stores list of node uids')
  t.deepEqual(state.availableNodes.index, {
    [dummyNodes.True.uid]: dummyNodes.True
  }, 'stores index of nodes by uid')
  t.end()
})

test('Reducers: REMOVE_NODE action', t => {
  const addNode = actions.addNode()
  const state = reduceActions([
    actions.loadNodeList([dummyNodes.True]),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.True.uid),
    addNode(dummyNodes.True.uid),
    actions.removeNode(1)
  ])
  t.equal(state.app.state, AppState.Ready, 'puts app in ready state')
  t.equal(state.nodes.length, 1, 'removes a node from the node list')
  t.ok(state.nodes[0].cid !== 1, 'removes the node with the given cid')
  t.end()
})

test('Reducers: TRANSLATE_NODE action', t => {
  const addNode = actions.addNode()
  const state = reduceActions([
    actions.loadNodeList([dummyNodes.True]),
    actions.clickCanvas(400, 200, 900),
    addNode(dummyNodes.True.uid),
    actions.translateNode(1, 200, -100)
  ])
  t.equal(state.app.state, AppState.Ready, 'puts app in ready state')
  t.equal(state.nodes[0].left, 400, 'translates node left position by x offset')
  t.equal(state.nodes[0].top, 90, 'translates node top position by y offset')
  t.end()
})

test('Reducers: UPDATE_NODE_STATE action', t => {
  const state = reduceActions([
    actions.loadNodeList([dummyNodes.Number]),
    actions.clickCanvas(0, 0, 900),
    actions.addNode()(dummyNodes.Number.uid),
    actions.updateNodeState(1, { value: 42 })
  ])
  t.deepEqual(state.nodes[0].state, {
    value: 42
  }, 'updates state for the given node')
  t.end()
})
