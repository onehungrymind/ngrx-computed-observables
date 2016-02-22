import {Injectable} from 'angular2/core';
import {Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

export interface AppStore {
  context: Context;
}

export interface Context {
  sessions: Object[];
}

export interface Session {
  type: String;
  entity: String;
  capabilities: String[];
}

export const mockContext: Context = {
  'sessions': [
    {
      'type': 'Product',
      'entity': 'MSFT',
      'capabilities': [
        'analytics',
        'recent-news'
        ]
      },
    {
      'type': 'Product',
      'entity': 'AAPL',
      'capabilities': [
        'analytics',
        'recent-news'
        ]
      }
    ]
  };

// NOTE: Putting on the shelf for now
//export const contextMap = new Map();
//let actionMethod = contextMap.get(action.type);
//return actionMethod ? actionMethod(state, action) : state;

export const context: Reducer<Context> = (state: Context, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
