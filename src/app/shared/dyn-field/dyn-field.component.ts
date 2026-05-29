import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { DynamicFormField } from '../../core/models';

@Component({
  selector: 'app-dyn-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="field" [formGroup]="group">
      <label *ngIf="showLabel">
        {{ field.label }}
        <span *ngIf="field.required" style="color:#dc2626">*</span>
      </label>

      <ng-container [ngSwitch]="field.type">
        <textarea *ngSwitchCase="'textarea'"
                  [formControlName]="field.id"
                  [placeholder]="field.placeholder || field.label"
                  rows="4"></textarea>

        <select *ngSwitchCase="'dropdown'" [formControlName]="field.id">
          <option value="" disabled>{{ field.placeholder || ('Select ' + field.label) }}</option>
          <option *ngFor="let opt of field.options" [value]="opt">{{ opt }}</option>
        </select>

        <div *ngSwitchCase="'file'">
          <input type="file"
                 [accept]="field.accept || '*'"
                 (change)="onFileChange($event)">
          <div *ngIf="fileName" style="margin-top:6px;font-size:12.5px;color:var(--mute)">
            📎 {{ fileName }} <span *ngIf="fileSizeKb">({{ fileSizeKb }} KB)</span>
          </div>
          <div *ngIf="field.accept" style="font-size:11.5px;color:var(--mute);margin-top:4px">
            Accepted: {{ field.accept }}<span *ngIf="field.maxFileSizeKb"> · Max {{ formatSize(field.maxFileSizeKb) }}</span>
          </div>
        </div>

        <input *ngSwitchDefault
               [type]="field.type"
               [formControlName]="field.id"
               [placeholder]="field.placeholder || field.label"
               [attr.maxlength]="field.maxLength || null"
               [attr.minlength]="field.minLength || null"
               [attr.min]="field.min ?? null"
               [attr.max]="field.max ?? null">
      </ng-container>

      <div class="err" *ngIf="ctrl && ctrl.touched && ctrl.errors as e">
        <ng-container *ngIf="e['required']">{{ field.label }} is required.</ng-container>
        <ng-container *ngIf="e['email']">Please enter a valid email address.</ng-container>
        <ng-container *ngIf="e['minlength']">Minimum {{ e['minlength'].requiredLength }} characters required.</ng-container>
        <ng-container *ngIf="e['maxlength']">Maximum {{ e['maxlength'].requiredLength }} characters allowed.</ng-container>
        <ng-container *ngIf="e['min']">Value must be at least {{ e['min'].min }}.</ng-container>
        <ng-container *ngIf="e['max']">Value must be at most {{ e['max'].max }}.</ng-container>
        <ng-container *ngIf="e['pattern']">{{ field.patternMessage || 'Invalid format.' }}</ng-container>
        <ng-container *ngIf="e['fileType']">File must be one of: {{ field.accept }}</ng-container>
        <ng-container *ngIf="e['fileSize']">File too large. Max {{ formatSize(field.maxFileSizeKb!) }}.</ng-container>
      </div>
    </div>
  `
})
export class DynFieldComponent {
  @Input({ required: true }) field!: DynamicFormField;
  @Input({ required: true }) group!: FormGroup;
  @Input() showLabel = false;

  fileName: string = '';
  fileSizeKb: number = 0;

  get ctrl(): AbstractControl | null {
    return this.group.get(this.field.id);
  }

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    const c = this.ctrl;
    if (!c) return;

    if (!file) {
      this.fileName = '';
      this.fileSizeKb = 0;
      c.setValue(null);
      c.markAsTouched();
      return;
    }

    // Validate file type against accept list
    if (this.field.accept) {
      const accepts = this.field.accept.split(',').map(s => s.trim().toLowerCase());
      const lower = file.name.toLowerCase();
      const ok = accepts.some(a => lower.endsWith(a.replace('*', '')));
      if (!ok) {
        c.setErrors({ fileType: true });
        c.markAsTouched();
        this.fileName = file.name;
        this.fileSizeKb = Math.round(file.size / 1024);
        return;
      }
    }

    // Validate file size
    if (this.field.maxFileSizeKb && file.size > this.field.maxFileSizeKb * 1024) {
      c.setErrors({ fileSize: true });
      c.markAsTouched();
      this.fileName = file.name;
      this.fileSizeKb = Math.round(file.size / 1024);
      return;
    }

    this.fileName = file.name;
    this.fileSizeKb = Math.round(file.size / 1024);
    c.setValue(file);
    c.setErrors(null);
    c.markAsTouched();
  }

  formatSize(kb: number): string {
    if (kb >= 1024) return (kb / 1024).toFixed(1) + ' MB';
    return kb + ' KB';
  }
}
