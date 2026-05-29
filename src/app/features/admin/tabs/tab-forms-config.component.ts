import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-tab-forms-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="adm-panel">
      <h3>Enquiry Forms &mdash; Titles &amp; Subtitles</h3>
      <p class="help">Edits here update the "Get in Touch" section on the home page. Leaving a field blank falls back to the original template text.</p>

      <form [formGroup]="form" (ngSubmit)="save()">
        <div class="adm-card">
          <strong style="display:block;margin-bottom:10px;color:var(--navy)">Section header</strong>
          <div class="grid2">
            <div class="field"><label>Eyebrow</label><input formControlName="sectionEyebrow"></div>
            <div class="field"><label>Title</label><input formControlName="sectionTitle"></div>
          </div>
          <div class="field"><label>Subtitle</label><textarea formControlName="sectionSub" rows="2"></textarea></div>
        </div>

        <div class="adm-card" style="margin-top:14px">
          <strong style="display:block;margin-bottom:10px;color:var(--navy)">HR / Employer card</strong>
          <div class="grid2">
            <div class="field"><label>Title</label><input formControlName="hrTitle"></div>
            <div class="field"><label>Subtitle</label><input formControlName="hrSubtitle"></div>
          </div>
        </div>

        <div class="adm-card" style="margin-top:14px">
          <strong style="display:block;margin-bottom:10px;color:var(--navy)">Candidate card</strong>
          <div class="grid2">
            <div class="field"><label>Title</label><input formControlName="candidateTitle"></div>
            <div class="field"><label>Subtitle</label><input formControlName="candidateSubtitle"></div>
          </div>
        </div>

        <div class="adm-actions">
          <button class="adm-btn primary" type="submit" [disabled]="loading">{{ loading ? 'Saving...' : 'Save Changes' }}</button>
        </div>
      </form>
    </div>
  `
})
export class TabFormsConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  loading = false;

  form = this.fb.group({
    sectionEyebrow: ['Get in touch'],
    sectionTitle: ['Two doors. One mission.'],
    sectionSub: ["Hiring? Applying? Pick your form and we'll respond within 24 hours."],
    hrTitle: ['HR / Employer Enquiry'],
    hrSubtitle: ["Tell us what you're hiring for."],
    candidateTitle: ['Candidate Application'],
    candidateSubtitle: ["Drop your details \u2014 we'll match you to roles."]
  });

  ngOnInit() {
    this.api.getFormsConfig().subscribe({
      next: r => { if (r?.success && r.data) this.form.patchValue(r.data); }
    });
  }

  save() {
    this.loading = true;
    this.api.updateFormsConfig(this.form.value as any).subscribe({
      next: () => { this.toast.show('Forms configuration saved.'); this.loading = false; },
      error: () => { this.toast.show('Save failed.', 'err'); this.loading = false; }
    });
  }
}
