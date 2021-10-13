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
  encapsulation: ViewEncapsulation.Emulated,
})
export class MenuOptionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  menuColorValues: string[] = AnnotatorColors;

  constructor(readonly uix: UixService, readonly annotation: AnnotatorService) {}

  ngOnInit() {
    this.setMenuOverlayClass(this.annotation.state.backgroundColor);
    if (this.annotation.state.backgroundColor !== this.annotation.state.menuColor) {
      const color = this.isBackgroundWhite() ? '#000000' : '#ffffff';
      this.annotation.setState({
        ...this.annotation.state,
        backgroundColor: color,
      });
    }
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
    const color = this.isBackgroundWhite() ? '#000000' : '#ffffff';
    this.annotation.setState({
      ...this.annotation.state,
      backgroundColor: color,
    });

    this.setMenuOverlayClass(color);
  }

  isBackgroundWhite() {
    return this.annotation.state.backgroundColor === '#ffffff';
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
    if (this.annotation.state.backgroundColor !== menuColor) {
      this.annotation.setState({ menuColor });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
