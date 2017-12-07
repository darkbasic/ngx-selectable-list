import {NgModule} from '@angular/core';

import {SelectableItemDirective} from './directive/selectable-item/selectable-item.directive';
import {SelectableListDirective} from './directive/selectable-list/selectable-list.directive';

@NgModule({
  declarations: [
    // Directives
    SelectableItemDirective,
    SelectableListDirective,
  ],
  exports: [
    SelectableItemDirective,
    SelectableListDirective,
  ],
})
export class SelectableListModule {
}
