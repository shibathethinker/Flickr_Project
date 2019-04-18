import { BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
// import { SearchBarComponent } from './search-bar/search-bar.component';
import { CardComponent } from './card/card.component';
import { CardContainerComponent } from './card-container/card-container.component';
import { GridComponent } from './grid/grid.component';
import {HttpService} from './http-service/http-service'
import { HttpModule } from '@angular/http';
import { DropdownitemComponent } from './dropdownitem/dropdownitem.component';


@NgModule({
  declarations: [
    AppComponent,
    // SearchBarComponent,
    CardComponent,
    CardContainerComponent,
    GridComponent,
    DropdownitemComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
