/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { shakeAnimations } from '@fullerstack/ngx-shared';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject } from 'rxjs';

import { BackgroundColor, MenuPosition } from '../../annotator.model';
import { AnnotatorService } from '../../annotator.service';

@Component({
  selector: 'fullerstack-menu-position',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  animations: [shakeAnimations.wiggleIt],
  encapsulation: ViewEncapsulation.Emulated,
})
export class MenuOptionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(readonly uix: UixService, readonly annotation: AnnotatorService) {}

  ngOnInit() {
    this.setMenuOverlayClass(this.annotation.state.backgroundColor);
  }

  setPosition(event: Event, position: MenuPosition) {
    event.stopPropagation();
    this.annotation.setState({
      ...this.annotation.state,
      position,
    });
  }

  isPosition(position: MenuPosition) {
    return this.annotation.state.position === position;
  }

  toggleVertical(event: Event) {
    event.stopPropagation();
    this.annotation.setState({
      ...this.annotation.state,
      vertical: !this.annotation.state.vertical,
    });
  }

  toggleRevere(event: Event) {
    event.stopPropagation();
    this.annotation.setState({
      ...this.annotation.state,
      reverse: !this.annotation.state.reverse,
    });
  }

  toggleColor(event: Event) {
    event.stopPropagation();
    const color = this.isBackgroundWhite() ? 'black' : 'white';
    this.annotation.setState({
      ...this.annotation.state,
      backgroundColor: color,
    });

    this.setMenuOverlayClass(color);
  }

  isBackgroundWhite() {
    return this.annotation.state.backgroundColor === 'white';
  }

  setMenuOverlayClass(color: BackgroundColor) {
    if (color === 'black') {
      this.uix.removeClassFromBody('menu-background-white');
      this.uix.addClassToBody('menu-background-black');
    } else {
      this.uix.removeClassFromBody('menu-background-black');
      this.uix.addClassToBody('menu-background-white');
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
