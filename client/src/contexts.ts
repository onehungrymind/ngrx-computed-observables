import {Injectable} from 'angular2/core';
import {Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

export interface Context {
  name: String;
}

let appModel: Object = {
  "sessions": [
    {
      "type": "Product",
      "entity": "MSFT",
      "capabilities": [
        "analytics",
        "recent-news"
      ]
    },
    {
      "type": "Product",
      "entity": "AAPL",
      "capabilities": [
        "analytics",
        "recent-news"
      ]
    }
  ]
};

//-------------------------------------------------------------------
// IDEA: Keep a normalized map of ALL the contexts
// and a second map that defines the relationships
//-------------------------------------------------------------------

export const contextsMap = new Map();

contextsMap.set(0, {name: 'Platform'});
contextsMap.set(10, {name: 'AAPL'});
contextsMap.set(20, {name: 'MSFT'});
contextsMap.set(100, {name: 'AAPL Analytics'});
contextsMap.set(200, {name: 'AAPL Recent News'});
contextsMap.set(300, {name: 'MSFT Analytics'});
contextsMap.set(400, {name: 'MSFT Recent News'});

export const contextChildrenMap = new Map();

contextChildrenMap.set(0, [10, 20]);
contextChildrenMap.set(10, [100, 200]);
contextChildrenMap.set(20, [300, 400]);
contextChildrenMap.set(100, []);
contextChildrenMap.set(200, []);
contextChildrenMap.set(300, []);
contextChildrenMap.set(400, []);


//-------------------------------------------------------------------
// IDEA: Create a map of methods that we can use to handle actions
//-------------------------------------------------------------------
export const GET_CONTEXTS = 'GET_CONTEXTS';
export const ADD_CONTEXT = 'ADD_CONTEXT';
export const REMOVE_CONTEXT = 'REMOVE_CONTEXT';

// REDUX STYLE
export const actionMap = new Map();

actionMap.set(GET_CONTEXTS, (state, action) => {
  return state.contexts;
});

actionMap.set(ADD_CONTEXT, (state, action) => {
  return {
    contexts: [...state.contexts, action.payload]
  };
});

actionMap.set(REMOVE_CONTEXT, (state, action) => {
  let contexts = state.contexts.filter(context => context.id !== action.payload.id);

  return {
    contexts
  };
});

export const contextsStore: Reducer<Context> = (state: Context, action: Action) => {
  let actionMethod = actionMap.get(action.type);
  return actionMethod ? actionMethod(state, action) : state;
};

// NOT REDUX STYLE

// @RjAction({ appliesTo: 'Context' })
export function getContexts(contexts) {
  return contexts;
}

// @RjAction({ appliesTo: 'Context' })
export function addContext(contexts, context) {
  return [...contexts, context];
}

// @RjAction({ appliesTo: 'Context' })
export function removeContext(contexts, context) {
  return contexts.filter(c => c.id !== context.id);
}

// BOTH COULD USE THIS
export const availableActionMap = new Map();

availableActionMap.set('Contexts', [GET_CONTEXTS, ADD_CONTEXT, REMOVE_CONTEXT]);


//@Injectable()
//export class ContextsService {
//  contexts:any;
//
//  constructor() {
//    this.contexts = {
//      schema: {
//        title: 'MainContext',
//        type: 'object',
//        properties: {
//          'schema': {
//            type: 'string'
//          },
//          'items': {
//            type: 'array'
//          },
//          'entities': {
//            type: 'object'
//          }
//        }
//      },
//      items: [1, 2],
//      entities: {
//        1: {
//          schema: {
//            title: 'SessionContext',
//            type: 'object',
//            properties: {
//              'name': {
//                type: 'string'
//              },
//              'schema': {
//                type: 'string'
//              },
//              'items': {
//                type: 'array'
//              },
//              'entities': {
//                type: 'object'
//              }
//            }
//          },
//          items: [10, 20],
//          entities: {
//            10: {
//              name: 'First Session',
//              schema: {
//                title: 'Entity',
//                type: 'object',
//                properties: {
//                  'name': {
//                    type: 'string'
//                  }
//                }
//              },
//              items: [100],
//              entities: {
//                100: {name: 'First Product'}
//              }
//            },
//            20: {
//              name: 'Second Session',
//              schema: {
//                title: 'Entity',
//                type: 'object',
//                properties: {
//                  'name': {
//                    type: 'string'
//                  }
//                }
//              },
//              items: [200],
//              entities: {
//                200: {name: 'Second Product'}
//              }
//            }
//          }
//        },
//        2: {
//          schema: {
//            title: 'SessionContext',
//            type: 'object',
//            properties: {
//              'name': {
//                type: 'string'
//              },
//              'schema': {
//                type: 'string'
//              },
//              'items': {
//                type: 'array'
//              },
//              'entities': {
//                type: 'object'
//              }
//            }
//          },
//          items: [30, 40],
//          entities: {
//            30: {
//              name: 'Third Session',
//              schema: {
//                title: 'Entity',
//                type: 'object',
//                properties: {
//                  'name': {
//                    type: 'string'
//                  }
//                }
//              },
//              items: [300],
//              entities: {
//                300: {name: 'Third Product'}
//              }
//            },
//            40: {
//              name: 'Fourth Session',
//              schema: {
//                title: 'Entity',
//                type: 'object',
//                properties: {
//                  'name': {
//                    type: 'string'
//                  }
//                }
//              },
//              items: [400],
//              entities: {
//                400: {name: 'Fourth Product'}
//              }
//            }
//          }
//        }
//
//      }
//    };
//  }
//}
