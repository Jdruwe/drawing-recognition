import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {ObservableInput} from "rxjs/Observable";

@Injectable()
export class RecognizeService {

  constructor(private http: Http) {
  }

  private googleGuessUrl = 'https://www.google.com.tw/inputtools/request?itc=und-t-i0-handwrit&app=hwtcharpicker';

  getGuess(trace, canvasWidth: number, canvasHeight: number): Observable<String[]> {

    const data = JSON.stringify({
      "options": "enable_pre_space",
      "requests": [{
        "writing_guide": {
          "writing_area_width": canvasWidth,
          "writing_area_height": canvasHeight
        },
        "ink": trace,
        "language": "quickdraw"
      }]
    });

    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.googleGuessUrl, data, options)
      .map(result => {
        return result.json()[1][0][1];
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
