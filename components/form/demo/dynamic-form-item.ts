import { Component, OnInit } from '@angular/core';
import { FormControl, FormRecord, NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'nz-demo-form-dynamic-form-item',
  template: `
    <form nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item *ngFor="let control of listOfControl; let i = index">
        <nz-form-label [nzXs]="24" [nzSm]="4" *ngIf="i === 0" [nzFor]="control.controlInstance">
          Passengers
        </nz-form-label>
        <nz-form-control
          [nzXs]="24"
          [nzSm]="20"
          [nzOffset]="i === 0 ? 0 : 4"
          nzErrorTip="Please input passenger's name or delete this field."
        >
          <input
            class="passenger-input"
            nz-input
            placeholder="placeholder"
            [attr.id]="control.id"
            [formControlName]="control.controlInstance"
          />
          <span
            nz-icon
            nzType="minus-circle-o"
            class="dynamic-delete-button"
            (click)="removeField(control, $event)"
          ></span>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control [nzXs]="{ span: 24, offset: 0 }" [nzSm]="{ span: 20, offset: 4 }">
          <button nz-button nzType="dashed" class="add-button" (click)="addField($event)">
            <span nz-icon nzType="plus"></span>
            Add field
          </button>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control [nzXs]="{ span: 24, offset: 0 }" [nzSm]="{ span: 20, offset: 4 }">
          <button nz-button nzType="primary">Submit</button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,

  styles: [
    `
      .dynamic-delete-button {
        cursor: pointer;
        position: relative;
        top: 4px;
        font-size: 24px;
        color: #999;
        transition: all 0.3s;
      }

      .dynamic-delete-button:hover {
        color: #777;
      }

      .passenger-input {
        width: 60%;
        margin-right: 8px;
      }

      [nz-form] {
        max-width: 600px;
      }

      .add-button {
        width: 60%;
      }
    `
  ]
})
export class NzDemoFormDynamicFormItemComponent implements OnInit {
  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  listOfControl: Array<{ id: number; controlInstance: string }> = [];

  addField(e?: MouseEvent): void {
    e?.preventDefault();

    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `passenger${id}`
    };
    const index = this.listOfControl.push(control);
    console.log(this.listOfControl[this.listOfControl.length - 1]);
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      this.fb.control('', Validators.required)
    );
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log(this.listOfControl);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.addField();
  }
}
