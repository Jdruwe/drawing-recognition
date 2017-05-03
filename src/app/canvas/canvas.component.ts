import {
  Component, ViewChild, ElementRef, AfterViewInit, HostListener, Output, EventEmitter,
  OnInit
} from '@angular/core';
import {Observable} from 'rxjs';
import {Line} from "../line";
import {CanvasDimension} from "../canvas-dimension";

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMapTo';

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

  private lines: Line[] = [];
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

    this.lines.push(line);
  }

  private endDrawing() {
    this.onDrawing.emit(this.lines);
  }
}
