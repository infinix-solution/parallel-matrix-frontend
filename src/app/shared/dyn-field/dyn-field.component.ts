import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { DynamicFormField } from '../../core/models';

@Component({
  selector: 'app-dyn-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dyn-field.component.html'
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
