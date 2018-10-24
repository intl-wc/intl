import { TestWindow } from '@stencil/core/testing';
import { Controller } from './controller';

describe('controller', () => {
  it('should build', () => {
    expect(new Controller()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLControllerElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Controller],
        html: '<controller></controller>'
      });
    });

    // See https://stenciljs.com/docs/unit-testing
    {cursor}

  });
});
