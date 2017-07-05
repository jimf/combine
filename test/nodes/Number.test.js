const test = require('tape')
const subject = require('../../src/nodes/Number')

test('Nodes Number implementation', t => {
  t.equal(subject.implementation(subject.state, subject.inputs), subject.state.value,
    'returns current value state'
  )
  t.end()
})
