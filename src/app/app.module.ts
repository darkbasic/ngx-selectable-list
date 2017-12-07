import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SelectableListModule } from "./selectable-list/selectable-list-module";
import { MultipleListComponent } from "./containers/multiple-list/multiple-list.component";
import { ListComponent } from "./containers/list/list.component";
import { ItemComponent } from "./components/item/item.component";


@NgModule({
  declarations: [
    AppComponent,
    MultipleListComponent,
    ListComponent,
    ItemComponent
  ],
  imports: [
    BrowserModule,
    SelectableListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
