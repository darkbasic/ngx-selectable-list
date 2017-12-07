import { Component, Input } from "@angular/core";
import { SelectableListDirective } from "../../selectable-list/directive/selectable-list/selectable-list.directive";

@Component({
  selector: 'app-list',
  template: `
    <div *ngFor="let item of items">
      <app-item appSelectableItem [item]="item"></app-item>
    </div>
    <ng-content *ngIf="selectableListDirective.selecting"></ng-content>
  `
})
export class ListComponent {
  @Input()
  items: any[];

  constructor(public selectableListDirective: SelectableListDirective) {}
}
