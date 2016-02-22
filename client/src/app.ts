import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {Context, Session, AppStore} from './context-store';

//-------------------------------------------------------------------
// ENTITY CONTEXT
//-------------------------------------------------------------------
@Component({
  selector: 'rj-capability',
  template: `
  <div class="mdl-card__supporting-text">
    <h4>{{capability}}</h4>
  </div>
  `
})
export class RJCapability {
  @Input() capability: String;
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
        <rj-capability *ngFor="#capability of session.capabilities" [capability]="capability" [class]="mdlClasses"></rj-capability>
    </div>
    `
})
export class RJTab {
  mdlClasses: String = 'mdl-card mdl-color--blue-100 mdl-shadow--2dp mdl-cell mdl-cell--12-col';
  @Input() session: Session;
}


//-------------------------------------------------------------------
// ACTIONS
//-------------------------------------------------------------------
@Component({
  selector: 'rj-drop-down',
  template: `
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select">
      <input class="mdl-textfield__input" value="John Smith - FA" type="text" id="client" readonly tabIndex="-1" />
      <label class="mdl-textfield__label" for="client">Client</label>
      <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu" for="client">
        <li class="mdl-menu__item">John Smith - FA</li>
        <li class="mdl-menu__item">Jane Doe - Assistant</li>
      </ul>
    </div>
  `
})
export class RJDropDown { }

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
    <rj-tab *ngFor="#session of context.sessions" [session]="session" [class]="mdlClasses"></rj-tab>
    `
})
export class MainContext {
  mdlClasses: String = 'mdl-card mdl-color--blue-50 mdl-shadow--2dp mdl-cell mdl-cell--6-col';
  @Input() context: Context;
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

  constructor(private store: Store<AppStore>) {
    this.context = store.select('context');
    this.context.subscribe(c => console.log('this.context', c));
  }
}

//-------------------------------------------------------------------
//  MASTER TODO LIST
//-------------------------------------------------------------------

// MAIN GOAL To simplify the semantics around platform so that they can be illustrated
// in a simple proof of concept

// Clearly show how user and session context is consumed at a component level if at all
// Clearly show event flow from component to session
// Clearly show how changing user context will affect state down to the component level

// Create action registry
// Populate action component for each capability
// Emit appropriate action upon selection
// Demonstrate the appropriate action being handled at a service / store level
