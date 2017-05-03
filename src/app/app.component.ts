import {Component, ViewChild} from '@angular/core';
import {Line} from "./line";
import {GuessComponent} from "./guess/guess.component";
import {CanvasDimension} from "./canvas-dimension";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  private canvasDimension: CanvasDimension;

  @ViewChild(GuessComponent)
  private guessComponent: GuessComponent;

  private handleDrawing(drawing: Line[]): void {
    if (this.canvasDimension) {
      this.guessComponent.processDrawing(drawing, this.canvasDimension.width, this.canvasDimension.height);
    }
  }

  private handleCanvasDimension(dimension: CanvasDimension): void {
    this.canvasDimension = dimension;
  }

}
