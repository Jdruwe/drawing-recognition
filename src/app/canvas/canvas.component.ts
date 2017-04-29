import {Component, ViewChild, ElementRef, Input, AfterViewInit, HostListener} from '@angular/core';
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
  private isDrawing: boolean;

  constructor(private recognizeService: RecognizeService, private snackBar: MdSnackBar) {
  }

  ngAfterViewInit(): void {

    this.canvasElement = this.canvas.nativeElement;
    this.cx = this.canvasElement.getContext('2d');
    this.initCanvas();
    this.captureEvents();
  }

  @HostListener('window:resize')
  private onCanvasResize() {
    this.initCanvas();
  }

  private initCanvas(): void {
    this.isDrawing = false;
    this.calculateCanvasDimensions();
    this.calculateCanvasOffset();
    this.setCanvasStyling();
    this.displayStartText();
  }

  private clearCanvas(): void {
    this.cx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  private displayStartText(): void {
    this.cx.textBaseline = "middle";
    this.cx.textAlign = "center";
    this.cx.font = 'bold 25px Arial';
    this.cx.fillText('Start Drawing Here!', this.canvasElement.width / 2, this.canvasElement.height / 2);
  }

  private hideStartText(): void {
    if (!this.isDrawing) {
      this.clearCanvas();
    }

    this.isDrawing = true;
  }

  private setCanvasStyling(): void {
    this.cx.lineWidth = 7;
    this.cx.lineCap = 'round';
    this.cx.lineJoin = 'round';
    this.cx.strokeStyle = '#000';
  }

  private calculateCanvasDimensions(): void {
    console.log('window width', window.innerWidth);
    console.log('window width', window.innerHeight);
    this.canvasElement.width = window.innerWidth;
    this.canvasElement.height = window.innerHeight;
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
      .do(() => this.hideStartText())
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
