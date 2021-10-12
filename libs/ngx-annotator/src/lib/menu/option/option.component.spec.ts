/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOptionComponent } from './option.component';

describe('MenuOptionComponent', () => {
  let component: MenuOptionComponent;
  let fixture: ComponentFixture<MenuOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuOptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
