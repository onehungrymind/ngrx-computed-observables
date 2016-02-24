//main entry point
import {bootstrap} from 'angular2/platform/browser';
import {App} from './src/app';
import {sessions, users, selectedUser, mockUsers, mockSessions, ContextService} from './src/context-store';
import {provideStore} from '@ngrx/store';
import {HTTP_PROVIDERS} from 'angular2/http';

bootstrap(App, [
  HTTP_PROVIDERS,
  ContextService,
  provideStore({sessions, users, selectedUser}, {sessions: mockSessions, users: mockUsers, selectedUser: {sessions: []}})
])
.catch(err => console.error(err));
