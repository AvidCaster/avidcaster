/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMenuComponent } from './show.component';

describe('ShowMenuComponent', () => {
  let component: ShowMenuComponent;
  let fixture: ComponentFixture<ShowMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
