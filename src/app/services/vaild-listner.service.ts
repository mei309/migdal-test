import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, Subject } from 'rxjs';
// checks the validation of both forms and returns a listener
@Injectable({
  providedIn: 'root',
})
export class VaildListenerService {
  private subjectInfo = new Subject<boolean>();
  private subjectContacts = new Subject<boolean>();

  constructor() {}

  infoChange(state: string): void {
    this.subjectInfo.next(state === 'VALID');
  }

  contactsChange(state: string): void {
    this.subjectContacts.next(state === 'VALID');
  }

  isVaild(): Observable<any> {
    return combineLatest([this.subjectInfo, this.subjectContacts]).pipe(
      map(([first, second]) => first && second),
    );
  }
}
