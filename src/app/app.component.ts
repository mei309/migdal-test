import { Component, ViewChild } from '@angular/core';
import { IProcess } from './IProcess';
import { iProcess } from './mock-i-process';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { InfoSummaryComponent } from './info-summary/info-summary.component';
import { ContactsComponent } from './contacts/contacts.component';
import { Subscription } from 'rxjs';
import { VaildListenerService } from './services/vaild-listner.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  // i didnt build the form in this component, so this is for refernce so we can get the value.
  // it was posibble to build it here(it would save a few listeners) but i think that wasnt the required
  @ViewChild(InfoSummaryComponent) infoSummary: InfoSummaryComponent;
  @ViewChild(ContactsComponent) contacts: ContactsComponent;
  faArrowLeft = faArrowLeft;
  process: IProcess = iProcess;
  // for unsubscribe
  subscription: Subscription;
  formVaild: boolean = false;



  constructor(private vaildListenerService: VaildListenerService) {
    // listens if the form is vaild
    this.subscription = this.vaildListenerService.isVaild()
      .subscribe((value) => this.formVaild = !value);
  }

  resetForm() {
    this.infoSummary.resetForm();
    this.contacts.resetForm();
  }

  printVaildForm(){
    console.log({insured: this.infoSummary.value, contactPersons: this.contacts.value.contactRows});
  }

  addRowExisting() {
    this.contacts.addExistingRow(this.process.insured);
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
