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
  backgroundColor: '#000000',
  menuColor: '#00ffff',
  lineCap: 'round',
  lineJoin: 'round',
  lineWidth: 3,
  strokeStyle: '#00ffff',
  cursor: true,
  fullscreen: true,
  position: 'top-left',
  vertical: true,
  reverse: false,
  erase: false,
  showTrash: true,
  showUndo: true,
  showRedo: true,
  showEraser: true,
  showLineWidth: true,
  showLineColor: true,
  showCursor: true,
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
  points: [],
  attributes: {
    lineCap: DefaultAnnotatorState.lineCap,
    lineWidth: DefaultAnnotatorState.lineWidth,
    strokeStyle: DefaultAnnotatorState.strokeStyle,
  },
  visible: true,
};

export const defaultLine = (): Line => {
  return ldDeepClone(DefaultLine);
};
