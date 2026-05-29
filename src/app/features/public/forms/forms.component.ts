import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { DynamicFormField, FormSection, PageConfig, SectionHeader } from '../../../core/models';
import { DynFieldComponent } from '../../../shared/dyn-field/dyn-field.component';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynFieldComponent],
  template: `
    <section id="forms">
      <div class="container">
        <div class="s-head reveal in">
          <span class="eyebrow">{{ header.eyebrow }}</span>
          <h2 class="s-title">{{ header.title }}</h2>
          <p class="s-sub">{{ header.sub }}</p>
        </div>

        <div *ngIf="loadError" style="text-align:center;padding:20px;background:#fee2e2;border-radius:12px;margin-bottom:20px;color:#b91c1c">
          ⚠ Could not load form configuration. Configure it under <a href="/admin" style="font-weight:700">/admin</a> → Page Builder.
        </div>

        <div class="forms-grid" *ngIf="!loading">
          <form class="form-card reveal in" [formGroup]="hrForm" (ngSubmit)="submitHr()" *ngIf="hrSection && hrSection.fields.length > 0">
            <div class="top">
              <div class="ic">{{ hrSection.icon || '🏢' }}</div>
              <div>
                <h3>{{ hrSection.title }}</h3>
                <div class="lead">{{ hrSection.subtitle }}</div>
              </div>
            </div>
            <app-dyn-field *ngFor="let f of hrSection.fields"
                           [field]="f"
                           [group]="hrForm"
                           [showLabel]="true"></app-dyn-field>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center" [disabled]="hrLoading">
              {{ hrLoading ? 'Sending...' : (hrSection.submitLabel || 'Send Enquiry') + ' →' }}
            </button>
          </form>

          <form class="form-card reveal in" [formGroup]="candForm" (ngSubmit)="submitCand()" *ngIf="candSection && candSection.fields.length > 0">
            <div class="top">
              <div class="ic">{{ candSection.icon || '🎓' }}</div>
              <div>
                <h3>{{ candSection.title }}</h3>
                <div class="lead">{{ candSection.subtitle }}</div>
              </div>
            </div>
            <app-dyn-field *ngFor="let f of candSection.fields"
                           [field]="f"
                           [group]="candForm"
                           [showLabel]="true"></app-dyn-field>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center" [disabled]="candLoading">
              {{ candLoading ? 'Submitting...' : (candSection.submitLabel || 'Apply Now') + ' →' }}
            </button>
          </form>
        </div>

        <div *ngIf="loading" style="text-align:center;padding:40px;color:var(--mute)">Loading forms...</div>
      </div>
    </section>
  `
})
export class FormsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  hrLoading = false;
  candLoading = false;
  loading = true;
  loadError = false;

  header: SectionHeader = {
    eyebrow: 'Get in touch',
    title: 'Two doors. One mission.',
    sub: "Hiring? Applying? Pick your form and we'll respond within 24 hours."
  };

  hrSection: FormSection | null = null;
  candSection: FormSection | null = null;

  hrForm: FormGroup = this.fb.group({});
  candForm: FormGroup = this.fb.group({});

  ngOnInit() {
    this.api.getPageConfig().subscribe({
      next: r => {
        if (r?.success && r.data) {
          const cfg: PageConfig = r.data;
          if (cfg.sectionHeader && cfg.sectionHeader.title) this.header = cfg.sectionHeader;
          if (cfg.hrForm) {
            this.hrSection = cfg.hrForm;
            this.hrForm = this.buildForm(cfg.hrForm.fields || []);
          }
          if (cfg.candidateForm) {
            this.candSection = cfg.candidateForm;
            this.candForm = this.buildForm(cfg.candidateForm.fields || []);
          }
        }
        this.loading = false;
      },
      error: () => {
        this.loadError = true;
        this.loading = false;
      }
    });
  }

  private buildForm(fields: DynamicFormField[]): FormGroup {
    const group: { [k: string]: any } = {};
    for (const f of fields) {
      const validators = [];
      if (f.required) validators.push(Validators.required);
      if (f.type === 'email') validators.push(Validators.email);
      if (f.minLength) validators.push(Validators.minLength(f.minLength));
      if (f.maxLength) validators.push(Validators.maxLength(f.maxLength));
      if (f.min !== null && f.min !== undefined) validators.push(Validators.min(f.min));
      if (f.max !== null && f.max !== undefined) validators.push(Validators.max(f.max));
      if (f.pattern) {
        try { validators.push(Validators.pattern(new RegExp(f.pattern))); }
        catch (e) { console.warn('Invalid regex pattern for', f.id); }
      }
      // File fields start as null (not empty string)
      const initial = f.type === 'file' ? null : '';
      group[f.id] = [initial, validators];
    }
    return this.fb.group(group);
  }

  submitHr() {
    if (this.hrForm.invalid) {
      this.hrForm.markAllAsTouched();
      this.toast.show('Please fill all required fields correctly.', 'err');
      return;
    }
    this.hrLoading = true;
    const fd = this.buildFormData(this.hrForm, this.hrSection!.fields);
    this.api.submitHrEnquiry(fd).subscribe({
      next: () => {
        this.toast.show('Enquiry sent — we\u2019ll respond within 24 hours.');
        this.hrForm.reset();
        this.hrLoading = false;
      },
      error: () => { this.toast.show('Could not send. Please try again.', 'err'); this.hrLoading = false; }
    });
  }

  submitCand() {
    if (this.candForm.invalid) {
      this.candForm.markAllAsTouched();
      this.toast.show('Please fill all required fields correctly.', 'err');
      return;
    }
    this.candLoading = true;
    const fd = this.buildFormData(this.candForm, this.candSection!.fields);
    this.api.submitCandidate(fd).subscribe({
      next: () => {
        this.toast.show('Application submitted successfully!');
        this.candForm.reset();
        this.candLoading = false;
      },
      error: () => { this.toast.show('Submission failed. Please try again.', 'err'); this.candLoading = false; }
    });
  }

  /**
   * Build FormData honoring file fields. Files are appended under their field id
   * (and also under 'resume' for backward-compat with the existing backend route).
   */
  private buildFormData(form: FormGroup, fields: DynamicFormField[]): FormData {
    const fd = new FormData();
    for (const f of fields) {
      const v = form.get(f.id)?.value;
      if (v == null || v === '') continue;
      if (f.type === 'file' && v instanceof File) {
        fd.append(f.id, v, v.name);
        // Back-compat: existing /api/enquiries/candidate route expects 'resume'
        if (f.id !== 'resume') fd.append('resume', v, v.name);
      } else {
        fd.append(f.id, String(v));
      }
    }
    return fd;
  }
}
