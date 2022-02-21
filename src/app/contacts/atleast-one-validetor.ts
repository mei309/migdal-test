import { AbstractControl, ValidationErrors, FormArray, FormGroup } from "@angular/forms";

export const atLeastOneRequired = (fieldName: string) => {
  return (formValue: AbstractControl): ValidationErrors | null => {
    const controls = Object.values((formValue as FormArray).controls);
    let legal = controls.some(fa => {
      if((fa as FormGroup).get(fieldName)?.value) {
        return true;
      } else {
        return false;
      }
    });
    return legal? null : {atLeastOneRequired: true}
  }
}
