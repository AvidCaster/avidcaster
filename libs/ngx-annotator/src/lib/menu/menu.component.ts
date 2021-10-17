/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy } from '@angular/core';
import { rotationAnimations, shakeAnimations } from '@fullerstack/ngx-shared';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject } from 'rxjs';

import { AnnotatorColors } from '../annotator.default';
import { AnnotatorService } from '../annotator.service';

@Component({
  selector: 'fullerstack-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [shakeAnimations.wiggleIt, rotationAnimations.rotate180],
})
export class MenuComponent implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  trashIconState = 1;
  undoIconState = 1;
  redoIconState = 1;
  cursorIconState = 1;
  eraserIconState = 'back';

  isFullscreen = false;

  lineWithValues: number[] = [2, 3, 4, 5, 6, 8];

  constructor(readonly uix: UixService, readonly annotation: AnnotatorService) {}

  get lineColorValues() {
    return AnnotatorColors.filter((color) => color !== this.annotation.state.fillStyle);
  }

  get topPosition(): string {
    switch (this.annotation.state.position) {
      case 'top-left':
      case 'top-right':
        return '2px';
      default:
        return 'unset';
    }
  }

  get bottomPosition(): string {
    switch (this.annotation.state.position) {
      case 'bottom-left':
      case 'bottom-right':
        return '4px';
      default:
        return 'unset';
    }
  }

  get leftPosition(): string {
    switch (this.annotation.state.position) {
      case 'top-left':
      case 'bottom-left':
        return '2px';
      default:
        return 'unset';
    }
  }

  get rightPosition(): string {
    switch (this.annotation.state.position) {
      case 'top-right':
      case 'bottom-right':
        return '2px';
      default:
        return 'unset';
    }
  }

  get flexLayout(): string {
    let layout = this.annotation.state.vertical ? 'column' : 'row';
    layout = this.annotation.state.reverse ? `${layout}-reverse` : layout;
    return layout;
  }

  trash() {
    this.trashIconState++;
    this.annotation.trash();
  }

  undo() {
    this.undoIconState++;
    this.annotation.undo();
  }

  redo() {
    this.redoIconState++;
    this.annotation.redo();
  }

  setLineWidth(lineWidth: number) {
    this.annotation.setState({ lineWidth });
  }

  setLineColor(lineColor: string) {
    this.annotation.setState({ strokeStyle: lineColor });
  }

  toggleErase() {
    this.eraserIconState = this.eraserIconState === 'back' ? 'forth' : 'back';
    this.annotation.setState({ eraser: !this.annotation.state.eraser });
  }

  toggleFullscreen() {
    this.uix.toggleFullscreen();
    setTimeout(() => {
      this.isFullscreen = this.uix.isFullscreen();
    }, 100);
  }

  toggleCursor() {
    this.cursorIconState++;
    this.annotation.setState({ cursor: !this.annotation.state.cursor });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
