import {Component, ViewChild, ElementRef, Input, AfterViewInit, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {Line} from "../line";

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMapTo';
import {RecognizeService} from "../recognize.service";
import {MdSnackBar} from "@angular/material";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {

  @ViewChild('canvas') public canvas: ElementRef;

  @Input() public width: number;
  @Input() public height: number;

  private cx: CanvasRenderingContext2D;
  private handwritingX = [];
  private handwritingY = [];
  private trace = [];
  private canvasElement: HTMLCanvasElement;
  private boundingClientRect: ClientRect;

  constructor(private recognizeService: RecognizeService, private ngZone: NgZone, private snackBar: MdSnackBar) {
    window.onresize = () => {
      this.ngZone.run(() => {
        this.calculateCanvasOffset();
      });
    };
  }

  ngAfterViewInit(): void {

    this.canvasElement = this.canvas.nativeElement;
    this.cx = this.canvasElement.getContext('2d');

    this.canvasElement.width = this.width;
    this.canvasElement.height = this.height;

    this.calculateCanvasOffset();

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents();
  }

  private calculateCanvasOffset(): void {
    this.boundingClientRect = this.canvasElement.getBoundingClientRect();
  }

  private captureEvents() {

    const canvasReleased$ = Observable.fromEvent(this.canvasElement, 'mouseup');
    const canvasDown$ = Observable.fromEvent(this.canvasElement, 'mousedown');
    const canvasDrawing$ = Observable.fromEvent(this.canvasElement, 'mousemove')
      .pairwise()
      .takeUntil(canvasReleased$)
      .map((event: [MouseEvent, MouseEvent]) => {
        return {
          x1: event[0].clientX,
          y1: event[0].clientY,
          x2: event[1].clientX,
          y2: event[1].clientY,
        }
      });

    canvasDown$
      .switchMapTo(canvasDrawing$)
      .subscribe((line: Line) => this.drawOnCanvas(line));

    canvasReleased$
      .subscribe(event => this.endDrawing());
  }

  private drawOnCanvas(line: Line) {

    if (!this.cx) {
      return;
    }

    this.cx.beginPath();
    this.cx.moveTo(line.x1 - this.boundingClientRect.left, line.y1 - this.boundingClientRect.top);
    this.cx.lineTo(line.x2 - this.boundingClientRect.left, line.y2 - this.boundingClientRect.top);
    this.cx.stroke();

    this.handwritingX.push(line.x1 - this.boundingClientRect.left, line.x2 - this.boundingClientRect.left);
    this.handwritingY.push(line.y1 - this.boundingClientRect.top, line.y2 - this.boundingClientRect.top);
  }

  private resetTemporaryCoordinates() {
    this.handwritingX = [];
    this.handwritingY = [];
  }

  private endDrawing() {
    this.trace.push([this.handwritingX, this.handwritingY]);
    this.resetTemporaryCoordinates();
    this.recognizeService.getGuess(this.trace, this.width, this.height).subscribe(
      (guess: String) => this.showGuess(guess),
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
