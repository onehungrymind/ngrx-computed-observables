import {Injectable} from 'angular2/core';
import {Reducer, Action, Store} from '@ngrx/store';
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

export const mockSessions: Session[] = [
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
  }];

export const SUBSCRIBE_CAPABILITY = 'SUBSCRIBE_CAPABILITY';
export const DUPLICATE_CAPABILITY = 'DUPLICATE_CAPABILITY';
export const UPDATE_CAPABILITY = 'UPDATE_CAPABILITY';

export interface Action {
  label: String;
  activity: String;
}

// USERS STORE
export interface User {
  id: Number;
  name: String;
  role: String;
  sessions: Number[];
}

export const mockUsers: User[] = [
  {id: 1, name: 'John Smith - FA', role: 'FA', sessions: [1, 2]},
  {id: 2, name: 'Jane Doe - Assistant', role: 'FAA', sessions: [1]},
];

export const users: Reducer<Array<User>> = (state: any = [], action: Action  ) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const SELECT_USER = 'SELECT_USER';

export const selectedUser: Reducer<User> = (state: any = null, action: Action  ) => {
  switch (action.type) {
    case SELECT_USER:
      return action.payload;
    default:
      return state;
  }
};


// CAPABILITIES ACTION MAP
export const ActionsMap = new Map();
ActionsMap.set('analytics', [{label: 'Duplicate', activity: DUPLICATE_CAPABILITY}]);
ActionsMap.set('recent-news', [{label: 'Update', activity: UPDATE_CAPABILITY}, {label: 'Subscribe', activity: SUBSCRIBE_CAPABILITY}]);

// REDUCER ACTIONS
export const contextActionMap = new Map();
contextActionMap.set(SUBSCRIBE_CAPABILITY, (state: any = [], action: Action) => {
  console.log('Capability subscribed!');
  return state;
});

contextActionMap.set(DUPLICATE_CAPABILITY, (state: any = [], action: Action) => {
  let currentSession: Session;
  state.forEach(session => {
    session.capabilities.forEach(capability => { if (capability.id === action.payload.id) currentSession = session; });
  });

  console.log('Capability duplicated!');
  return state.map(session => {
    return currentSession.id === session.id ? Object.assign({},
      session, {capabilities: session.capabilities.concat(Object.assign({}, action.payload))})
      : session;
  });
});

contextActionMap.set(UPDATE_CAPABILITY, (state: any = [], action: Action) => {
  console.log('Capability updated!');
  return state;
});

// REDUCER
export const sessions: Reducer<Array<Session>> = (state: any = [], action: Action) => {
  let actionMethod = contextActionMap.get(action.type);
  return actionMethod ? actionMethod(state, action) : state;
};

@Injectable()
export class ContextService {
  context: Observable<Context>;
  sessions: Observable<Array<Session>>;
  selectedUser: Observable<User>;

  constructor(private store: Store<AppStore>) {
    this.context = Observable.combineLatest(
        store.select('sessions'),
        store.select('selectedUser'),
        (sessions: Session[], selectedUser: User) => {
          return {
            sessions: sessions.filter(session => selectedUser.sessions.indexOf(session.id) > -1)
          };
        });

    this.context
      .subscribe(c => console.log('ContextService.context', c));
  }
};
