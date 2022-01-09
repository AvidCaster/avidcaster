/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export const ANNOTATOR_STORAGE_KEY = 'annotator';

/**
 * Layout config declaration
 */
export interface AnnotatorConfig {
  logState?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [id: string]: any;
}

export type ButtonType =
  | 'showTrash'
  | 'showUndo'
  | 'showRedo'
  | 'showLineColor'
  | 'showLineWidth'
  | 'showEraser'
  | 'showCursor'
  | 'showSave'
  | 'showFullscreen'
  | 'showRefresh';

export type MenuPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export type BackgroundColor = '#000000' | '#ffffff';

export interface LineAttributes {
  strokeStyle?: string;
  lineWidth?: number;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
}

/**
 * Annotation state model (keep flat)
 */
export interface AnnotatorState extends LineAttributes {
  signature: string;
  bgColor: BackgroundColor;
  menuColor: string;
  cursor: boolean;
  fullscreen: boolean;
  position: MenuPosition;
  vertical: boolean;
  reverse: boolean;
  eraser: boolean;
  fader: boolean;
  showTrash: boolean;
  showUndo: boolean;
  showRedo: boolean;
  showLineColor: boolean;
  showLineWidth: boolean;
  showEraser: boolean;
  showCursor: boolean;
  showSave: boolean;
  showFullscreen: boolean;
  showRefresh: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface Line {
  timestamp: number;
  points: Point[];
  attributes: LineAttributes;
  visible?: boolean;
  eraser?: boolean;
}
