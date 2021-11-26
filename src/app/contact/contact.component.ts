import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

interface Map {
  [key: string]: string
}

interface Map2 {
  [key: string]: {
    [key: string]: string
  }
}


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  feedbackForm!: FormGroup;
  feedback!: Feedback;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective!: any;
  constructor(private fb: FormBuilder) {
    this.createForm();
  }



  formErrors: Map = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages: Map2 = {
    'firstname': {
      'required': 'First Name is required',
      'minlength': 'First Name must be atleasr 2 charactors long.',
      'maxlength': 'First Name cannot be 25 charactors long.'
    },
    'lastname': {
      'required': 'Last Name is required',
      'minlength': 'Last Name must be atleasr 2 charactors long.',
      'maxlength': 'Last Name cannot be 25 charactors long.'
    },
    'telnum': {
      'required': 'Tel. number is required.',
      'pattern': 'Tel. number must contain numbers.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email not in valid format.'
    }
  };

  ngOnInit(): void { }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: '',
    });

    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged() // reset validation messages now
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: '',
    });
    this.feedbackFormDirective.resetForm();
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error messages (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
