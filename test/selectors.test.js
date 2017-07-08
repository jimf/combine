const test = require('tape')
const subject = require('../src/selectors')
const actions = require('../src/actions')
const { dummyNodes, reduceActions } = require('./util')

test('Selectors: connectingNodeSpecSelector', t => {
  const addNode = actions.addNode()

  const ready = reduceActions([
    actions.loadNodeList([dummyNodes.True])
  ])
  t.equal(subject.connectingNodeSpecSelector(ready), undefined,
    'returns undefined when app is in ready state')

  const searching = reduceActions([
    actions.clickCanvas(0, 0, 900)
  ], ready)
  t.equal(subject.connectingNodeSpecSelector(searching), undefined,
    'returns undefined when app is in searching state')

  const connecting = reduceActions([
    addNode(dummyNodes.True.uid),
    actions.clickConnection(1, 'output', 'value')
  ], searching)
  t.equal(subject.connectingNodeSpecSelector(connecting), searching.availableNodes.index[dummyNodes.True.uid],
    'returns node spec corresponding with connecting node')

  t.end()
})

test('Selectors: validConnectionsSelector', t => {
  const addNode = actions.addNode()

  const ready = reduceActions([
    actions.loadNodeList([
      dummyNodes.True,
      dummyNodes.Number,
      dummyNodes.Add,
      dummyNodes.Tap
    ])
  ])
  t.deepEqual(subject.validConnectionsSelector(ready), [],
    'returns empty list when app is in ready state')

  const searching = reduceActions([
    actions.clickCanvas(0, 0, 900)
  ], ready)
  t.deepEqual(subject.validConnectionsSelector(searching), [],
    'returns empty list when app is in searching state')

  const connectingSingle = reduceActions([
    addNode(dummyNodes.True.uid),
    actions.clickConnection(1, 'output', 'value')
  ], searching)
  t.deepEqual(subject.validConnectionsSelector(connectingSingle), [],
    'returns empty list when a single node is present')

  const connectingNoValid = reduceActions([
    addNode(dummyNodes.True.uid),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.True.uid),
    actions.clickConnection(2, 'output', 'value')
  ], searching)
  t.deepEqual(subject.validConnectionsSelector(connectingNoValid), [],
    'returns empty list when no valid connections are available')

  const connectingOutputInputValid = reduceActions([
    addNode(dummyNodes.Number.uid),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.Number.uid),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.Add.uid),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.Tap.uid),
    actions.clickConnection(4, 'output', 'value')
  ], searching)
  t.deepEqual(subject.validConnectionsSelector(connectingOutputInputValid), [
    `${connectingOutputInputValid.nodes[2].cid}-operand1`,
    `${connectingOutputInputValid.nodes[2].cid}-operand2`,
    `${connectingOutputInputValid.nodes[3].cid}-value`
  ], 'returns list of valid output-to-input connections when available')

  // TODO finish writing this
  // const connectingValid = reduceActions([
  //   addNode(dummyNodes.Number.uid),
  //   actions.clickCanvas(0, 0, 900),
  //   addNode(dummyNodes.Number.uid),
  //   actions.clickCanvas(0, 0, 900),
  //   addNode(dummyNodes.Add.uid),
  //   actions.clickCanvas(0, 0, 900),
  //   addNode(dummyNodes.Tap.uid),
  //   actions.clickConnection(4, 'output', 'value')
  // ], searching)
  // t.deepEqual(subject.validConnectionsSelector(connectingValid), [
  //   `${connectingValid.nodes[2].cid}-operand1`,
  //   `${connectingValid.nodes[2].cid}-operand2`,
  //   `${connectingValid.nodes[3].cid}-value`
  // ], 'returns list of valid output-to-input connections when available')

  t.end()
})

test('Selectors: calculateInputsSelector', t => {
  const addNode = actions.addNode()

  const state1 = reduceActions([
    actions.loadNodeList([
      dummyNodes.Number,
      dummyNodes.Add,
      dummyNodes.Tap
    ]),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.Number.uid),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.Number.uid),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.Add.uid),
    actions.clickCanvas(0, 0, 900),
    addNode(dummyNodes.Tap.uid)
  ])
  t.deepEqual(subject.calculateInputsSelector(state1), {
    1: {},
    2: {},
    3: {},
    4: {}
  }, 'returns undefined inputs when no connections have been made')

  const state2 = reduceActions([
    actions.clickConnection(1, 'output', 'value'),
    actions.clickConnection(3, 'input', 'operand1'),
    actions.clickConnection(2, 'output', 'value'),
    actions.clickConnection(3, 'input', 'operand2'),
    actions.clickConnection(3, 'output', 'result'),
    actions.clickConnection(4, 'input', 'value')
  ], state1)
  t.deepEqual(subject.calculateInputsSelector(state2), {
    1: {},
    2: {},
    3: { operand1: 0, operand2: 0 },
    4: { value: 0 }
  }, 'returns inputs when connections have been made')

  t.end()
})
