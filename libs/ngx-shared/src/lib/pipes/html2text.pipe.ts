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
