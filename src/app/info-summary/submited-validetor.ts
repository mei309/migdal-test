import { AbstractControl, ValidationErrors } from '@angular/forms';
import { TypesListenerService } from '../services/types-connection.service';

export const contactsTypes = (service: TypesListenerService) => {

  return (control: AbstractControl): ValidationErrors | null => {
    let v: number = +control.value?.code;
    if (service.checkInfoType(v)) {
      return null
    }

    return { 'noContactType': true };
  }
}

