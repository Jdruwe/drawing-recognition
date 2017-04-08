import {Component, ViewChild, ElementRef, Input, AfterViewInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Line} from "../line";

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'canvas-component',
  templateUrl: './canvas-component.component.html',
  styleUrls: ['./canvas-component.component.css']
})
export class CanvasComponentComponent implements AfterViewInit {

  @ViewChild('canvas') public canvas: ElementRef;

  @Input() public width: number;
  @Input() public height: number;

  private cx: CanvasRenderingContext2D;

  ngAfterViewInit(): void {

    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {

    const canvasReleased$ = Observable.fromEvent(canvasEl, 'mouseup');
    const canvasDown$ = Observable.fromEvent(canvasEl, 'mousedown');
    const canvasDrawing$ = Observable.fromEvent(canvasEl, 'mousemove')
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
      .switchMap(event => canvasDrawing$)
      .subscribe((line: Line) => this.drawOnCanvas(line));
  }

  private drawOnCanvas(line: Line) {

    if (!this.cx) {
      return;
    }

    this.cx.beginPath();
    this.cx.moveTo(line.x1, line.y1);
    this.cx.lineTo(line.x2, line.y2);
    this.cx.stroke();
  }
}
