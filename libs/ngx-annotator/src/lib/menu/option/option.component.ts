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

  constructor(readonly uix: UixService, readonly annotation: AnnotatorService) {}

  ngOnInit() {
    this.setMenuOverlayClass(this.annotation.state.fillStyle);
  }

  get menuColorValues(): string[] {
    return AnnotatorColors.filter((color) => color !== this.annotation.state.fillStyle);
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

  toggleBackgroundColor(event: Event) {
    event.stopPropagation();
    const backgroundColor = this.isBackgroundWhite() ? '#000000' : '#ffffff';
    if (this.annotation.state.menuColor !== backgroundColor) {
      this.annotation.setState({
        ...this.annotation.state,
        fillStyle: backgroundColor,
      });

      this.setMenuOverlayClass(backgroundColor);
    }
  }

  isBackgroundWhite() {
    return this.annotation.state.fillStyle === '#ffffff';
  }

  setMenuOverlayClass(color: BackgroundColor) {
    if (color === '#000000') {
      this.uix.removeClassFromBody('menu-background-white');
      this.uix.addClassToBody('menu-background-black');
    } else {
      this.uix.removeClassFromBody('menu-background-black');
      this.uix.addClassToBody('menu-background-white');
    }
  }

  setMenuColor(menuColor: string) {
    if (this.annotation.state.fillStyle !== menuColor) {
      this.annotation.setState({ menuColor });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
