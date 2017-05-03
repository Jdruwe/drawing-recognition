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

  processDrawing(drawing: Line[], width: number, height: number) {

    let tempX = [];
    let tempY = [];

    for (let line of drawing) {
      tempX.push(line.x1, line.x2);
      tempY.push(line.y1, line.y2);
    }

    this.recognizeService.getGuess([[tempX, tempY]], width, height).subscribe(
      (guess: string) => this.showGuess(guess),
      error => {
        console.log(error);
      }
    );
  }

  private showGuess(guess: String) {
    this.snackBar.open('Google thinks you are drawing a ' + guess + "!", null, {
      duration: 2000
    });
  }
}
