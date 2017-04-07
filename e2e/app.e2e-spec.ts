import { DrawingRecognitionPage } from './app.po';

describe('drawing-recognition App', () => {
  let page: DrawingRecognitionPage;

  beforeEach(() => {
    page = new DrawingRecognitionPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
