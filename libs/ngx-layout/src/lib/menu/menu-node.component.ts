/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuNode } from '@fullerstack/ngx-menu';
import { Subject, filter } from 'rxjs';

@Component({
  selector: 'fullerstack-menu-node',
  templateUrl: './menu-node.component.html',
  styleUrls: ['./menu-node.component.scss'],
})
export class MenuNodeComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();
  @Input() node: MenuNode;
  isActive = true;

  constructor(public router: Router) {}

  ngOnInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe({
      next: () => {
        this.isActive = this.node.isActive(this.router.url);
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
