/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FireworksComponent } from './fireworks.component';

xdescribe('FireworksComponent', () => {
  let component: FireworksComponent;
  let fixture: ComponentFixture<FireworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FireworksComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FireworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
