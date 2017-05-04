import {Component} from '@angular/core';
import {RecognizeService} from "../recognize.service";
import {MdSnackBar} from "@angular/material";
import {Line} from "../line";

@Component({
  selector: 'app-guess',
  templateUrl: './guess.component.html',
  styleUrls: ['./guess.component.css']
})
export class GuessComponent {

  constructor(private recognizeService: RecognizeService, private snackBar: MdSnackBar) {
  }

  processDrawing(drawing: Line[], width: number, height: number): void {

    let trace = [];

    for (let line of drawing) {

      let tempX = [];
      let tempY = [];

      for (let point of line.points) {
        tempX.push(point.x);
        tempY.push(point.y);
      }

      trace.push([tempX, tempY])
    }

    this.recognizeService.getGuess(trace, width, height).subscribe(
      (guesses: string[]) => this.showGuess(guesses),
      error => {
        console.log(error);
      }
    );
  }

  private showGuess(guess: String[]): void {
    this.snackBar.open('Google thinks you are drawing a ' + guess + "!", null, {
      duration: 2000
    });
  }
}
