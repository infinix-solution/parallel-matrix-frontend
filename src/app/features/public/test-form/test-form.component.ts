import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { PageConfig, DynamicFormField } from '../../../core/models';
import { DynFieldComponent } from '../../../shared/dyn-field/dyn-field.component';

@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynFieldComponent],
  template: `
    <div class="tf-shell">
      <div class="tf-card" *ngIf="config">
        <button class="tf-close" (click)="goHome()" aria-label="Close">&times;</button>

        <div class="tf-head">
          <h1 class="tf-title">{{ config.pageLayout.title }}</h1>
          <p class="tf-desc">{{ config.pageLayout.description }}</p>
        </div>

        <div class="tf-body" [class.tf-has-img]="hasImages()">
          <div class="tf-img-col" *ngIf="hasImages()">
            <img *ngIf="config.pageLayout.heroImage" [src]="config.pageLayout.heroImage" alt="Hero" class="tf-hero">
            <img *ngIf="config.pageLayout.sidebarImage" [src]="config.pageLayout.sidebarImage" alt="Sidebar" class="tf-side">
          </div>

          <form class="tf-form" [formGroup]="form" (ngSubmit)="submit()" *ngIf="fields.length > 0">
            <div class="tf-grid">
              <app-dyn-field *ngFor="let f of fields"
                             [field]="f"
                             [group]="form"
                             [showLabel]="false"
                             [class.tf-full]="f.type === 'textarea'"></app-dyn-field>
            </div>
            <button type="submit" class="tf-submit" [disabled]="loading">
              {{ loading ? 'Submitting...' : 'Submit' }}
            </button>
          </form>

          <div *ngIf="fields.length === 0" class="tf-empty">
            No form fields configured yet. Visit <a href="/admin">/admin</a> &rarr; Page Builder &rarr; HR or Candidate tab to add fields, OR configure under the "Test Page Layout" if you want a standalone test form here.
          </div>
        </div>
      </div>

      <div class="tf-card" *ngIf="!config && !error">
        <div class="tf-empty">Loading configuration...</div>
      </div>
      <div class="tf-card" *ngIf="error">
        <div class="tf-empty">Could not load configuration. Is the backend running on :3000?</div>
      </div>
    </div>
  `,
  styles: [`
    .tf-shell { min-height:100vh; background:linear-gradient(135deg,#0a1f44 0%,#0b3a8c 50%,#1857c4 100%); padding:40px 16px; display:flex; align-items:flex-start; justify-content:center; }
    .tf-card { background:#fdf6e6; border-radius:16px; max-width:1040px; width:100%; padding:48px 40px; box-shadow:0 30px 80px -20px rgba(0,0,0,.5); position:relative; }
    .tf-close { position:absolute; top:18px; right:18px; width:36px; height:36px; border-radius:50%; background:transparent; border:1.5px solid #0b1226; color:#0b1226; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .2s; }
    .tf-close:hover { background:rgba(0,0,0,.06); }
    .tf-head { text-align:center; margin-bottom:32px; }
    .tf-title { font-family:'Sora',sans-serif; font-size:clamp(20px,3.4vw,28px); color:#0b1226; margin:0 0 12px; line-height:1.3; letter-spacing:-.01em; }
    .tf-desc { color:#3a4761; font-size:15px; max-width:720px; margin:0 auto; line-height:1.5; }
    .tf-body { display:grid; grid-template-columns:1fr; gap:28px; align-items:start; }
    .tf-body.tf-has-img { grid-template-columns:280px 1fr; }
    .tf-img-col { display:flex; flex-direction:column; gap:16px; }
    .tf-img-col img { width:100%; border-radius:12px; object-fit:cover; box-shadow:0 8px 24px -10px rgba(0,0,0,.25); }
    .tf-hero { aspect-ratio:1/1; }
    .tf-side { aspect-ratio:4/3; }
    .tf-form { width:100%; }
    .tf-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px 20px; margin-bottom:28px; }
    .tf-grid .tf-full { grid-column:1 / -1; }
    .tf-grid ::ng-deep .field input,
    .tf-grid ::ng-deep .field select,
    .tf-grid ::ng-deep .field textarea {
      width:100%; padding:18px 20px; border:1.5px solid #e5ecf6; border-radius:8px;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; background:#fff; color:#0b1226;
      transition:border-color .2s, box-shadow .2s;
    }
    .tf-grid ::ng-deep .field input:focus,
    .tf-grid ::ng-deep .field select:focus,
    .tf-grid ::ng-deep .field textarea:focus {
      outline:none; border-color:#1857c4; box-shadow:0 0 0 4px rgba(24,87,196,.1);
    }
    .tf-grid ::ng-deep .field input::placeholder,
    .tf-grid ::ng-deep .field textarea::placeholder { color:#0b1226; opacity:.85; }
    .tf-grid ::ng-deep .field { margin-bottom:0; }
    .tf-grid ::ng-deep .field .err { color:#dc2626; font-size:12.5px; margin-top:6px; font-weight:600; }
    .tf-submit { background:#ffd84d; color:#0b1226; border:none; padding:14px 38px; border-radius:8px; font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:15px; cursor:pointer; display:block; margin:0 auto; transition:transform .2s, box-shadow .2s; }
    .tf-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 24px -8px rgba(255,216,77,.6); }
    .tf-submit:disabled { opacity:.6; cursor:not-allowed; }
    .tf-empty { text-align:center; color:#5b6b8c; padding:40px 0; }
    .tf-empty a { color:#1857c4; font-weight:700; }
    @media (max-width:760px) {
      .tf-card { padding:36px 22px; }
      .tf-body.tf-has-img { grid-template-columns:1fr; }
      .tf-grid { grid-template-columns:1fr; }
      .tf-img-col { flex-direction:row; }
      .tf-img-col img { aspect-ratio:1/1; }
    }
  `]
})
export class TestFormComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  config: PageConfig | null = null;
  fields: DynamicFormField[] = [];
  form: FormGroup = this.fb.group({});
  loading = false;
  error = false;

  ngOnInit() {
    this.api.getPageConfig().subscribe({
      next: r => {
        if (r?.success && r.data) {
          this.config = r.data;
          // Prefer legacy formFields if present; otherwise reuse HR form
          const fields = (r.data.formFields && r.data.formFields.length > 0)
            ? r.data.formFields
            : (r.data.hrForm?.fields || []);
          this.fields = fields;
          this.buildForm(fields);
        }
      },
      error: () => { this.error = true; }
    });
  }

  hasImages(): boolean {
    return !!(this.config?.pageLayout?.heroImage || this.config?.pageLayout?.sidebarImage);
  }

  buildForm(fields: DynamicFormField[]) {
    const group: { [k: string]: any } = {};
    for (const f of fields) {
      const validators = [];
      if (f.required) validators.push(Validators.required);
      if (f.type === 'email') validators.push(Validators.email);
      if (f.minLength) validators.push(Validators.minLength(f.minLength));
      if (f.maxLength) validators.push(Validators.maxLength(f.maxLength));
      if (f.min !== null && f.min !== undefined) validators.push(Validators.min(f.min));
      if (f.max !== null && f.max !== undefined) validators.push(Validators.max(f.max));
      if (f.pattern) validators.push(Validators.pattern(new RegExp(f.pattern)));
      group[f.id] = ['', validators];
    }
    this.form = this.fb.group(group);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Please fill all required fields correctly.', 'err');
      return;
    }
    this.loading = true;
    console.log('Test form submission:', this.form.value);
    setTimeout(() => {
      this.toast.show('Form submitted successfully!');
      this.form.reset();
      this.loading = false;
    }, 600);
  }

  goHome() { window.location.href = '/'; }
}
