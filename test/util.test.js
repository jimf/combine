const test = require('tape')
const deepEqual = require('deep-equal')
const subject = require('../src/util')

const id = x => x

test('Util: clamp', t => {
  t.equal(subject.clamp(0, 100, -1), 0,
    'clamps result to a minimum value')

  t.equal(subject.clamp(0, 100, 101), 100,
    'clamps result to a maximum value')

  t.equal(subject.clamp(0, 100, 50), 50,
    'returns value if within min/max range')

  t.end()
})

test('Util: findWhere', t => {
  const items = [{}, { dummy: false }, { dummy: true }, { dummy: true }]

  t.equal(subject.findWhere({ dummy: true }, []), undefined,
    'returns undefined when needle cannot be found'
  )

  t.equal(subject.findWhere({ dummy: true }, items), items[2],
    'returns first item with matching properties'
  )

  t.end()
})

test('Util: flatMap', t => {
  const abc = [['a'], ['b'], ['c']]
  t.deepEqual(subject.flatMap(id, abc), ['a', 'b', 'c'], 'flattens a list of lists')
  t.deepEqual(subject.flatMap(id, []), [], 'returns empty list given empty list')
  t.end()
})

test('Util: mapObject', t => {
  const abc = { a: 1, b: 2, c: 3 }
  const inc = x => x + 1
  const double = x => x * 2
  const compose = (f, g) => x => f(g(x))

  t.deepEqual(subject.mapObject(id, {}), {}, 'returns empty object given empty object')
  t.deepEqual(subject.mapObject(inc, abc), {
    a: 2,
    b: 3,
    c: 4
  }, 'maps function over values of given object and returns result')
  t.deepEqual(subject.mapObject(id, abc), abc, 'obeys identity law')
  t.deepEqual(
    subject.mapObject(compose(double, inc), abc),
    subject.mapObject(double, subject.mapObject(inc, abc)),
    'obeys composition law'
  )
  t.end()
})

test('Util: tsort', t => {
  const empty = {}
  const cycle = {
    a: ['b'],
    b: ['a']
  }

  //          ---> shower
  //        /
  // wake up
  //        \
  //          ---> brush teeth ---> eat breakfast
  const dag = {
    'wake up': ['shower', 'brush teeth'],
    'shower': [],
    'brush teeth': ['eat breakfast'],
    'eat breakfast': []
  }
  const wikipedia = {
    2: [],
    3: ['8', '10'],
    5: ['11'],
    7: ['8', '11'],
    8: ['9'],
    9: [],
    10: [],
    11: ['9', '10']
  }

  t.deepEqual(subject.tsort(empty), [], 'returns empty array when graph has 0 nodes')
  t.throws(subject.tsort.bind(null, cycle), 'throws when graph contains a cycle')

  const dagSorted = subject.tsort(dag)
  t.ok(
    [
      ['wake up', 'shower', 'brush teeth', 'eat breakfast'],
      ['wake up', 'brush teeth', 'shower', 'eat breakfast'],
      ['wake up', 'brush teeth', 'eat breakfast', 'shower']
    ].some(valid => deepEqual(dagSorted, valid)),
    'returns valid topological sort for DAG'
  )

  const wikiSorted = subject.tsort(wikipedia)
  t.ok(
    [
      [5, 7, 3, 11, 8, 2, 9, 10], // (visual left-to-right, top-to-bottom)
      [3, 5, 7, 8, 11, 2, 9, 10], // (smallest-numbered available vertex first)
      [5, 7, 3, 8, 11, 10, 9, 2], // (fewest edges first)
      [7, 5, 11, 3, 10, 8, 9, 2], // (largest-numbered available vertex first)
      [5, 7, 11, 2, 3, 8, 9, 10], // (attempting top-to-bottom, left-to-right)
      [3, 7, 8, 5, 11, 10, 2, 9]  // (arbitrary)
    ].some(valid => deepEqual(wikiSorted, valid)),
    'returns valid topological sort for wikipedia DAG'
  )

  t.end()
})
