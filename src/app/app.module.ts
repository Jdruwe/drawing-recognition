import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';

import 'hammerjs';

import {AppComponent} from './app.component';
import {RecognizeService} from "./recognize.service";

import {MdToolbarModule, MdIconModule, MdSnackBarModule} from '@angular/material';
import {CanvasComponent} from './canvas/canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MdToolbarModule,
    MdIconModule,
    MdSnackBarModule,
    FlexLayoutModule
  ],
  providers: [RecognizeService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
