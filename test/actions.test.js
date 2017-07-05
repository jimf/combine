const test = require('tape')
const subject = require('../src/actions')

test('Actions: ADD_NODE', t => {
  t.equal(subject.ADD_NODE, 'ADD_NODE', 'type defined')
  const addNode = subject.addNode()
  t.deepEqual(addNode('dummyUid'), {
    type: subject.ADD_NODE,
    payload: {
      uid: 'dummyUid',
      cid: 1
    }
  }, 'action creator defined')
  t.deepEqual(addNode('dummyUid'), {
    type: subject.ADD_NODE,
    payload: {
      uid: 'dummyUid',
      cid: 2
    }
  }, 'subsequent action creator calls inc cid')
  t.end()
})

test('Actions: CLICK_CANVAS', t => {
  t.equal(subject.CLICK_CANVAS, 'CLICK_CANVAS', 'type defined')
  t.deepEqual(subject.clickCanvas(0, 1, 2), {
    type: subject.CLICK_CANVAS,
    payload: {
      x: 0,
      y: 1,
      viewportWidth: 2
    }
  }, 'action creator defined')
  t.end()
})

test('Actions: CLICK_CONNECTION', t => {
  t.equal(subject.CLICK_CONNECTION, 'CLICK_CONNECTION', 'type defined')
  t.deepEqual(subject.clickConnection('dummyCid', 'input', 'value'), {
    type: subject.CLICK_CONNECTION,
    payload: {
      cid: 'dummyCid',
      connectionType: 'input',
      name: 'value'
    }
  }, 'action creator defined')
  t.end()
})

test('Actions: LOAD_NODE_LIST', t => {
  t.equal(subject.LOAD_NODE_LIST, 'LOAD_NODE_LIST', 'type defined')
  t.deepEqual(subject.loadNodeList([]), {
    type: subject.LOAD_NODE_LIST,
    payload: []
  }, 'action creator defined')
  t.end()
})

test('Actions: REMOVE_NODE', t => {
  t.equal(subject.REMOVE_NODE, 'REMOVE_NODE', 'type defined')
  t.deepEqual(subject.removeNode('dummyCid'), {
    type: subject.REMOVE_NODE,
    payload: 'dummyCid'
  }, 'action creator defined')
  t.end()
})

test('Actions: TRANSLATE_NODE', t => {
  t.equal(subject.TRANSLATE_NODE, 'TRANSLATE_NODE', 'type defined')
  t.deepEqual(subject.translateNode('dummyCid', 100, -100), {
    type: subject.TRANSLATE_NODE,
    payload: {
      cid: 'dummyCid',
      offsetX: 100,
      offsetY: -100
    }
  }, 'action creator defined')
  t.end()
})

test('Actions: UPDATE_NODE_STATE', t => {
  t.equal(subject.UPDATE_NODE_STATE, 'UPDATE_NODE_STATE', 'type defined')
  t.deepEqual(subject.updateNodeState('dummyCid', {}), {
    type: subject.UPDATE_NODE_STATE,
    payload: {
      cid: 'dummyCid',
      state: {}
    }
  }, 'action creator defined')
  t.end()
})
