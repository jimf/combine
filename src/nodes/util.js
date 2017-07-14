exports.path = (path, obj) =>
  path.reduce((acc, key) => {
    if (acc === null || acc === undefined) { return acc }
    return acc[key]
  }, obj)
