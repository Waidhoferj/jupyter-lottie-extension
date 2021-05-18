import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import { JSONObject } from '@lumino/coreutils';

import { Widget } from '@lumino/widgets';
import lottie, { AnimationItem } from 'lottie-web';

/**
 * The default mime type for the extension.
 */
const MIME_TYPE = 'application/json';

/**
 * The class name added to the extension.
 */
const CLASS_NAME = 'mimerenderer-lottie';

/**
 * A widget for rendering lottie.
 */
export class OutputWidget extends Widget implements IRenderMime.IRenderer {
  /**
   * Construct a new output widget.
   */
  private _mimeType: string;
  private activeAnimation: AnimationItem;

  // private activeAnimation: AnimationItem | null = null;

  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
    this.addClass(CLASS_NAME);
  }

  /**
   * Render lottie into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    const data = model.data[this._mimeType] as JSONObject;
    console.log('rendered');
    this.activeAnimation = lottie.loadAnimation({
      container: this.node,
      animationData: data,
      name: 'lottie-animation',
    });
    return Promise.resolve();
  }

  onAfterDetach() {
    this.activeAnimation.destroy();
  }
}

/**
 * A mime renderer factory for lottie data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: (options) => new OutputWidget(options),
};

/**
 * Extension definition.
 */
const extension: IRenderMime.IExtension = {
  id: 'lottie-renderer:plugin',
  rendererFactory,
  rank: 0,
  dataType: 'json',
  fileTypes: [
    {
      name: 'lottie',
      mimeTypes: [MIME_TYPE],
      extensions: ['.json'],
    },
  ],
  documentWidgetFactoryOptions: {
    name: 'Lottie',
    primaryFileType: 'lottie',
    fileTypes: ['json'],
    defaultFor: ['lottie'],
  },
};

export default extension;
