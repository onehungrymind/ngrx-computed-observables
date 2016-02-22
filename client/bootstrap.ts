//main entry point
import {bootstrap} from 'angular2/platform/browser';
import {App} from './src/app';
import {context, mockContext} from './src/context-store';
import {provideStore} from '@ngrx/store';
import {HTTP_PROVIDERS} from 'angular2/http';

bootstrap(App, [
  HTTP_PROVIDERS,
  provideStore({context}, {context: mockContext})
])
.catch(err => console.error(err));
