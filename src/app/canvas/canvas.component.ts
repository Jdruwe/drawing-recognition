import {
  Component, ViewChild, ElementRef, AfterViewInit, HostListener, Output, EventEmitter
} from '@angular/core';
import {Observable} from 'rxjs';
import {Line} from "../line";
import {CanvasDimension} from "../canvas-dimension";

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMapTo';
import {Point} from "../point";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {

  @ViewChild('canvas') public canvas: ElementRef;
  @Output() onDrawing: EventEmitter<Line[]> = new EventEmitter();
  @Output() onCanvasDimensionChanged: EventEmitter<CanvasDimension> = new EventEmitter();

  private cx: CanvasRenderingContext2D;

  private drawing: Line[] = [];
  private canvasElement: HTMLCanvasElement;
  private boundingClientRect: ClientRect;
  private isDrawing: boolean;

  constructor() {
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
    this.canvasElement.width = window.innerWidth;
    this.canvasElement.height = window.innerHeight;
    this.onCanvasDimensionChanged.emit({
      width: window.innerWidth,
      height: window.innerHeight
    })
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
        return [
          new Point(event[0].clientX, event[0].clientY),
          new Point(event[1].clientX, event[1].clientY)
        ]
      });

    canvasDown$
      .do(() => this.hideStartText())
      .do(() => this.drawing.push(new Line()))
      .switchMapTo(canvasDrawing$)
      .subscribe((points: Point[]) => this.drawOnCanvas(points));

    canvasReleased$
      .subscribe(event => this.endDrawing());
  }

  private drawOnCanvas(points: Point[]) {

    if (!this.cx) {
      return;
    }

    this.cx.beginPath();
    this.cx.moveTo(points[0].x - this.boundingClientRect.left, points[0].y - this.boundingClientRect.top);
    this.cx.lineTo(points[1].x - this.boundingClientRect.left, points[1].y - this.boundingClientRect.top);
    this.cx.stroke();

    this.drawing[this.drawing.length - 1].points.push(points[0]);
    this.drawing[this.drawing.length - 1].points.push(points[1]);
  }

  private endDrawing() {
    this.onDrawing.emit(this.drawing);
  }
}
