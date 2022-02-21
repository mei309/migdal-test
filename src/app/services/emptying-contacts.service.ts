import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// for calls made by the contact summary to delete contacts
@Injectable({
  providedIn: 'root',
})
export class EmptyingContactsService {
  private subjectInfo = new Subject<boolean>();

  constructor() {}

  amountChange(clearAll: boolean): void {
    this.subjectInfo.next(clearAll);
  }

  clearAllSubscribe(): Observable<boolean> {
    return this.subjectInfo.asObservable();
  }

}
