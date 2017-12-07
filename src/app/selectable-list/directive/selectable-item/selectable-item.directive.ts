import { AfterViewInit, Directive, ElementRef, HostListener, Inject, Input, OnDestroy, Renderer2 } from '@angular/core';
import {Mode, SelectableListService} from '../selectable-list/selectable-list.directive';
import { Subscription } from "rxjs/Subscription";

@Directive({
  selector: '[appSelectableItem]',
})
export class SelectableItemDirective implements AfterViewInit, OnDestroy {
  clearSelectionSubscription: Subscription;
  container: HTMLElement;

  get mode(): Mode {
    return this.selectableListService.mode;
  }

  @Input()
  item: { id: string };

  get selected(): boolean {
    return !!this.selectableListService.selectedItemIds.find(id => id === this.item.id);
  }

  get selecting(): boolean {
    return this.selectableListService.selecting;
  }

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              @Inject('selectable-list-service') private selectableListService: SelectableListService) {
    this.clearSelectionSubscription = this.selectableListService.clearSelection.subscribe(ids => {
      if (ids.find(id => id === this.item.id)) {
        this.switchBackground();
      }
    });
  }

  ngAfterViewInit() {
    this.container = this.el.nativeElement.querySelector(':only-child');
  }

  ngOnDestroy() {
    this.clearSelectionSubscription.unsubscribe();
  }

  @HostListener('tap')
  onTap() {
    this.handleEvent('tap');
  }

  @HostListener('press')
  onPress() {
    this.handleEvent('press');
  }

  handleEvent(type: string) {
    switch (this.mode) {
      case Mode.single:
        this.dispatchEvent('single');
        break;

      case Mode.multiple_tap:
        this.switchBackground();
        this.dispatchEvent('multiple');
        break;

      case Mode.multiple_press:
        if (this.selecting || type === 'press') {
          this.switchBackground();
          this.dispatchEvent('multiple');
        }
        break;

      case Mode.both:
        if (this.selecting || type === 'press') {
          this.switchBackground();
          this.dispatchEvent('multiple');
        } else if (type === 'tap') {
          this.dispatchEvent('single');
        }
        break;
    }
  }

  switchBackground() {
    this.selected ? this.renderer.removeStyle(this.container, 'background-color')
      : this.renderer.setStyle(this.container, 'background-color', 'lightblue');
  }

  dispatchEvent(type: 'single' | 'multiple') {
    this.selectableListService[type].emit(this.item.id);
  }
}
