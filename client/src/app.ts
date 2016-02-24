import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {Context, ContextService, User, Session, Capability, AppStore, Action, ActionsMap, SELECT_USER} from './context-store';

//-------------------------------------------------------------------
//  MASTER TODO LIST
//-------------------------------------------------------------------

// MAIN GOAL To simplify the semantics around platform so that they can be illustrated
// in a simple proof of concept

// Clearly show how user and session context is consumed at a component level if at all
// Clearly show event flow from component to session
// Clearly show how changing user context will affect state down to the component level

//-------------------------------------------------------------------
// ENTITY CONTEXT
//-------------------------------------------------------------------
@Component({
  selector: 'rj-capability',
  template: `
  <div class="mdl-card__title mdl-card--expand">
    <h2 class="mdl-card__title-text">{{capability.title}}</h2>
  </div>
  <div class="mdl-card__supporting-text">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Aenan convallis.
  </div>
  <div class="mdl-card__actions mdl-card--border">
    <a *ngFor="#action of actions" (click)="handle.emit({'action':action.activity, 'capability':capability}); $event.stopPropagation();"
      class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
      {{action.label}}
    </a>
  </div>
  `
})
export class RJCapability implements OnInit {
  @Input() capability: Capability;
  @Output() handle = new EventEmitter();

  actions: any;

  ngOnInit() {
    this.actions = ActionsMap.get(this.capability.entity);
  }
}

//-------------------------------------------------------------------
// SESSION CONTEXT
//-------------------------------------------------------------------
@Component({
  selector: 'rj-tab',
  directives: [RJCapability],
  template: `
    <div class="mdl-card__supporting-text">
        <div class="mdl-cell mdl-cell--12-col">
          <h4>Tab({{session.entity}})</h4>
        </div>
        <rj-capability *ngFor="#capability of session.capabilities"
        [capability]="capability" (handle)="handleAction($event)"
        duplicate
        [class]="mdlClasses"></rj-capability>
    </div>
    `
})
export class RJTab {
  mdlClasses: String = 'mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col';
  @Input() session: Session;

  constructor(private store: Store<AppStore>) { }

  handleAction(event: any) {
    this.store.dispatch({type: event.action, payload: event.capability});
  }
}

//-------------------------------------------------------------------
// ACTIONS
//-------------------------------------------------------------------
@Component({
  selector: 'rj-drop-down',
  template: `
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select">
      <input class="mdl-textfield__input" [value]="selectedUser?.name | async" type="text" id="client" readonly tabIndex="-1" />
      <label class="mdl-textfield__label" for="client">Client</label>
      <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu" for="client">
        <li *ngFor="#user of users | async" (click)="selectUser(user)" class="mdl-menu__item">{{user.name}}</li>
      </ul>
    </div>
  `
})
export class RJDropDown {
  users: Observable<Array<User>>;
  selectedUser: Observable<User>;

  constructor(private store: Store<AppStore>) {
    this.users = store.select('users');
    this.selectedUser = store.select('selectedUser');
  }

  selectUser(user) {
    this.store.dispatch({type: SELECT_USER, payload: user});
  }
}

//-------------------------------------------------------------------
// MAIN CONTEXT
//-------------------------------------------------------------------
@Component({
  selector: 'main-context',
  directives: [RJTab, RJDropDown],
  template: `
    <div class="mdl-grid mdl-cell mdl-cell--12-col">
        <div class="mdl-cell mdl-cell--10-col">
          <h3>Platform</h3>
        </div>
        <div class="mdl-cell mdl-cell--2-col">
          <rj-drop-down></rj-drop-down>
        </div>
    </div>
    <rj-tab *ngFor="#session of context.sessions;trackBy:track" [session]="session" [class]="mdlClasses"></rj-tab>
    `
})
export class MainContext {
  mdlClasses: String = 'mdl-card mdl-color--blue-50 mdl-shadow--2dp mdl-cell mdl-cell--6-col';
  @Input() context: Context;
  track(index) { return index; }
}

//-------------------------------------------------------------------
// MAIN COMPONENT
//-------------------------------------------------------------------
@Component({
  selector: 'my-app',
  directives: [MainContext],
  template: `
    <main-context [class]="mdlClasses" [context]="context | async"></main-context>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  mdlClasses: String = 'mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid';
  context: Observable<Context>;

  constructor(private contextService: ContextService) {
    this.context = contextService.context;

    this.context
      .subscribe(c => console.log('ContextService.context', c));
  }
}
