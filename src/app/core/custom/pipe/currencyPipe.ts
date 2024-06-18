import { Pipe } from '@angular/core';

@Pipe({
  name: 'indCurrencyFormat',
  standalone:true
})

export class IndCurrencyFormat {
  transform(
    value: number,
    currencySign: string = '₹',
    decimalLength: number = 2,
    chunkDelimiter: string = ',',
    decimalDelimiter: string = '.',
    chunkLength: number = 2,
  ): string {
    let result = '\\d(?=(\\d{' + chunkLength + '})+' + '\\D' + ')';

    let res =
      '\\d(?=(\\d{3})+\\D' +
      ')';
    let num = value?.toFixed(Math.max(0, ~~decimalLength));

    let b =
      (decimalDelimiter ? num?.replace('.', decimalDelimiter) : num)?.replace(
        new RegExp(res, 'g'),
        '$&' + chunkDelimiter
      );

    let i = b?.lastIndexOf(',');

    let c = b?.split(',');

    let v = '';

    for (let i = 0; i < c?.length - 1; i++) {
      v = v + c[i];
    }
    let num2 = parseInt(v)?.toFixed(Math.max(0, ~~decimalLength));
    // let num3 = parseInt(c[c?.length - 1])?.toFixed(Math.max(0, ~~decimalLength));
    let a = num2?.replace(new RegExp(result, 'g'), '$&' + chunkDelimiter);

    let a2 = b?.slice(i);

    let format;
    if (i >= 0) {
      format = a?.replace('.00', '') + a2;
    } else {
      format = b;
    }

    return currencySign+format;
  }
}