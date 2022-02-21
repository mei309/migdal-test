import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { claimCause, injuryType, submitedBy, submitionMethod, superClaimType } from '../dropdowns';
import { TypesListenerService } from '../services/types-connection.service';
import { VaildListenerService } from '../services/vaild-listner.service';
import { contactsTypes } from './submited-validetor';
@Component({
  selector: 'app-info-summary',
  templateUrl: './info-summary.component.html'
})
export class InfoSummaryComponent implements OnInit {
  // i didnt know if its part of the form or not but since it dose not make a difference i left it out
  @Input() insured: any;
  // for unsubscribe from all subscriptions together
  notifier = new Subject();

  // its not part of the interface so on init i left empty
  insuranceForm = new FormGroup({
    superClaimType: new FormControl(null, [Validators.required]),
    eventDate: new FormControl('', [Validators.required]),
    claimCause: new FormControl(null, [Validators.required]),
    injuryType: new FormControl(null),
    submitedBy: new FormControl(null, [Validators.required, contactsTypes(this.typesListener)]),
    submitionMethod: new FormControl(null),
  });



  // just it should be more dynamic even so its not necessary in this case
  insuranceFields = [
    {
      type: 'select',
      name: 'superClaimType',
      label: 'סוג תביעת על',
      options: superClaimType,
      error: 'סוג תביעת על נדרש',
    },
    {
      type: 'date',
      name: 'eventDate',
      label: 'תאריך אירוע',
      error: 'תאריך אירוע נדרש'
    },
    {
      type: 'select',
      name: 'claimCause',
      label: 'סיבת אירוע',
      options: claimCause,
      error: 'סיבת אירוע נדרש',
    },
    {
      type: 'select',
      name: 'injuryType',
      label: 'מהות אירוע',
      options: injuryType,
      error: 'מהות אירוע נדרש',
    },
    {
      type: 'select',
      name: 'submitedBy',
      label: 'הוגשה באמצעות',
      options: submitedBy,
      error: 'הוגשה באמצעות נדרש',
    },
    {
      type: 'select',
      name: 'submitionMethod',
      label: 'אופן קבלת התביעה',
      options: submitionMethod
    }
  ];


  constructor(private vaildListenerService: VaildListenerService, private typesListener: TypesListenerService) { }

  ngOnInit(): void {
    // making injuryType depend on claimCause
    this.insuranceForm.get('claimCause')?.valueChanges.pipe(takeUntil(this.notifier)).subscribe(a => {
      if(a && !this.insuranceForm.get('injuryType')?.hasValidator(Validators.required)) {
        this.insuranceForm.get('injuryType')?.setValidators([Validators.required]);
        this.insuranceForm.get('injuryType')?.updateValueAndValidity();
      } else if(!a && this.insuranceForm.get('injuryType')?.hasValidator(Validators.required)) {
        this.insuranceForm.get('injuryType')?.setValidators([]);
        this.insuranceForm.get('injuryType')?.updateValueAndValidity();
      }
    });
    // because it dose not fire on init and in case its valid
    this.vaildListenerService.infoChange(this.insuranceForm.status);
    this.insuranceForm.statusChanges.pipe(takeUntil(this.notifier)).subscribe(b => this.vaildListenerService.infoChange(b));
    // need to update since the types in contacts changed
    this.typesListener.contactsChangeObserver.pipe(takeUntil(this.notifier)).subscribe(a => {
      this.insuranceForm.get('submitedBy')?.updateValueAndValidity();
    });
    this.insuranceForm.get('submitedBy').valueChanges.pipe(distinctUntilChanged(), takeUntil(this.notifier)).subscribe(c => {
      if(c) {
        this.typesListener.setInfoType(c.code);
      }
    })
  }

  resetForm() {
    this.insuranceForm.reset();
    this.typesListener.setInfoType(null);
  }

  get value() {
    return this.insuranceForm.value;
  }

  ngOnDestroy() {
    this.notifier.next(null);
    this.notifier.complete();
  }

}
