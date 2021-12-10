/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'html2Text',
})
export class Html2TextPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    const text = value.replace(/<(?:.|\n)*?>/gm, '');
    return text;
  }
}
