import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { DynamicFormField } from '../../../core/models';

type SubTab = 'header' | 'hr' | 'candidate' | 'layout';

@Component({
  selector: 'app-tab-page-builder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tab-page-builder.component.html'
})
export class TabPageBuilderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  sub: SubTab = 'hr';
  loading = false;

  form: FormGroup = this.fb.group({
    sectionHeader: this.fb.group({
      eyebrow: [''], title: [''], sub: ['']
    }),
    pageLayout: this.fb.group({
      title: [''], description: [''], heroImage: [''], sidebarImage: ['']
    }),
    hrForm: this.fb.group({
      title: [''], subtitle: [''], icon: [''], submitLabel: ['Send Enquiry'],
      fields: this.fb.array([])
    }),
    candidateForm: this.fb.group({
      title: [''], subtitle: [''], icon: [''], submitLabel: ['Apply Now'],
      fields: this.fb.array([])
    })
  });

  get hrFields(): FormArray { return this.form.get('hrForm.fields') as FormArray; }
  get candFields(): FormArray { return this.form.get('candidateForm.fields') as FormArray; }

  ngOnInit() { this.load(); }

  load() {
    this.api.getPageConfig().subscribe({
      next: r => {
        if (r?.success && r.data) {
          const d = r.data;
          if (d.sectionHeader) this.form.patchValue({ sectionHeader: d.sectionHeader });
          if (d.pageLayout) this.form.patchValue({ pageLayout: d.pageLayout });
          if (d.hrForm) {
            this.form.get('hrForm')!.patchValue({
              title: d.hrForm.title || '', subtitle: d.hrForm.subtitle || '',
              icon: d.hrForm.icon || '', submitLabel: d.hrForm.submitLabel || 'Send Enquiry'
            });
            this.hrFields.clear();
            (d.hrForm.fields || []).forEach(f => this.hrFields.push(this.toFieldGroup(f)));
          }
          if (d.candidateForm) {
            this.form.get('candidateForm')!.patchValue({
              title: d.candidateForm.title || '', subtitle: d.candidateForm.subtitle || '',
              icon: d.candidateForm.icon || '', submitLabel: d.candidateForm.submitLabel || 'Apply Now'
            });
            this.candFields.clear();
            (d.candidateForm.fields || []).forEach(f => this.candFields.push(this.toFieldGroup(f)));
          }
          this.cdr.markForCheck();
      }},
      error: () => { this.toast.show('Could not load configuration.', 'err'); this.cdr.markForCheck(); }
    });
  }

  toFieldGroup(f: Partial<DynamicFormField> = {}): FormGroup {
    return this.fb.group({
      id: [f.id || this.genId(), Validators.required],
      label: [f.label || '', Validators.required],
      type: [f.type || 'text'],
      required: [f.required ?? false],
      placeholder: [f.placeholder || ''],
      options: [f.options || []],
      minLength: [f.minLength ?? null],
      maxLength: [f.maxLength ?? null],
      min: [f.min ?? null],
      max: [f.max ?? null],
      pattern: [f.pattern || ''],
      patternMessage: [f.patternMessage || ''],
      accept: [f.accept || ''],
      maxFileSizeKb: [f.maxFileSizeKb ?? null]
    });
  }

  genId(): string { return 'f_' + Math.random().toString(36).slice(2, 8); }

  isTextType(t: string): boolean {
    return t === 'text' || t === 'textarea' || t === 'email' || t === 'tel';
  }

  faOf(which: 'hr' | 'candidate'): FormArray {
    return which === 'hr' ? this.hrFields : this.candFields;
  }

  addField(which: 'hr' | 'candidate') {
    this.faOf(which).push(this.toFieldGroup({ type: 'text', required: false }));
    this.toast.show('Field added — configure it below.');
  }

  remove(which: 'hr' | 'candidate', i: number) {
    if (!confirm('Delete this field?')) return;
    this.faOf(which).removeAt(i);
  }

  move(which: 'hr' | 'candidate', i: number, dir: number) {
    const fa = this.faOf(which);
    const ni = i + dir;
    if (ni < 0 || ni >= fa.length) return;
    const c = fa.at(i);
    fa.removeAt(i);
    fa.insert(ni, c);
  }

  onTypeChange(which: 'hr' | 'candidate', i: number) {
    const fg = this.faOf(which).at(i) as FormGroup;
    const t = fg.get('type')?.value;
    if (t !== 'dropdown') fg.patchValue({ options: [] });
    // Auto-set sensible defaults for file
    if (t === 'file' && !fg.get('accept')?.value) {
      fg.patchValue({ accept: '.pdf,.doc,.docx', maxFileSizeKb: 5120 });
    }
  }

  optionsToString(fg: any): string {
    const opts = fg.get('options')?.value || [];
    return Array.isArray(opts) ? opts.join(', ') : '';
  }

  onOptionsInput(e: Event, which: 'hr' | 'candidate', i: number) {
    const value = (e.target as HTMLInputElement).value;
    const opts = value.split(',').map(s => s.trim()).filter(Boolean);
    (this.faOf(which).at(i) as FormGroup).patchValue({ options: opts });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Please fix the errors before saving.', 'err');
      return;
    }
    const check = (arr: FormArray, name: string): string | null => {
      for (let i = 0; i < arr.length; i++) {
        const f = arr.at(i).value;
        if (f.type === 'dropdown' && (!f.options || f.options.length === 0)) {
          return `${name}: field "${f.label}" needs at least one option.`;
        }
        if (f.type === 'file' && !f.accept) {
          return `${name}: file field "${f.label}" needs an Accept value (e.g. .pdf,.doc,.docx).`;
        }
      }
      return null;
    };
    const hrErr = check(this.hrFields, 'HR form');
    if (hrErr) { this.toast.show(hrErr, 'err'); this.sub = 'hr'; return; }
    const candErr = check(this.candFields, 'Candidate form');
    if (candErr) { this.toast.show(candErr, 'err'); this.sub = 'candidate'; return; }

    this.loading = true;
    this.api.updatePageConfig(this.form.value as any).subscribe({
      next: () => { this.toast.show('Configuration saved.'); this.loading = false; this.cdr.markForCheck(); },
      error: err => { this.toast.show(err?.error?.message || 'Save failed.', 'err'); this.loading = false; this.cdr.markForCheck(); }
    });
  }
}
