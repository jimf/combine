/**
 * Add a node to the node canvas of the given uid. First call returns a
 * function that will manage the monotonically increasing cid for
 * subsequent calls.
 *
 * @summary () -> Uid -> Action
 */
exports.ADD_NODE = 'ADD_NODE'
exports.addNode = () => {
  let cid = 0
  return (uid) => {
    cid += 1
    return {
      type: exports.ADD_NODE,
      payload: { uid, cid }
    }
  }
}

/**
 * Action dispatched when clicking the editing canvas. Concrete intent cannot
 * be encoded here, as the action performed depends on the current state of
 * the application. However, this should toggle search on/off, or cancel a
 * connect operation.
 *
 * @summary (X -> Y -> WindowWidth) -> Action
 */
exports.CLICK_CANVAS = 'CLICK_CANVAS'
exports.clickCanvas = (x, y, viewportWidth) => ({
  type: exports.CLICK_CANVAS,
  payload: { x, y, viewportWidth }
})

/**
 * Click a connection. Performing this action can do one of several
 * things, depending on the current app state.
 *
 * @summary (Cid -> ConnectionType -> InputName) -> Action
 */
exports.CLICK_CONNECTION = 'CLICK_CONNECTION'
exports.clickConnection = (cid, connectionType, name) => ({
  type: exports.CLICK_CONNECTION,
  payload: { cid, connectionType, name }
})

/**
 * Register a list of node specs with the application.
 *
 * @summary Array NodeSpec -> Action
 */
exports.LOAD_NODE_LIST = 'LOAD_NODE_LIST'
exports.loadNodeList = payload => ({
  type: exports.LOAD_NODE_LIST,
  payload
})

/**
 * Remove a node of the given cid from the node canvas.
 *
 * @summary Cid -> Action
 */
exports.REMOVE_NODE = 'REMOVE_NODE'
exports.removeNode = payload => ({
  type: exports.REMOVE_NODE,
  payload
})

/**
 * Translate current x/y position of a node instance by given x/y offsets.
 *
 * @summary (Cid -> OffsetX, OffsetY) -> Action
 */
exports.TRANSLATE_NODE = 'TRANSLATE_NODE'
exports.translateNode = (cid, offsetX, offsetY) => ({
  type: exports.TRANSLATE_NODE,
  payload: { cid, offsetX, offsetY }
})

/**
 * Update the known position of a connection.
 *
 * @summary (Cid -> ConnType -> Name -> Int -> Int) -> Action
 */
exports.UPDATE_CONNECTION_POSITION = 'UPDATE_CONNECTION_POSITION'
exports.updateConnectionPosition = (cid, connectionType, name, x, y) => ({
  type: exports.UPDATE_CONNECTION_POSITION,
  payload: {
    cid,
    connectionType,
    name,
    x,
    y
  }
})

/**
 * Update the state property (not React or Redux state) for the given node
 * instance.
 *
 * @summary (Cid -> State) -> Action
 */
exports.UPDATE_NODE_STATE = 'UPDATE_NODE_STATE'
exports.updateNodeState = (cid, state) => ({
  type: exports.UPDATE_NODE_STATE,
  payload: { cid, state }
})
