/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { LayoutService } from '@fullerstack/ngx-layout';
import { shakeAnimations } from '@fullerstack/ngx-shared';
import { Subject } from 'rxjs';

import { AnnotatorColors } from '../../annotator.default';
import { BackgroundColor, MenuPosition } from '../../annotator.model';
import { AnnotatorService } from '../../annotator.service';

@Component({
  selector: 'fullerstack-menu-position',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  animations: [shakeAnimations.wiggleIt],
})
export class MenuOptionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(
    readonly auth: AuthService,
    readonly layout: LayoutService,
    readonly annotation: AnnotatorService
  ) {}

  ngOnInit() {
    this.setMenuOverlayClass(this.annotation.state.bgColor);
  }

  get menuColorValues(): string[] {
    return AnnotatorColors.filter((color) => color !== this.annotation.state.bgColor);
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

  toggleFader(event: Event) {
    const fader = !this.annotation.state.fader;
    event.stopPropagation();
    this.annotation.setState({
      ...this.annotation.state,
      fader: fader,
      eraser: fader ? false : this.annotation.state.eraser,
      showTrash: !fader,
      showUndo: !fader,
      showRedo: !fader,
      showEraser: !fader,
      showSave: fader ? false : this.annotation.state.showSave,
      showCursor: fader ? false : this.annotation.state.showCursor,
    });
  }

  toggleBackgroundColor(event: Event) {
    event.stopPropagation();
    const bgColor = this.annotation.isBackgroundWhite() ? '#000000' : '#ffffff';
    if (this.annotation.state.menuColor !== bgColor) {
      this.annotation.setState({ ...this.annotation.state, bgColor });
      this.setMenuOverlayClass(bgColor);
    }
  }

  setMenuOverlayClass(color: BackgroundColor) {
    if (color === '#000000') {
      this.layout.uix.removeClassFromBody('menu-background-white');
      this.layout.uix.addClassToBody('menu-background-black');
    } else {
      this.layout.uix.removeClassFromBody('menu-background-black');
      this.layout.uix.addClassToBody('menu-background-white');
    }
  }

  setMenuColor(menuColor: string) {
    if (this.annotation.state.bgColor !== menuColor) {
      this.annotation.setState({ menuColor });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.layout.uix.removeClassFromBody('menu-background-white');
    this.layout.uix.removeClassFromBody('menu-background-black');
  }
}
