/**
 * Clamp value between a given min and max.
 *
 * @param {number} min Min value
 * @param {number} max Max value
 * @param {number} value Given value
 * @return {number}
 */
exports.clamp = (min, max, value) =>
  Math.min(Math.max(min, value), max)

// exports.find = (f, xs) => {
//   for (let i = 0; i < xs.length; i += 1) {
//     if (f(xs[i])) { return xs[i] }
//   }
// }

exports.findWhere = (props, xs) => {
  for (let i = 0; i < xs.length; i += 1) {
    if (Object.keys(props).every(p => xs[i] && xs[i][p] === props[p])) {
      return xs[i]
    }
  }
}

exports.flatMap = (f, xs) =>
  Array.prototype.concat.apply([], xs.map(f))

/**
 * Map a function over the values of an object.
 *
 * @param {function} f Map function
 * @param {object} obj Object to map over
 * @return {object}
 */
exports.mapObject = (f, obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({ ...acc, [key]: f(obj[key]) }),
    {}
  )

/**
 * Topologically sort a given graph. Algorithm based on DFS. Graph MUST be a
 * directed acyclic graph (DAG).
 *
 * Note about relationships: in this algorithm, the assumption is that for
 * an edge going from vertices X to Y, X must be done BEFORE Y. In other words,
 * Y depends on X.
 *
 * https://en.wikipedia.org/wiki/Topological_sorting#Depth-first_search
 *
 * @param {object} graph DAG to sort
 * @return {string[]}
 */
exports.tsort = (graph) => {
  const result = []
  const visited = {}
  const visitedTemp = {}

  const visit = (node) => {
    if (visitedTemp[node]) {
      throw new Error('Cycle detected in graph')
    }

    if (!visited[node]) {
      visitedTemp[node] = true
      graph[node].forEach(visit)
      visited[node] = true
      delete visitedTemp[node]
      result.unshift(node)
    }
  }

  Object.keys(graph).forEach(node => {
    if (!visited[node] && !visitedTemp[node]) {
      visit(node)
    }
  })

  return result
}
