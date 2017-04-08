import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {CanvasComponentComponent} from './canvas-component/canvas-component.component';
import {RecognizeService} from "./recognize.service";

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [RecognizeService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
