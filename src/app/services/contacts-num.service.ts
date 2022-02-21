import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// for the amount of contacts that is displayed in contact summary
@Injectable({
  providedIn: 'root',
})
export class ContacsNumService {
  private subjectInfo = new BehaviorSubject<number>(0);

  constructor() {}

  amountChange(amount: number): void {
    this.subjectInfo.next(amount);
  }

  amountSubscribe(): Observable<number> {
    return this.subjectInfo.asObservable();
  }

}
