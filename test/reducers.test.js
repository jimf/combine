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
    connectionPositions: {},
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

test('Reducers: DRAG_CANVAS action', t => {
  const state = reduceActions([
    actions.dragCanvas(10, 20)
  ])
  t.deepEqual(state.app, {
    state: AppState.Dragging,
    offsetX: 10,
    offsetY: 20
  }, 'enters app dragging state')
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
    actions.loadNodeList([dummyNodes.Number, dummyNodes.Add]),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.Number.uid),
    actions.updateConnectionPosition(1, 'output', 'value', 0, 0),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.Number.uid),
    actions.updateConnectionPosition(2, 'output', 'value', 0, 0),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.Add.uid),
    actions.updateConnectionPosition(3, 'input', 'operand1', 0, 0),
    actions.updateConnectionPosition(3, 'input', 'operand2', 0, 0),
    actions.updateConnectionPosition(3, 'output', 'result', 0, 0),
    actions.clickConnection(1, 'output', 'value'),
    actions.clickConnection(3, 'input', 'operand1'),
    actions.clickConnection(2, 'output', 'value'),
    actions.clickConnection(3, 'input', 'operand2'),
    actions.removeNode(1)
  ])
  t.equal(state.app.state, AppState.Ready, 'puts app in ready state')
  t.equal(state.nodes.length, 2, 'removes a node from the node list')
  t.ok(state.nodes.every(node => node.cid !== 1), 'removes the node with the given cid')
  t.deepEqual(state.connections, {
    '2-output-value': ['3-input-operand2'],
    '3-input-operand1': ['3-output-result'],
    '3-input-operand2': ['3-output-result'],
    '3-output-result': []
  }, 'removes node connections')
  t.deepEqual(state.connectionPositions, {
    '2-output-value': { x: 0, y: 0 },
    '3-input-operand1': { x: 0, y: 0 },
    '3-input-operand2': { x: 0, y: 0 },
    '3-output-result': { x: 0, y: 0 }
  }, 'removes node connection positions')
  t.end()
})

test('Reducers: TRANSLATE_ALL_NODES action', t => {
  const addNode = actions.addNode()
  const initialState = reduceActions([
    actions.loadNodeList([dummyNodes.Number]),
    actions.clickCanvas(200, 200, 900),
    addNode(dummyNodes.Number.uid),
    actions.updateConnectionPosition(1, 'output', 'value', 250, 250),
    actions.clickCanvas(400, 400, 900),
    addNode(dummyNodes.Number.uid),
    actions.updateConnectionPosition(2, 'output', 'value', 450, 450),
    actions.dragCanvas(0, 0)
  ])
  const state = reduceActions([
    actions.translateAllNodes(100, 200)
  ], initialState)
  t.deepEqual(state.app, { state: AppState.Ready }, 'enters ready state')
  t.deepEqual(state.nodes, [
    {
      ...initialState.nodes[0],
      left: initialState.nodes[0].left + 100,
      top: initialState.nodes[0].top + 200
    },
    {
      ...initialState.nodes[1],
      left: initialState.nodes[1].left + 100,
      top: initialState.nodes[1].top + 200
    }
  ], 'translates position of all nodes')
  t.deepEqual(state.connectionPositions, {
    '1-output-value': {
      x: initialState.connectionPositions['1-output-value'].x + 100,
      y: initialState.connectionPositions['1-output-value'].y + 200
    },
    '2-output-value': {
      x: initialState.connectionPositions['2-output-value'].x + 100,
      y: initialState.connectionPositions['2-output-value'].y + 200
    }
  }, 'translates connection positions of all nodes')
  t.end()
})

test('Reducers: TRANSLATE_NODE action', t => {
  const addNode = actions.addNode()
  const state = reduceActions([
    actions.loadNodeList([dummyNodes.Number, dummyNodes.Add]),
    actions.clickCanvas(400, 200, 900),
    addNode(dummyNodes.Number.uid),
    actions.translateNode(1, 200, -100)
  ])
  t.equal(state.app.state, AppState.Ready, 'puts app in ready state')
  t.equal(state.nodes[0].left, 400, 'translates node left position by x offset')
  t.equal(state.nodes[0].top, 90, 'translates node top position by y offset')

  const state2 = reduceActions([
    actions.clickCanvas(400, 200, 900),
    actions.updateConnectionPosition(1, 'output', 'value', 0, 0),
    addNode(dummyNodes.Add.uid),
    actions.updateConnectionPosition(2, 'input', 'operand1', 200, 200),
    actions.clickConnection(1, 'output', 'value'),
    actions.clickConnection(2, 'input', 'operand1'),
    actions.translateNode(1, 50, 50)
  ], state)
  t.deepEqual(state2.connectionPositions, {
    '1-output-value': { x: 50, y: 50 },
    '2-input-operand1': { x: 200, y: 200 }
  }, 'translates connection position(s) of respective node')

  t.end()
})

test('Reducers: UPDATE_CONNECTION_POSITION', t => {
  const state = reduceActions([
    actions.loadNodeList([dummyNodes.Number]),
    actions.clickCanvas(0, 0, 900),
    actions.addNode()(dummyNodes.Number.uid),
    actions.updateConnectionPosition(1, 'output', 'value', 42, 84)
  ])
  t.deepEqual(state.connectionPositions, {
    '1-output-value': { x: 42, y: 84 }
  }, 'updates position for the given connection')
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
