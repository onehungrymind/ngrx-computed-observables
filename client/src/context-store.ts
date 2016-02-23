import {Injectable} from 'angular2/core';
import {Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

export interface AppStore {
  context: Context;
}

export interface Context {
  sessions: Session[];
}

export interface Capability {
  id: Number;
  entity: String;
  title: String;
}

export interface Session {
  id: Number;
  type: String;
  entity: String;
  capabilities: Capability[];
}

export const mockContext: Context = {
  'sessions': [
    {
      id: 1,
      type: 'Product',
      entity: 'MSFT',
      capabilities: [
        { id: 10, entity: 'recent-news', title: 'Recent News'},
        { id: 20, entity: 'analytics', title: 'Analytics'}
      ]
    },
    {
      id: 2,
      type: 'Product',
      entity: 'AAPL',
      capabilities: [
        { id: 30, entity: 'analytics', title: 'Analytics'},
        { id: 40, entity: 'recent-news', title: 'Recent News'}
      ]
    }]
  };

export const SUBSCRIBE_CAPABILITY = 'SUBSCRIBE_CAPABILITY';
export const DUPLICATE_CAPABILITY = 'DUPLICATE_CAPABILITY';
export const UPDATE_CAPABILITY = 'UPDATE_CAPABILITY';

export interface Action {
  label: String;
  activity: String;
}

// CAPABILITIES ACTION MAP
export const ActionsMap = new Map();
ActionsMap.set('analytics', [{label: 'Duplicate', activity: DUPLICATE_CAPABILITY}]);
ActionsMap.set('recent-news', [{label: 'Update', activity: UPDATE_CAPABILITY}, {label: 'Subscribe', activity: SUBSCRIBE_CAPABILITY}]);

// REDUCER ACTIONS
export const contextActionMap = new Map();
contextActionMap.set(SUBSCRIBE_CAPABILITY, (state: Context, action: Action) => {
  console.log('Capability subscribed!');
  return state;
});

contextActionMap.set(DUPLICATE_CAPABILITY, (state: Context, action: Action) => {
  // HACK ALERT START!
  // FIND OUT WHAT SESSION THIS PRODUCT BELONGS TO
  let currentSession: Session;
  state.sessions.forEach(session => {
    session.capabilities.forEach(capability => { if (capability.id === action.payload.id) currentSession = session; });
  });

  currentSession.capabilities = currentSession.capabilities.concat(Object.assign({}, action.payload));
  // HACK ALERT END!
  console.log('Capability duplicated!');
  return state;
});

contextActionMap.set(UPDATE_CAPABILITY, (state: Context, action: Action) => {
  console.log('Capability updated!');
  return state;
});

// REDUCER
export const context: Reducer<Context> = (state: Context, action: Action  ) => {
  let actionMethod = contextActionMap.get(action.type);
  return actionMethod ? actionMethod(state, action) : state;
};
