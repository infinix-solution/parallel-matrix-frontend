import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContentService } from '../../../core/services/content.service';
import { ToastService } from '../../../core/services/toast.service';

type SubTab = 'about' | 'services' | 'career' | 'sister' | 'policy' | 'contact';

@Component({
  selector: 'app-tab-site-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tab-site-content.component.html'
})
export class TabSiteContentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cnt = inject(ContentService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  sub: SubTab = 'about';
  loading = false;

  form: FormGroup = this.fb.group({
    aboutSection: this.fb.group({
      eyebrow: [''], title: [''], sub: [''], image: [''],
      highlights: this.fb.array([])
    }),
    servicesSection: this.fb.group({
      eyebrow: [''], title: [''], sub: [''],
      items: this.fb.array([])
    }),
    careerSection: this.fb.group({
      eyebrow: [''], title: [''], lead: [''],
      stats: this.fb.array([])
    }),
    sisterCompany: this.fb.group({
      eyebrow: [''], title: [''], sub: [''],
      aboutTitle: [''], aboutText1: [''], aboutText2: [''], tagline: [''],
      primaryServiceIcon: [''], primaryServiceTitle: [''], primaryServiceLead: [''],
      serviceCards: this.fb.array([]),
      visionTitle: [''], visionText: [''], missionTitle: [''], missionText: [''],
      industriesTitle: [''], industries: this.fb.array([]),
      email: [''], phone: [''], locations: ['']
    }),
    policySection: this.fb.group({
      eyebrow: [''], title: [''],
      items: this.fb.array([])
    }),
    contactSection: this.fb.group({
      eyebrow: [''], title: [''], sub: [''],
      address: [''], phone: [''], email: [''],
      mapQuery: [''], directionsUrl: [''],
      whatsapp: [''], linkdnUrl: [''],
      branches: this.fb.array([])
    })
  });

  get aboutHighlights(): FormArray { return this.form.get('aboutSection.highlights') as FormArray; }
  get services(): FormArray { return this.form.get('servicesSection.items') as FormArray; }
  get careerStats(): FormArray { return this.form.get('careerSection.stats') as FormArray; }
  get sisterCards(): FormArray { return this.form.get('sisterCompany.serviceCards') as FormArray; }
  get industries(): FormArray { return this.form.get('sisterCompany.industries') as FormArray; }
  get policyItems(): FormArray { return this.form.get('policySection.items') as FormArray; }
  get contactBranches(): FormArray { return this.form.get('contactSection.branches') as FormArray; }

  ngOnInit() {
    this.cnt.get().subscribe({
      next: r => {
        if (r?.success && r.data) {
          const d: any = r.data;
          this.patchSection('aboutSection', d.aboutSection);
          this.patchSection('servicesSection', d.servicesSection);
          this.patchSection('careerSection', d.careerSection);
          this.patchSection('sisterCompany', d.sisterCompany);
          this.patchSection('policySection', d.policySection);
          this.patchSection('contactSection', d.contactSection);
          // With OnPush, async HTTP callbacks don't automatically mark the view
          // dirty — tell Angular to re-check this component's template now.
          this.cdr.markForCheck();
        }
      }
    });
  }

  patchSection(name: string, data: any) {
    if (!data) return;
    const grp = this.form.get(name) as FormGroup;
    // Patch scalar fields
    const scalars: any = {};
    for (const k of Object.keys(data)) {
      if (!Array.isArray(data[k])) scalars[k] = data[k];
    }
    grp.patchValue(scalars);
    // Patch arrays
    if (name === 'aboutSection' && Array.isArray(data.highlights)) {
      this.aboutHighlights.clear();
      data.highlights.forEach((h: any) => this.aboutHighlights.push(this.highlightGroup(h)));
    }
    if (name === 'servicesSection' && Array.isArray(data.items)) {
      this.services.clear();
      data.items.forEach((s: any) => this.services.push(this.serviceGroup(s)));
    }
    if (name === 'careerSection' && Array.isArray(data.stats)) {
      this.careerStats.clear();
      data.stats.forEach((s: any) => this.careerStats.push(this.fb.group({ number: [s.number || ''], label: [s.label || ''] })));
    }
    if (name === 'sisterCompany') {
      if (Array.isArray(data.serviceCards)) {
        this.sisterCards.clear();
        data.serviceCards.forEach((c: any) => this.sisterCards.push(this.highlightGroup(c)));
      }
      if (Array.isArray(data.industries)) {
        this.industries.clear();
        data.industries.forEach((c: any) => this.industries.push(this.fb.group({ icon: [c.icon || ''], label: [c.label || ''] })));
      }
    }
    if (name === 'policySection' && Array.isArray(data.items)) {
      this.policyItems.clear();
      data.items.forEach((p: any) => this.policyItems.push(this.policyGroup(p)));
    }
    if (name === 'contactSection' && Array.isArray(data.branches)) {
      this.contactBranches.clear();
      data.branches.forEach((b: any) => this.contactBranches.push(this.branchGroup(b)));
    }
  }

  highlightGroup(h: any = {}): FormGroup {
    return this.fb.group({ icon: [h.icon || ''], title: [h.title || ''], description: [h.description || ''] });
  }

  serviceGroup(s: any = {}): FormGroup {
    return this.fb.group({
      id: [s.id || ('svc-' + Math.random().toString(36).slice(2, 6))],
      icon: [s.icon || ''], title: [s.title || ''], lead: [s.lead || ''],
      image: [s.image || ''], items: [s.items || []]
    });
  }

  policyGroup(p: any = {}): FormGroup {
    return this.fb.group({
      icon: [p.icon || ''], title: [p.title || ''],
      description: [p.description || ''], maxLength: [p.maxLength ?? 140]
    });
  }

  branchGroup(b: any = {}): FormGroup {
    return this.fb.group({ name: [b.name || ''], phone: [b.phone || ''] });
  }

  addHighlight() { this.aboutHighlights.push(this.highlightGroup()); }
  removeHighlight(i: number) { if (confirm('Delete?')) this.aboutHighlights.removeAt(i); }
  addService() { this.services.push(this.serviceGroup()); }
  removeService(i: number) { if (confirm('Delete?')) this.services.removeAt(i); }
  addStat() { this.careerStats.push(this.fb.group({ number: [''], label: [''] })); }
  removeStat(i: number) { this.careerStats.removeAt(i); }
  addSisterCard() { this.sisterCards.push(this.highlightGroup()); }
  removeSisterCard(i: number) { if (confirm('Delete?')) this.sisterCards.removeAt(i); }
  addIndustry() { this.industries.push(this.fb.group({ icon: [''], label: [''] })); }
  removeIndustry(i: number) { this.industries.removeAt(i); }
  addPolicy() { this.policyItems.push(this.policyGroup()); }
  removePolicy(i: number) { if (confirm('Delete?')) this.policyItems.removeAt(i); }
  addBranch() { this.contactBranches.push(this.branchGroup()); }
  removeBranch(i: number) { if (confirm('Delete branch?')) this.contactBranches.removeAt(i); }

  bulletText(g: any): string {
    const items = g.get('items')?.value || [];
    return Array.isArray(items) ? items.join('\n') : '';
  }

  onBullets(e: Event, i: number) {
    const value = (e.target as HTMLTextAreaElement).value;
    const lines = value.split('\n').map(s => s.trim()).filter(Boolean);
    (this.services.at(i) as FormGroup).patchValue({ items: lines });
  }

  uploadImage(e: Event, controlPath: string) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    input.value = '';
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { this.toast.show('Image too large (max 2MB).', 'err'); return; }
    this.cnt.uploadImage(f).subscribe({
      next: r => {
        if (r?.success && r.data) {
          this.form.get(controlPath)?.setValue(r.data.url);
          this.toast.show('Image uploaded.');
        }
      },
      error: err => this.toast.show(err?.error?.message || 'Upload failed.', 'err')
    });
  }

  uploadImageInto(e: Event, group: FormGroup, key: string) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    input.value = '';
    if (!f) return;
    this.cnt.uploadImage(f).subscribe({
      next: r => {
        if (r?.success && r.data) {
          group.patchValue({ [key]: r.data.url });
          this.toast.show('Image uploaded.');
        }
      },
      error: err => this.toast.show(err?.error?.message || 'Upload failed.', 'err')
    });
  }

  setVal(controlPath: string, v: any) { this.form.get(controlPath)?.setValue(v); }
  resolve(u: string) { return this.cnt.resolveUrl(u); }

  save() {
    this.loading = true;
    this.cnt.update(this.form.value as any).subscribe({
      next: () => { this.toast.show('Site content saved.'); this.loading = false; },
      error: err => { this.toast.show(err?.error?.message || 'Save failed.', 'err'); this.loading = false; }
    });
  }

  /** Helper to cast AbstractControl → FormGroup for strict-template type narrowing */
asGroup(c: any): FormGroup {
  return c as FormGroup;
}
}
