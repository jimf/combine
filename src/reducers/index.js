const actions = require('../actions')
const { clamp } = require('../util')
const { AppState, SEARCH_WIDTH } = require('../constants')

const initialState = () => ({
  /**
   * Main app state.
   */
  app: {
    state: AppState.Ready
  },

  /**
   * Node specs that are registered with the app.
   */
  availableNodes: {
    /**
     * List of spec uids.
     */
    uids: [],

    /**
     * Hash of node specs, indexed by uid.
     */
    index: {}
  },

  /**
   * Graph of input/output connections.
   *
   * NOTE: Outputs connect to inputs.
   */
  connections: {},

  /**
   * Connection x/y coordinates.
   */
  connectionPositions: {},

  /**
   * List of nodes that have been created.
   */
  nodes: []
})

module.exports = (state = initialState(), action) => {
  switch (action.type) {
    case actions.ADD_NODE: {
      const spec = state.availableNodes.index[action.payload.uid]
      return {
        ...state,
        app: {
          state: AppState.Ready
        },
        connections: {
          ...state.connections,
          ...Object.keys(spec.inputs).reduce(
            (acc, key) => ({
              ...acc,
              // Inputs implicitly connect to their own node's respective outputs.
              [`${action.payload.cid}-input-${key}`]: Object.keys(spec.outputs).reduce(
                (acc2, key2) => [...acc2, `${action.payload.cid}-output-${key2}`],
                []
              )
            }),
            {}
          ),
          ...Object.keys(spec.outputs).reduce(
            (acc, key) => ({
              ...acc,
              [`${action.payload.cid}-output-${key}`]: []
            }),
            {}
          )
        },
        nodes: [
          ...state.nodes,
          {
            ...action.payload,
            left: state.app.left,
            top: state.app.top,
            state: spec.state
          }
        ]
      }
    }

    case actions.CLICK_CANVAS:
      /**
       * What happens when the canvas is clicked depends on the state of the
       * application.
       */
      switch (state.app.state) {
        // Ready -> Searching
        case AppState.Ready:
          return {
            ...state,
            app: {
              state: AppState.Searching,
              left: clamp(
                0,
                action.payload.viewportWidth - SEARCH_WIDTH,
                action.payload.x - (SEARCH_WIDTH / 2)
              ),
              searchValue: '',
              top: Math.max(0, action.payload.y - 10),
              width: SEARCH_WIDTH
            }
          }

        // Searching -> Ready
        case AppState.Searching:
          return {
            ...state,
            app: {
              state: AppState.Ready
            }
          }

        // Connecting -> Ready
        case AppState.Connecting:
          return {
            ...state,
            app: {
              state: AppState.Ready
            }
          }

        // Unexpected. All app states should be handled.
        default:
          return state
      }

    case actions.CLICK_CONNECTION: {
      switch (state.app.state) {
        // Ready -> Connecting
        case AppState.Ready:
          return {
            ...state,
            app: {
              ...action.payload,
              state: AppState.Connecting
            }
          }

        // Searching -> Ready
        case AppState.Searching:
          return {
            ...state,
            app: {
              state: AppState.Ready
            }
          }

        // Connecting -> Ready
        case AppState.Connecting: {
          const from = state.app.connectionType === 'input'
            ? action.payload : state.app
          const to = state.app.connectionType === 'input'
            ? state.app : action.payload
          const key = `${from.cid}-${from.connectionType}-${from.name}`

          return {
            ...state,
            app: {
              state: AppState.Ready
            },
            connections: {
              ...state.connections,
              [key]: [
                ...state.connections[key],
                `${to.cid}-${to.connectionType}-${to.name}`
              ]
            }
          }
        }

        default:
          return state
      }
    }

    case actions.LOAD_NODE_LIST: {
      const [uids, index] = action.payload.reduce(
        (acc, node) => [
          [...acc[0], node.uid],
          {
            ...acc[1],
            [node.uid]: node
          }
        ],
        [[], {}]
      )

      return {
        ...state,
        availableNodes: {
          uids,
          index
        }
      }
    }

    case actions.REMOVE_NODE:
      return {
        ...state,
        app: {
          state: AppState.Ready
        },
        connections: Object.keys(state.connections)
          .filter(inputConn => !inputConn.startsWith(`${action.payload}-`))
          .reduce(
            (acc, inputConn) => ({
              ...acc,
              [inputConn]: state.connections[inputConn].filter(outputConn =>
                !outputConn.startsWith(`${action.payload}-`)
              )
            }),
            {}
          ),
        connectionPositions: Object.keys(state.connectionPositions)
          .filter(conn => !conn.startsWith(`${action.payload}-`))
          .reduce((acc, conn) => ({
            ...acc,
            [conn]: state.connectionPositions[conn]
          }), {}),
        nodes: state.nodes.filter(node => node.cid !== action.payload)
      }

    case actions.TRANSLATE_NODE:
      return {
        ...state,
        app: {
          state: AppState.Ready
        },
        connectionPositions: {
          ...state.connectionPositions,
          ...Object.keys(state.connectionPositions).reduce(
            (acc, key) =>
              key.startsWith(`${action.payload.cid}-`)
                ? {
                  ...acc,
                  [key]: {
                    x: state.connectionPositions[key].x + action.payload.offsetX,
                    y: state.connectionPositions[key].y + action.payload.offsetY
                  }
                }
                : acc,
            {}
          )
        },
        nodes: state.nodes.reduce(
          (acc, node) => [
            ...acc,
            node.cid === action.payload.cid
              ? { ...node, left: node.left + action.payload.offsetX, top: node.top + action.payload.offsetY }
              : node
          ],
          []
        )
      }

    case actions.UPDATE_CONNECTION_POSITION:
      return {
        ...state,
        connectionPositions: {
          ...state.connectionPositions,
          [`${action.payload.cid}-${action.payload.connectionType}-${action.payload.name}`]: {
            x: action.payload.x,
            y: action.payload.y
          }
        }
      }

    case actions.UPDATE_NODE_STATE:
      return {
        ...state,
        nodes: state.nodes.reduce(
          (acc, node) => [
            ...acc,
            node.cid === action.payload.cid
              ? { ...node, state: action.payload.state }
              : node
          ],
          []
        )
      }

    default:
      return state
  }
}
