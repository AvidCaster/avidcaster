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
  '#ffffff',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#00ffff',
  '#ff00ff',
  '#000000',
];

const DefaultAnnotatorState: AnnotatorState = {
  signature: '',
  backgroundColor: '#000000',
  menuColor: '#05D1F5',
  lineCap: 'round',
  lineJoin: 'round',
  lineWidth: 3,
  strokeStyle: '#000',
  cursor: true,
  fullscreen: true,
  position: 'top-left',
  vertical: true,
  reverse: false,
  showTrash: true,
  showUndo: true,
  showRedo: true,
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
