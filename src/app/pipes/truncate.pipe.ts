import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, length: number): string {
    const biggestWord = 30;
    const ellipses = ' ... [mehr]';

    if (typeof value === 'undefined' || value.length <= length) {
      return value;
    }

    // .. truncate to about correct lenght
    let truncatedText = value.slice(0, length + biggestWord);

    // .. now nibble ends till correct length
    while (truncatedText.length > length - ellipses.length) {
      const lastSpace = truncatedText.lastIndexOf(' ');

      if (lastSpace === -1) {
        break;
      }

      truncatedText = truncatedText.slice(0, lastSpace).replace(/[!,.?;:]$/, '');
    }

    return truncatedText + ellipses;
  }


}
