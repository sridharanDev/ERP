import { Injectable } from '@angular/core';
import {AbstractControl,FormControl,ValidationErrors} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorService {

  constructor() { }
  isEqual(forbiddenValue: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === forbiddenValue) {
        return { forbiddenValue: { value } };
      }
      return null;
    };
  }

  isNotEqual(forbiddenValue: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value !== forbiddenValue) {
        return { forbiddenValue: { value } };
      }
      return null;
    };
  }

  matchPassword(control: FormControl): ValidationErrors | null {
    const password = control.root.get('password');
    const confirmPassword = control.value;
  
    if (password && password.value !== confirmPassword) {
      return { passwordMismatch: true };
    }
  
    return null;
  }
  
}
