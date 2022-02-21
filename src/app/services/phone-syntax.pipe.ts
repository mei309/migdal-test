import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'phoneSyntaxPipe'
})
export class PhoneSyntaxPipe implements PipeTransform {

    transform(rawNum: number) {
      // i didnt know if the zero required is only in case that we dont have and if i should always leave 10 numbers
      // but since they all the same in practice i just implemented it to add to 11 numbers
      return "0" + rawNum.toString().slice(0, 2) +'-'+ rawNum.toString().slice(2)

    }
}
