import {
  AfterContentInit,
  ComponentFactoryResolver, ContentChild, Directive, ElementRef, EventEmitter, Inject, Input, OnDestroy, Output, Renderer2,
  ViewContainerRef
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

export class SelectableListService {
  selecting = false;
  selectedItemIds: string[] = [];
  single = new EventEmitter<string>();
  multiple = new EventEmitter<string>();
  mode: Mode = Mode.single;
  clearSelection = new EventEmitter<string[]>();
}

export enum Mode {
  single = 'Single',
  multiple_tap = 'Multiple (tap activated)',
  multiple_press = 'Multiple (press activated)',
  both = 'Single and multiple (press activated)',
}

export const SERVICE = new SelectableListService();

@Directive({
  selector: '[appSelectableList]',
  providers: [
    {
      provide: 'selectable-list-service',
      useValue: SERVICE,
    }
  ],
})
export class SelectableListDirective implements OnDestroy, AfterContentInit {
  singleSubscription: Subscription;
  multipleSubscription: Subscription;
  clickListenerFn: () => void;

  set mode(value: Mode) {
    this.selectableListService.mode = value;
  }

  // _selecting = false;
  set selecting(value: boolean) {
    this.selectableListService.selecting = value;
  }

  get selecting(): boolean {
    return this.selectableListService.selecting;
  }

  set selectedItemIds(value: string[]) {
    this.selectableListService.selectedItemIds = value;
  }

  get selectedItemIds(): string[] {
    return this.selectableListService.selectedItemIds;
  }

  @Input()
  set appSelectableList(value: Mode) {
    if (value in Mode) {
      this.mode = Mode[value];
    }
  }

  @Input()
  items: { id: string }[];

  @Output()
  isSelecting = new EventEmitter<boolean>();

  @Output()
  single = new EventEmitter<string>();

  @Output()
  multiple = new EventEmitter<string[]>();

  @ContentChild('confirmSelection', {read: ElementRef}) confirmButton: any;

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              private view: ViewContainerRef,
              private resolver: ComponentFactoryResolver,
              @Inject('selectable-list-service') private selectableListService: SelectableListService) {
    // Since services are singletons let's set some defaults
    this.selectableListService.selecting = false;
    this.selectableListService.selectedItemIds = [];
    this.selectableListService.single = new EventEmitter<string>();
    this.selectableListService.multiple = new EventEmitter<string>();
    this.selectableListService.mode = Mode.single;

    this.singleSubscription = this.selectableListService.single.subscribe(id => this.single.emit(id));
    this.multipleSubscription = this.selectableListService.multiple.subscribe(id => this.selectItem(id));
  }

  ngAfterContentInit() {
    if (this.confirmButton) {
      this.clickListenerFn = this.renderer.listen(this.confirmButton.nativeElement, 'click', () => this.confirmSelection());
    }
  }

  ngOnDestroy() {
    this.singleSubscription.unsubscribe();
    this.multipleSubscription.unsubscribe();
    if (this.clickListenerFn) {
      this.clickListenerFn();
    }
  }

  selectItem(itemId: string) {
    if (this.selectedItemIds.find(id => id === itemId)) {
      this.selectedItemIds = this.selectedItemIds.filter(selectedItemId => selectedItemId !== itemId);
    } else {
      this.selectedItemIds = this.selectedItemIds.concat(itemId);
    }
    if (this.selecting !== !!this.selectedItemIds.length) {
      this.selecting = !!this.selectedItemIds.length;
      this.isSelecting.emit(this.selecting);
    }
  }

  confirmSelection() {
    if (this.selectedItemIds.length) {
      this.multiple.emit(this.selectedItemIds.filter(itemId => this.items.find(item => item.id === itemId)));
      this.selectableListService.clearSelection.emit(this.selectedItemIds);
      this.selectedItemIds = [];
      this.selecting = false;
      this.isSelecting.emit(false);
    }
  }
}
