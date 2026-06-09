import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { DynamicFormField } from '../../../core/models';

type SubTab = 'header' | 'hr' | 'candidate' | 'layout';

@Component({
  selector: 'app-tab-page-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="adm-panel">
      <h3>Dynamic Page Builder</h3>
      <p class="help">Edit the home-page "Get in Touch" section. Two forms (HR + Candidate) are rendered dynamically based on the fields you configure here.</p>

      <form [formGroup]="form" (ngSubmit)="save()">
        <div class="adm-tabs" style="margin:0 0 18px">
          <button type="button" [class.active]="sub==='header'"    (click)="sub='header'">📝 Section Header</button>
          <button type="button" [class.active]="sub==='hr'"        (click)="sub='hr'">🏢 HR Form</button>
          <button type="button" [class.active]="sub==='candidate'" (click)="sub='candidate'">🎓 Candidate Form</button>
        </div>

        <div *ngIf="sub==='header'" class="adm-card" formGroupName="sectionHeader">
          <strong style="display:block;margin-bottom:10px;color:var(--navy)">"Get in Touch" Section Header</strong>
          <div class="grid2">
            <div class="field"><label>Eyebrow</label><input formControlName="eyebrow"></div>
            <div class="field"><label>Title</label><input formControlName="title"></div>
          </div>
          <div class="field"><label>Subtitle</label><textarea formControlName="sub" rows="2"></textarea></div>
        </div>

        <ng-container *ngIf="sub==='hr'" formGroupName="hrForm">
          <div class="adm-card">
            <strong style="display:block;margin-bottom:10px;color:var(--navy)">HR / Employer Form Settings</strong>
            <div class="grid2">
              <div class="field"><label>Title</label><input formControlName="title"></div>
              <div class="field"><label>Subtitle</label><input formControlName="subtitle"></div>
              <div class="field">
                <label>FA Icon Class</label>
                <div style="display:flex;align-items:center;gap:8px">
                  <input formControlName="icon" placeholder="fa-solid fa-building-user" style="flex:1">
                  <span *ngIf="form.get('hrForm.icon')?.value?.startsWith('fa')"
                        style="width:36px;height:36px;background:var(--grad2);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;font-size:16px">
                    <i [class]="form.get('hrForm.icon')?.value" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
              <div class="field"><label>Submit Button Label</label><input formControlName="submitLabel"></div>
            </div>
          </div>

          <div class="adm-card" style="margin-top:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px">
              <strong style="color:var(--navy)">Fields ({{ hrFields.length }})</strong>
              <button type="button" class="adm-btn primary" (click)="addField('hr')">+ Add Field</button>
            </div>
            <div *ngIf="hrFields.length === 0" class="adm-empty">No fields yet. Click "+ Add Field" to start.</div>

            <div formArrayName="fields">
              <div *ngFor="let fg of hrFields.controls; let i = index" [formGroupName]="i" class="adm-card" style="background:#fff;margin-bottom:12px;border:1.5px solid #e5ecf6">
                <ng-container *ngTemplateOutlet="fieldEditor; context: { fg: fg, i: i, which: 'hr', total: hrFields.length }"></ng-container>
              </div>
            </div>
          </div>
        </ng-container>

        <ng-container *ngIf="sub==='candidate'" formGroupName="candidateForm">
          <div class="adm-card">
            <strong style="display:block;margin-bottom:10px;color:var(--navy)">Candidate Application Form Settings</strong>
            <div class="grid2">
              <div class="field"><label>Title</label><input formControlName="title"></div>
              <div class="field"><label>Subtitle</label><input formControlName="subtitle"></div>
              <div class="field">
                <label>FA Icon Class</label>
                <div style="display:flex;align-items:center;gap:8px">
                  <input formControlName="icon" placeholder="fa-solid fa-graduation-cap" style="flex:1">
                  <span *ngIf="form.get('candidateForm.icon')?.value?.startsWith('fa')"
                        style="width:36px;height:36px;background:var(--grad2);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;font-size:16px">
                    <i [class]="form.get('candidateForm.icon')?.value" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
              <div class="field"><label>Submit Button Label</label><input formControlName="submitLabel"></div>
            </div>
          </div>

          <div class="adm-card" style="margin-top:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px">
              <strong style="color:var(--navy)">Fields ({{ candFields.length }})</strong>
              <button type="button" class="adm-btn primary" (click)="addField('candidate')">+ Add Field</button>
            </div>
            <div *ngIf="candFields.length === 0" class="adm-empty">No fields yet. Click "+ Add Field" to start.</div>

            <div formArrayName="fields">
              <div *ngFor="let fg of candFields.controls; let i = index" [formGroupName]="i" class="adm-card" style="background:#fff;margin-bottom:12px;border:1.5px solid #e5ecf6">
                <ng-container *ngTemplateOutlet="fieldEditor; context: { fg: fg, i: i, which: 'candidate', total: candFields.length }"></ng-container>
              </div>
            </div>
          </div>
        </ng-container>

        <div class="adm-actions" style="margin-top:18px;position:sticky;bottom:0;background:#fff;padding:14px;border-radius:12px;box-shadow:0 -8px 20px -10px rgba(10,31,68,.15);z-index:5">
          <button type="submit" class="adm-btn primary" [disabled]="loading">
            {{ loading ? 'Saving...' : '💾 Save Changes' }}
          </button>
          <a class="adm-btn ghost" href="/#forms" target="_blank">Preview Home ↗</a>
        </div>
      </form>

      <!-- ================ SHARED FIELD EDITOR TEMPLATE ================ -->
      <ng-template #fieldEditor let-fg="fg" let-i="i" let-which="which" let-total="total">
        <div [formGroup]="fg">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:10px;flex-wrap:wrap">
            <span style="font-weight:700;color:var(--navy);font-size:14px">
              Field #{{ i + 1 }}
              <span style="color:var(--mute);font-weight:500;font-size:12px;margin-left:6px">id: {{ fg.get('id')?.value }}</span>
            </span>
            <div style="display:flex;gap:6px">
              <button type="button" class="adm-btn ghost" (click)="move(which, i, -1)" [disabled]="i === 0">↑</button>
              <button type="button" class="adm-btn ghost" (click)="move(which, i, 1)" [disabled]="i === total - 1">↓</button>
              <button type="button" class="adm-btn danger" (click)="remove(which, i)">Delete</button>
            </div>
          </div>

          <div class="grid2">
            <div class="field">
              <label>Field Label *</label>
              <input formControlName="label">
              <div class="err" *ngIf="fg.get('label')?.touched && fg.get('label')?.invalid">Label required.</div>
            </div>
            <div class="field">
              <label>Field ID *</label>
              <input formControlName="id">
            </div>
            <div class="field">
              <label>Input Type</label>
              <select formControlName="type" (change)="onTypeChange(which, i)">
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="tel">Phone</option>
                <option value="textarea">Long Text</option>
                <option value="dropdown">Dropdown</option>
                <option value="file">File Upload</option>
              </select>
            </div>
            <div class="field">
              <label>Placeholder</label>
              <input formControlName="placeholder">
            </div>
            <div class="field">
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;text-transform:none;letter-spacing:normal;font-size:13.5px;margin-top:24px">
                <input type="checkbox" formControlName="required" style="width:auto;margin:0">
                Required field
              </label>
            </div>
          </div>

          <!-- DROPDOWN OPTIONS -->
          <div *ngIf="fg.get('type')?.value === 'dropdown'" class="field" style="margin-top:8px">
            <label>Options (comma-separated) *</label>
            <input [value]="optionsToString(fg)" (input)="onOptionsInput($event, which, i)" placeholder="Option A, Option B, Option C">
            <div class="err" *ngIf="fg.get('options')?.value.length === 0">At least one option required.</div>
          </div>

          <!-- FILE: accept + max size -->
          <div *ngIf="fg.get('type')?.value === 'file'" class="grid2" style="margin-top:8px">
            <div class="field">
              <label>Accept (file extensions) *</label>
              <input formControlName="accept" placeholder=".pdf,.doc,.docx">
              <small style="color:var(--mute);font-size:11.5px">Comma-separated. Examples: <code>.pdf,.doc,.docx</code>, <code>.jpg,.png</code></small>
            </div>
            <div class="field">
              <label>Max File Size (KB)</label>
              <input type="number" formControlName="maxFileSizeKb" placeholder="e.g. 5120 = 5MB" min="1">
            </div>
          </div>

          <!-- TEXT: min/max length -->
          <div *ngIf="isTextType(fg.get('type')?.value)" class="grid2" style="margin-top:8px">
            <div class="field">
              <label>Max Length</label>
              <input type="number" formControlName="maxLength" min="1" placeholder="(optional)">
            </div>
            <div class="field">
              <label>Min Length</label>
              <input type="number" formControlName="minLength" min="1" placeholder="(optional)">
            </div>
          </div>

          <!-- NUMBER: min/max -->
          <div *ngIf="fg.get('type')?.value === 'number'" class="grid2" style="margin-top:8px">
            <div class="field">
              <label>Min Value</label>
              <input type="number" formControlName="min">
            </div>
            <div class="field">
              <label>Max Value</label>
              <input type="number" formControlName="max">
            </div>
          </div>

          <!-- TEXT/TEL: regex pattern -->
          <div *ngIf="fg.get('type')?.value === 'tel' || fg.get('type')?.value === 'text'" class="grid2" style="margin-top:8px">
            <div class="field">
              <label>Validation Pattern (regex)</label>
              <input formControlName="pattern" placeholder="e.g. ^[+]?[\\d\\s\\-()]{7,20}$">
            </div>
            <div class="field">
              <label>Pattern Error Message</label>
              <input formControlName="patternMessage" placeholder="e.g. Enter valid phone">
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class TabPageBuilderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);

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
        }
      },
      error: () => this.toast.show('Could not load configuration.', 'err')
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
      next: () => { this.toast.show('Configuration saved.'); this.loading = false; },
      error: err => { this.toast.show(err?.error?.message || 'Save failed.', 'err'); this.loading = false; }
    });
  }
}
