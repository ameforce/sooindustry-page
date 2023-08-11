import { Pk2AngularCliFreePage } from './app.po';

describe('sooindustry-angular-cli-free App', () => {
  let page: Pk2AngularCliFreePage;

  beforeEach(() => {
    page = new Pk2AngularCliFreePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
