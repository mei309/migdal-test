import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// keeps track of the types in contacts form so we can update the validator in info form on change
// and also keeps the type of info form in case we add from existing
//  (no need a listener since it updates only if we have in the moment of creation)
@Injectable({
  providedIn: 'root',
})
export class TypesListenerService {
  private contactsChange = new Subject<boolean>();
  private infoType: number;
  contactsTypes: number[] = [];
  constructor() {}

  initContactTypes() {
    this.contactsTypes.splice(0, this.contactsTypes.length);
    this.contactsChange.next(true);
  }
  addContactTypes(contactsTypes: number[]): void {
    this.contactsTypes = this.contactsTypes.concat(contactsTypes);
    this.contactsChange.next(true);
  }

  changeContactTypes(add: number, remove: number): void {
    this.contactsTypes.push(add);
    if(this.contactsTypes.indexOf(remove) !== -1) {
      this.contactsTypes.splice(this.contactsTypes.indexOf(remove), 1);
    }
    this.contactsChange.next(true);
  }

  get contactsChangeObserver(): Observable<boolean> {
    return this.contactsChange.asObservable();
  }

  setInfoType(type: number) {
    this.infoType = type;
  }

  getInfoType(): number {
    return this.infoType;
  }

  // needed for the validetor of the info form
  checkInfoType(type: number) {
    return this.contactsTypes.includes(type);
  }

}
