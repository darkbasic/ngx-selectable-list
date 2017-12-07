import { Component } from "@angular/core";

@Component({
  selector: 'app-multiple-list',
  template: `
    <app-list [items]="items"
              appSelectableList="both"
              (single)="single($event)" (multiple)="multiple($event)">
      <button #confirmSelection>CONFIRM</button>
    </app-list>
  `
})
export class MultipleListComponent {
  items = [{id: 1}, {id: 2}, {id: 3}];

  single(event: any) {
    console.log(event);
  }

  multiple(event: any[]) {
    console.log(event);
  }
}
