import {Point} from "./point";

export class Line {

  private _points: Point[];

  constructor() {
    this._points = [];
  }

  get points(): Point[] {
    return this._points;
  }
}
