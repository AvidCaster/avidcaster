/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { FormControl, FormGroup } from '@angular/forms';
import { tryGet } from '@fullerstack/agx-util';

export function getControl(form: FormGroup, name: string): FormControl {
  return tryGet<FormControl>(() => form.controls[name] as FormControl);
}
