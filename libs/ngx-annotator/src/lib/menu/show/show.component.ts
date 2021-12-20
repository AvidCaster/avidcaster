/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { shakeAnimations } from '@fullerstack/ngx-shared';
import { Subject } from 'rxjs';

import { ButtonType } from '../../annotator.model';
import { AnnotatorService } from '../../annotator.service';

interface ActionButton {
  type: ButtonType;
  icon: string;
  iconClass?: string;
  label: string;
}

@Component({
  selector: 'fullerstack-show-menu',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
  animations: [shakeAnimations.wiggleIt],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ShowMenuComponent implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  actionButtons: ActionButton[] = [
    {
      type: 'showTrash',
      icon: 'trash-can-outline',
      label: _('COMMON.TRASH'),
    },
    {
      type: 'showUndo',
      icon: 'undo-variant',
      label: _('COMMON.UNDO'),
    },
    {
      type: 'showRedo',
      icon: 'redo-variant',
      label: _('COMMON.REDO'),
    },
    {
      type: 'showLineColor',
      icon: 'palette',
      label: _('COMMON.LINE_COLOR'),
    },
    {
      type: 'showLineWidth',
      icon: 'format-line-weight',
      label: _('COMMON.LINE_WEIGHT'),
    },
    {
      type: 'showEraser',
      icon: 'eraser',
      iconClass: 'icon-rotate',
      label: _('COMMON.ERASER'),
    },
    {
      type: 'showCursor',
      icon: 'cursor-default-click',
      label: _('COMMON.CURSOR'),
    },
    {
      type: 'showSave',
      icon: 'download-circle-outline',
      label: _('COMMON.SAVE'),
    },
    {
      type: 'showFullscreen',
      icon: 'arrow-expand-all',
      label: _('COMMON.FULLSCREEN'),
    },
    {
      type: 'showRefresh',
      icon: 'web-refresh',
      label: _('COMMON.REFRESH'),
    },
  ];

  constructor(readonly annotation: AnnotatorService) {}

  toggleShowButton(event: Event, buttonType: ButtonType) {
    event.stopPropagation();
    this.annotation.setState({
      [buttonType]: !this.annotation.state[buttonType],
    });
  }

  isButtonVisible(buttonType: ButtonType) {
    return this.annotation.state[buttonType];
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
