/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { cloneDeep as ldDeepClone } from 'lodash-es';

import { AnnotatorConfig, AnnotatorState, Line } from './annotator.model';

export const AnnotatorColors: string[] = [
  '#ffffff', // white
  '#ffff00', // yellow
  '#ffa500', // orange
  '#dda0dd', // plum
  '#00ff00', // green
  '#00ffff', // cyan
  '#ff0000', // red
  '#0000ff', // blue
  '#000000', // black
];

const DefaultAnnotatorState: AnnotatorState = {
  signature: '',
  lineCap: 'round',
  lineJoin: 'round',
  lineWidth: 3,
  strokeStyle: '#00ffff',
  bgColor: '#000000',
  menuColor: '#00ffff',
  cursor: true,
  fullscreen: true,
  position: 'top-left',
  vertical: true,
  reverse: false,
  eraser: false,
  fader: false,
  showTrash: true,
  showUndo: true,
  showRedo: true,
  showLineWidth: true,
  showLineColor: true,
  showEraser: true,
  showCursor: true,
  showSave: true,
  showFullscreen: true,
  showRefresh: true,
};

export const defaultAnnotatorState = (): AnnotatorState => {
  return ldDeepClone(DefaultAnnotatorState);
};

/**
 * Default configuration - Layout module
 */
const DefaultAnnotatorConfig: AnnotatorConfig = {
  logState: false,
};

export const defaultAnnotatorConfig = (): AnnotatorConfig => {
  return ldDeepClone(DefaultAnnotatorConfig);
};

const DefaultLine: Line = {
  timestamp: 0,
  points: [],
  attributes: {
    lineCap: DefaultAnnotatorState.lineCap,
    lineJoin: DefaultAnnotatorState.lineJoin,
    lineWidth: DefaultAnnotatorState.lineWidth,
    strokeStyle: DefaultAnnotatorState.strokeStyle,
  },
  visible: true,
  eraser: false,
};

export const defaultLine = (): Line => {
  return ldDeepClone({ ...DefaultLine, timestamp: new Date().getTime() });
};

export const ANNOTATOR_DRAW_URL = '/annotate/draw';
export const ANNOTATOR_URL_FULLSCREEN_LIST = [ANNOTATOR_DRAW_URL];

export const ANNOTATOR_LINE_WIDTH_OPTIONS = [2, 3, 4, 5, 6, 8];
export const ANNOTATOR_ERASER_LINE_WIDTH_EXTRA_WIDTH = 15;

export const ANNOTATOR_FADER_FREQUENCY_IN_MILLISECONDS = 70;
export const ANNOTATOR_FADER_ALPHA_DELTA_STEP = 10;
export const ANNOTATOR_FADER_KEEP_IN_SECONDS = 10 * 1000;
