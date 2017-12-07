import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-item',
  template: `
    <div>{{item.id}}</div>
  `
})
export class ItemComponent {
  @Input()
  item: any;
}
