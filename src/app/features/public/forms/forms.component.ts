import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { DynamicFormField, FormSection, PageConfig, SectionHeader } from '../../../core/models';
import { DynFieldComponent } from '../../../shared/dyn-field/dyn-field.component';

type ActiveTab = 'hr' | 'candidate' | null;

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynFieldComponent],
  styles: [`

   .eyebrow-tag {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(240, 217, 122, 0.15);
      color: #eab308;
      font-size: clamp(10px, 1vw, 11px);
      font-weight: 800;
      letter-spacing: .22em;
      text-transform: uppercase;
      width: fit-content;
      margin-bottom: 20px;
    }
    /* ── Tab switcher ── */
    .form-tabs {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }
    .form-tab {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      border-radius: 999px;
      border: 2px solid transparent;
      font-family: inherit;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: background .25s, color .25s, border-color .25s, transform .2s, box-shadow .2s;
      min-height: 52px;
      background: #fff;
      color: var(--navy);
      border-color: #e5ecf6;
      box-shadow: 0 4px 12px -4px rgba(10,31,68,.1);
    }
    .form-tab:hover {
      border-color: var(--blue3);
      color: var(--blue2);
      transform: translateY(-2px);
      box-shadow: 0 10px 28px -8px rgba(24,87,196,.2);
    }
    .form-tab.active {
      background: var(--grad2);
      color: #fff;
      border-color: transparent;
      box-shadow: 0 12px 30px -8px rgba(24,87,196,.5);
      transform: translateY(-2px);
    }
    .form-tab .tab-ic {
      width: 32px; height: 32px;
      border-radius: 8px;
      background: rgba(255,255,255,.15);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    }
    .form-tab:not(.active) .tab-ic {
      background: var(--sky);
    }

    /* ── Form entry animation ── */
    .form-enter {
      animation: formSlideIn .35s cubic-bezier(.2,.9,.3,1) both;
    }
    @keyframes formSlideIn {
      from { opacity: 0; transform: translateY(18px) }
      to   { opacity: 1; transform: none }
    }

    /* ── Prompt banner (shown before any tab is selected) ── */
    .form-prompt {
      text-align: center;
      padding: 48px 24px;
      background: #fff;
      border-radius: 24px;
      border: 2px dashed #e5ecf6;
      color: var(--mute);
    }
    .form-prompt .prompt-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    .form-prompt h3 {
      font-size: 20px;
      color: var(--navy);
      margin-bottom: 8px;
    }
    .form-prompt p {
      font-size: 14.5px;
      max-width: 400px;
      margin: 0 auto;
      line-height: 1.6;
    }
  `],
  template: `
    <section id="forms">
      <div class="container">
        <div class="s-head reveal in">
          <span class="eyebrow-tag">{{ header.eyebrow }}</span>
          <h2 class="s-title">{{ header.title }}</h2>
          <p class="s-sub">{{ header.sub }}</p>
        </div>

        <div *ngIf="loadError" style="text-align:center;padding:20px;background:#fee2e2;border-radius:12px;margin-bottom:20px;color:#b91c1c">
          ⚠ Could not load form configuration. Configure it under <a href="/admin" style="font-weight:700">/admin</a> → Page Builder.
        </div>

        <div *ngIf="!loading">
          <!-- ── Tab selector ── -->
          <div class="form-tabs">
            <button class="form-tab"
                    [class.active]="activeTab === 'hr'"
                    (click)="selectTab('hr')"
                    *ngIf="hrSection && hrSection.fields.length > 0">
              <span class="tab-ic">{{ hrSection.icon || '🏢' }}</span>
              {{ hrSection.title || 'HR Enquiry' }}
            </button>
            <button class="form-tab"
                    [class.active]="activeTab === 'candidate'"
                    (click)="selectTab('candidate')"
                    *ngIf="candSection && candSection.fields.length > 0">
              <span class="tab-ic">{{ candSection.icon || '🎓' }}</span>
              {{ candSection.title || 'Candidate Application' }}
            </button>
          </div>

          <!-- ── Prompt before selection ── -->
          <div class="form-prompt reveal in" *ngIf="!activeTab">
            <div class="prompt-icon">👆</div>
            <h3>Select a tab to get started</h3>
            <p>Choose <strong>HR Enquiry</strong> if you're hiring, or <strong>Candidate Application</strong> if you're looking for opportunities. We'll respond within 24 hours.</p>
          </div>

          <!-- ── HR Form ── -->
          <form class="form-card form-enter"
                [formGroup]="hrForm"
                (ngSubmit)="submitHr()"
                *ngIf="activeTab === 'hr' && hrSection">
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

          <!-- ── Candidate Form ── -->
          <form class="form-card form-enter"
                [formGroup]="candForm"
                (ngSubmit)="submitCand()"
                *ngIf="activeTab === 'candidate' && candSection">
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
  activeTab: ActiveTab = null;

  header: SectionHeader = {
    eyebrow: 'Get in touch',
    title: 'Two doors. One mission.',
    sub: "Hiring? Applying? Pick your tab and we'll respond within 24 hours."
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

  selectTab(tab: ActiveTab) {
    this.activeTab = this.activeTab === tab ? null : tab;
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
        this.toast.show('Enquiry sent — we’ll respond within 24 hours.');
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

  private buildFormData(form: FormGroup, fields: DynamicFormField[]): FormData {
    const fd = new FormData();
    for (const f of fields) {
      const v = form.get(f.id)?.value;
      if (v == null || v === '') continue;
      if (f.type === 'file' && v instanceof File) {
        fd.append(f.id, v, v.name);
        if (f.id !== 'resume') fd.append('resume', v, v.name);
      } else {
        fd.append(f.id, String(v));
      }
    }
    return fd;
  }
}
