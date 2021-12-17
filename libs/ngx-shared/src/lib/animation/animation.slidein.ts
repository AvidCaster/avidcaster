/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import {
  AnimationTriggerMetadata,
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const slideInAnimations: {
  readonly slideInFromBottom: AnimationTriggerMetadata;
} = {
  slideInFromBottom: trigger('slideInFromBottom', [
    transition(
      '* => *',
      animate(
        300,
        keyframes([style({ transform: 'translateY(200%)' }), style({ transform: 'translateY(0)' })])
      )
    ),
  ]),
};
