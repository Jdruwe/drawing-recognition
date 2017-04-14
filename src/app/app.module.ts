import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import 'hammerjs';

import {AppComponent} from './app.component';
import {CanvasComponentComponent} from './canvas-component/canvas-component.component';
import {RecognizeService} from "./recognize.service";

import {MdToolbarModule, MdIconModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MdToolbarModule,
    MdIconModule
  ],
  providers: [RecognizeService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
