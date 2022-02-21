import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { submitedBy } from '../dropdowns';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { VaildListenerService } from '../services/vaild-listner.service';
import { atLeastOneRequired } from './atleast-one-validetor';
import { pairwise, startWith, Subject, takeUntil } from 'rxjs';
import { TypesListenerService } from '../services/types-connection.service';
import { ContacsNumService } from '../services/contacts-num.service';
import { EmptyingContactsService } from '../services/emptying-contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
})
export class ContactsComponent implements OnInit {
  // init contacts
  @Input() contactPersons!: any[];
  // for unsubscribe from all subscriptions together
  notifier = new Subject();
  faPlus = faPlus;
  contactsinfo!: FormGroup;
  // i used this in case someone puts an invaild group
  notVaildMessage: string = '';

  // just it should be more dynamic even so its not necessary in this case
  contactFields = [
    {
      type: 'input',
      name: 'name',
      label: 'שם איש קשר',
      validations: [
        {
          name: 'required',
          massage: 'שם איש קשר נדרש'
        },
        {
          name: 'pattern',
          massage: 'שם איש קשר חייב להיות בעברית'
        }
      ]
    },
    {
      type: 'select',
      name: 'type',
      label: 'סוג',
      options: submitedBy,
      validations: [
        {
          name: 'required',
          massage: 'סוג נדרש'
        }
      ]
    },
    {
      type: 'input',
      name: 'address',
      label: 'כתובת',
    },
    {
      type: 'number',
      name: 'phoneNumber',
      label: 'טלפון',
      validations: [
        {
          name: 'required',
          massage: 'טלפון נדרש'
        },
        {
          name: 'pattern',
          massage: 'טלפון צריך להיות רק מספרים, 10 ספרות'
        }
      ]
    },
    {
      type: 'input',
      name: 'email',
      label: 'דוא"ל',
      validations: [
        {
          name: 'email',
          massage: 'דוא"ל לא תקין'
        }
      ]
    }
  ];

  constructor(private fb: FormBuilder, private vaildListenerService: VaildListenerService,
    private typesListener: TypesListenerService, private contacsNum: ContacsNumService, private emptyingContacts: EmptyingContactsService){}
  ngOnInit()
  {
    this.contactsinfo = this.fb.group({
      contactRows: this.fb.array([], [atLeastOneRequired('deliveryFlag')])
    });
    // addes the initial types because i dont run valuechanges on not editable stuff
    const submitedBy = [];
    this.contactPersons.forEach(ele => {
      submitedBy.push(ele.type.code);
      this.addRow(ele, false);
    });
    this.typesListener.addContactTypes(submitedBy);
    // because it dose not fire on init and in case its valid
    this.vaildListenerService.contactsChange(this.contactsinfo.status);
    this.contactsinfo.statusChanges.pipe(takeUntil(this.notifier)).subscribe(b => this.vaildListenerService.contactsChange(b));
    // because it dose not fire on init and in case we have some already
    this.contacsNum.amountChange(this.contactRows.length);

    this.emptyingContacts.clearAllSubscribe().pipe(takeUntil(this.notifier)).subscribe(all => {
      if(all) {
        this.resetForm();
      } else {
        // deletes all types because now they arent in the contacts
        this.typesListener.initContactTypes();
        let tempRow;
        // i didnt know if i need to leave all the rows with the flag but if we need
        // we can loop from the end and remove with removeAt (theres more ways to do it)
        for (const iterator of this.contactRows.controls) {
          if(iterator.get('deliveryFlag').value) {
            tempRow = iterator;
            break;
          }
        }
        this.contactRows.clear();
        if(tempRow) {
          this.contacsNum.amountChange(1);
          this.typesListener.addContactTypes([tempRow.type?.code]);
          this.contactRows.push(tempRow);
        } else {
          this.contacsNum.amountChange(0);
        }
      }
    })
  }

  get contactRows() {
    return this.contactsinfo.controls["contactRows"] as FormArray;
  }

  get value() {
    return this.contactsinfo.value;
  }

  addRow(data: any, addNew: boolean) {
    const addRow = this.fb.group({
      deliveryFlag: [data.deliveryFlag],
      name: [data.name, [Validators.required, Validators.pattern(/^[א-ת\s]+$/)]],
      type: [submitedBy.find(a => a.code === data.type.code), [Validators.required]],
      address: [data.address],
      phoneNumber: [data.phoneNumber, [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      email: [data.email, [Validators.email]],
      add: [addNew]
    });
    this.contactRows.push(addRow);
    // if not its only on init and there i took care of it
    if(addNew) {
      addRow.get('type').valueChanges.pipe(startWith(1), pairwise(), takeUntil(this.notifier)).subscribe(([prevValue, selectedValue]: [any, any])  => {
        this.typesListener.changeContactTypes(selectedValue.code, prevValue.code);
      })
    }
  }

  addEmptyRow() {
    const addRow = {
      deliveryFlag: false,
      name: null,
      type: {code: null},
      address: null,
      phoneNumber: null,
      email: null
    }
    this.addRow(addRow, true);
    this.contacsNum.amountChange(this.contactRows.length);
  }

  // this is from the contact summary
  // i didnt add the fields like identity and age (it didnt seem necessary and its definitely easy to add)
  addExistingRow(basicInfo) {
    const addRow = {
      deliveryFlag: false,
      name: basicInfo.firstName+', '+basicInfo.lastName,
      type: {code: this.typesListener.getInfoType()},
      address: basicInfo.address.cityName+', '+basicInfo.address.streetName,
      phoneNumber: null,
      email: null
    }
    this.addRow(addRow, true);
    this.contacsNum.amountChange(this.contactRows.length);
  }


  // i didnt know what i need to do in case someone puts an invaild group so i didnt allow it and puts a message
  setViewOnly(index: number) {
    const rowGroup: FormGroup = this.contactRows.at(index) as FormGroup;
    if(rowGroup.valid) {
      rowGroup.get('add').setValue(false);
    } else {
      this.notVaildMessage = 'השדות אינם חוקיים';
      setTimeout(() => {
        this.notVaildMessage = '';
      }, 4000);
    }
  }


  resetForm() {
    this.contactRows.clear();
    this.contactRows.reset();
    this.contacsNum.amountChange(0);
    this.typesListener.initContactTypes();
  }

  ngOnDestroy() {
    this.notifier.next(null);
    this.notifier.complete();
  }
}
