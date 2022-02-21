import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContacsNumService } from '../services/contacts-num.service';
import { EmptyingContactsService } from '../services/emptying-contacts.service';

@Component({
  selector: 'app-contacts-summary',
  templateUrl: './contacts-summary.component.html'
})
export class ContactsSummaryComponent implements OnInit {
  // this i did this way since i thought its better not to pass the details for  this from the parent
  @Output() addRowExisting: EventEmitter<boolean> = new EventEmitter();
  // for unsubscribe
  subscription: Subscription;
  amountOfContacts;

  constructor(private contacsNum: ContacsNumService, private emptyingContacts: EmptyingContactsService) { }

  ngOnInit(): void {
    this.subscription = this.contacsNum.amountSubscribe().subscribe(num => {
      this.amountOfContacts = num
    });
  }

  addRow() {
    this.addRowExisting.emit(true);
  }

  // i used the same listener for both buttons
  deleteContacts(deleteAll: boolean) {
    this.emptyingContacts.amountChange(deleteAll);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
