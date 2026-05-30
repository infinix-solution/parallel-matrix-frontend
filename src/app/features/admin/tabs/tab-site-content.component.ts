import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContentService } from '../../../core/services/content.service';
import { ToastService } from '../../../core/services/toast.service';

type SubTab = 'about' | 'services' | 'career' | 'sister' | 'policy' | 'contact';

@Component({
  selector: 'app-tab-site-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="adm-panel">
      <h3>Site Content</h3>
      <p class="help">Edit all home page sections. Click "Save Changes" at the bottom when done.</p>

      <form [formGroup]="form" (ngSubmit)="save()">
        <div class="adm-tabs" style="margin:0 0 18px">
          <button type="button" [class.active]="sub==='about'"    (click)="sub='about'">ℹ About</button>
          <button type="button" [class.active]="sub==='services'" (click)="sub='services'">🎯 Services</button>
          <button type="button" [class.active]="sub==='career'"   (click)="sub='career'">📈 Career Stats</button>
          <button type="button" [class.active]="sub==='sister'"   (click)="sub='sister'">🏗 Sister Concern</button>
          <button type="button" [class.active]="sub==='policy'"   (click)="sub='policy'">📜 Policies</button>
          <button type="button" [class.active]="sub==='contact'"  (click)="sub='contact'">📍 Contact</button>
        </div>

        <!-- ABOUT -->
        <div *ngIf="sub==='about'" formGroupName="aboutSection">
          <div class="adm-card">
            <strong style="color:var(--navy);display:block;margin-bottom:10px">About Section</strong>
            <div class="grid2">
              <div class="field"><label>Eyebrow</label><input formControlName="eyebrow"></div>
              <div class="field"><label>Title</label><input formControlName="title"></div>
            </div>
            <div class="field"><label>Subtitle</label><textarea formControlName="sub" rows="3"></textarea></div>
            <div class="field">
              <label>About Image</label>
              <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
                <img *ngIf="form.get('aboutSection.image')?.value" [src]="resolve(form.get('aboutSection.image')?.value)"
                     style="width:120px;height:80px;object-fit:cover;border-radius:10px;border:1.5px solid #e5ecf6">
                <label class="adm-btn ghost" style="cursor:pointer;margin:0">
                  📁 Upload
                  <input type="file" accept="image/*" hidden (change)="uploadImage($event, 'aboutSection.image')">
                </label>
                <button *ngIf="form.get('aboutSection.image')?.value" type="button" class="adm-btn danger" (click)="setVal('aboutSection.image','')" style="padding:6px 12px">Clear</button>
              </div>
            </div>
          </div>

          <div class="adm-card" style="margin-top:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <strong style="color:var(--navy)">Highlights ({{ aboutHighlights.length }})</strong>
              <button type="button" class="adm-btn primary" (click)="addHighlight()">+ Add</button>
            </div>
            <div formArrayName="highlights">
              <div *ngFor="let h of aboutHighlights.controls; let i = index" [formGroupName]="i" class="adm-card" style="background:#fff;border:1.5px solid #e5ecf6;margin-bottom:10px">
                <div class="grid2">
                  <div class="field"><label>Icon (emoji)</label><input formControlName="icon" maxlength="4"></div>
                  <div class="field"><label>Title</label><input formControlName="title"></div>
                </div>
                <div class="field"><label>Description</label><textarea formControlName="description" rows="2"></textarea></div>
                <button type="button" class="adm-btn danger" (click)="removeHighlight(i)">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- SERVICES -->
        <div *ngIf="sub==='services'" formGroupName="servicesSection">
          <div class="adm-card">
            <strong style="color:var(--navy);display:block;margin-bottom:10px">Services Section Header</strong>
            <div class="grid2">
              <div class="field"><label>Eyebrow</label><input formControlName="eyebrow"></div>
              <div class="field"><label>Title</label><input formControlName="title"></div>
            </div>
            <div class="field"><label>Subtitle</label><input formControlName="sub"></div>
          </div>

          <div class="adm-card" style="margin-top:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <strong style="color:var(--navy)">Services ({{ services.length }})</strong>
              <button type="button" class="adm-btn primary" (click)="addService()">+ Add Service</button>
            </div>
            <div formArrayName="items">
              <div *ngFor="let s of services.controls; let i = index" [formGroupName]="i" class="adm-card" style="background:#fff;border:1.5px solid #e5ecf6;margin-bottom:12px">
  <ng-container *ngIf="asGroup(s) as sg">
    <div class="grid2">
      <div class="field"><label>ID</label><input formControlName="id"></div>
      <div class="field"><label>Icon (emoji)</label><input formControlName="icon" maxlength="4"></div>
      <div class="field"><label>Title</label><input formControlName="title"></div>
      <div class="field"><label>Lead</label><input formControlName="lead"></div>
    </div>
    <div class="field">
      <label>Image</label>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <img *ngIf="sg.get('image')?.value" [src]="resolve(sg.get('image')?.value)"
             style="width:120px;height:80px;object-fit:cover;border-radius:10px;border:1.5px solid #e5ecf6">
        <label class="adm-btn ghost" style="cursor:pointer;margin:0">
          📁 Upload
          <input type="file" accept="image/*" hidden (change)="uploadImageInto($event, sg, 'image')">
        </label>
        <button *ngIf="sg.get('image')?.value" type="button" class="adm-btn danger" (click)="sg.patchValue({image:''})" style="padding:6px 12px">Clear</button>
      </div>
    </div>
    <div class="field">
      <label>Bullet Points (one per line)</label>
      <textarea rows="5" [value]="bulletText(sg)" (input)="onBullets($event, i)"></textarea>
    </div>
    <button type="button" class="adm-btn danger" (click)="removeService(i)">Delete Service</button>
  </ng-container>
</div>
            </div>
          </div>
        </div>

        <!-- CAREER -->
        <div *ngIf="sub==='career'" formGroupName="careerSection">
          <div class="adm-card">
            <div class="grid2">
              <div class="field"><label>Eyebrow</label><input formControlName="eyebrow"></div>
              <div class="field"><label>Title</label><input formControlName="title"></div>
            </div>
            <div class="field"><label>Lead Text</label><textarea formControlName="lead" rows="2"></textarea></div>
          </div>
          <div class="adm-card" style="margin-top:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <strong style="color:var(--navy)">Stats ({{ careerStats.length }})</strong>
              <button type="button" class="adm-btn primary" (click)="addStat()">+ Add Stat</button>
            </div>
            <div formArrayName="stats">
              <div *ngFor="let st of careerStats.controls; let i = index" [formGroupName]="i" class="adm-card" style="background:#fff;border:1.5px solid #e5ecf6;margin-bottom:10px">
                <div class="grid2">
                  <div class="field"><label>Number</label><input formControlName="number" placeholder="12K+"></div>
                  <div class="field"><label>Label</label><input formControlName="label" placeholder="Placements"></div>
                </div>
                <button type="button" class="adm-btn danger" (click)="removeStat(i)">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- SISTER -->
        <div *ngIf="sub==='sister'" formGroupName="sisterCompany">
          <div class="adm-card">
            <strong style="color:var(--navy);display:block;margin-bottom:10px">Header</strong>
            <div class="grid2">
              <div class="field"><label>Eyebrow</label><input formControlName="eyebrow"></div>
              <div class="field"><label>Title</label><input formControlName="title"></div>
            </div>
            <div class="field"><label>Subtitle</label><input formControlName="sub"></div>
          </div>

          <div class="adm-card" style="margin-top:14px">
            <strong style="color:var(--navy);display:block;margin-bottom:10px">About</strong>
            <div class="field"><label>About Title</label><input formControlName="aboutTitle"></div>
            <div class="field"><label>About Text (paragraph 1)</label><textarea formControlName="aboutText1" rows="3"></textarea></div>
            <div class="field"><label>About Text (paragraph 2)</label><textarea formControlName="aboutText2" rows="3"></textarea></div>
            <div class="field"><label>Tagline (quote)</label><input formControlName="tagline"></div>
          </div>

          <div class="adm-card" style="margin-top:14px">
            <strong style="color:var(--navy);display:block;margin-bottom:10px">Primary Service Card</strong>
            <div class="grid2">
              <div class="field"><label>Icon</label><input formControlName="primaryServiceIcon" maxlength="4"></div>
              <div class="field"><label>Title</label><input formControlName="primaryServiceTitle"></div>
            </div>
            <div class="field"><label>Lead</label><input formControlName="primaryServiceLead"></div>
          </div>

          <div class="adm-card" style="margin-top:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <strong style="color:var(--navy)">Service Cards ({{ sisterCards.length }})</strong>
              <button type="button" class="adm-btn primary" (click)="addSisterCard()">+ Add Card</button>
            </div>
            <div formArrayName="serviceCards">
              <div *ngFor="let c of sisterCards.controls; let i = index" [formGroupName]="i" class="adm-card" style="background:#fff;border:1.5px solid #e5ecf6;margin-bottom:10px">
                <div class="grid2">
                  <div class="field"><label>Icon</label><input formControlName="icon" maxlength="4"></div>
                  <div class="field"><label>Title</label><input formControlName="title"></div>
                </div>
                <div class="field"><label>Description</label><textarea formControlName="description" rows="2"></textarea></div>
                <button type="button" class="adm-btn danger" (click)="removeSisterCard(i)">Delete</button>
              </div>
            </div>
          </div>

          <div class="adm-card" style="margin-top:14px">
            <strong style="color:var(--navy);display:block;margin-bottom:10px">Vision & Mission</strong>
            <div class="field"><label>Vision Title</label><input formControlName="visionTitle"></div>
            <div class="field"><label>Vision Text</label><textarea formControlName="visionText" rows="3"></textarea></div>
            <div class="field"><label>Mission Title</label><input formControlName="missionTitle"></div>
            <div class="field"><label>Mission Text</label><textarea formControlName="missionText" rows="3"></textarea></div>
          </div>

          <div class="adm-card" style="margin-top:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <strong style="color:var(--navy)">Industries ({{ industries.length }})</strong>
              <button type="button" class="adm-btn primary" (click)="addIndustry()">+ Add</button>
            </div>
            <div class="field"><label>Industries Title</label><input formControlName="industriesTitle"></div>
            <div formArrayName="industries">
              <div *ngFor="let it of industries.controls; let i = index" [formGroupName]="i" style="display:grid;grid-template-columns:80px 1fr auto;gap:10px;margin-bottom:8px;align-items:center">
                <input formControlName="icon" maxlength="4" placeholder="🏭" style="padding:10px;border-radius:10px;border:1.5px solid #e5ecf6">
                <input formControlName="label" placeholder="Industry name" style="padding:10px;border-radius:10px;border:1.5px solid #e5ecf6">
                <button type="button" class="adm-btn danger" (click)="removeIndustry(i)" style="padding:8px 12px">×</button>
              </div>
            </div>
          </div>

          <div class="adm-card" style="margin-top:14px">
            <strong style="color:var(--navy);display:block;margin-bottom:10px">Contact</strong>
            <div class="grid2">
              <div class="field"><label>Email</label><input formControlName="email"></div>
              <div class="field"><label>Phone</label><input formControlName="phone"></div>
            </div>
            <div class="field"><label>Locations</label><input formControlName="locations"></div>
          </div>
        </div>

        <!-- POLICY -->
        <div *ngIf="sub==='policy'" formGroupName="policySection">
          <div class="adm-card">
            <div class="grid2">
              <div class="field"><label>Eyebrow</label><input formControlName="eyebrow"></div>
              <div class="field"><label>Title</label><input formControlName="title"></div>
            </div>
          </div>
          <div class="adm-card" style="margin-top:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <strong style="color:var(--navy)">Policy Cards ({{ policyItems.length }})</strong>
              <button type="button" class="adm-btn primary" (click)="addPolicy()">+ Add Policy</button>
            </div>
            <div formArrayName="items">
              <div *ngFor="let p of policyItems.controls; let i = index" [formGroupName]="i" class="adm-card" style="background:#fff;border:1.5px solid #e5ecf6;margin-bottom:10px">
                <div class="grid2">
                  <div class="field"><label>Icon (emoji)</label><input formControlName="icon" maxlength="4"></div>
                  <div class="field"><label>Title</label><input formControlName="title"></div>
                  <div class="field"><label>Max Length (truncate after)</label><input type="number" formControlName="maxLength" min="50"></div>
                </div>
                <div class="field"><label>Description</label><textarea formControlName="description" rows="4"></textarea></div>
                <button type="button" class="adm-btn danger" (click)="removePolicy(i)">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTACT -->
        <div *ngIf="sub==='contact'" formGroupName="contactSection">
          <div class="adm-card">
            <div class="grid2">
              <div class="field"><label>Eyebrow</label><input formControlName="eyebrow"></div>
              <div class="field"><label>Title</label><input formControlName="title"></div>
            </div>
            <div class="field"><label>Subtitle</label><input formControlName="sub"></div>
            <div class="field"><label>Address</label><textarea formControlName="address" rows="2"></textarea></div>
            <div class="grid2">
              <div class="field"><label>Office Phone</label><input formControlName="phone"></div>
              <div class="field"><label>Emergency Phone</label><input formControlName="emergency"></div>
              <div class="field"><label>WhatsApp Number</label><input formControlName="whatsapp"></div>
               <div class="field"><label>LinkedIn url</label><input formControlName="linkdnUrl"></div>
            </div>
            <div class="field"><label>Email</label><input formControlName="email"></div>
            <div class="field"><label>Map Query (for Google Maps embed)</label><input formControlName="mapQuery"></div>
            <div class="field"><label>Directions URL</label><input formControlName="directionsUrl"></div>
          </div>
        </div>

        <div class="adm-actions" style="margin-top:18px;position:sticky;bottom:0;background:#fff;padding:14px;border-radius:12px;box-shadow:0 -8px 20px -10px rgba(10,31,68,.15);z-index:5">
          <button type="submit" class="adm-btn primary" [disabled]="loading">{{ loading ? 'Saving...' : '💾 Save Changes' }}</button>
          <a class="adm-btn ghost" href="/" target="_blank">Preview Home ↗</a>
        </div>
      </form>
    </div>
  `
})
export class TabSiteContentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cnt = inject(ContentService);
  private toast = inject(ToastService);

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
      address: [''], phone: [''], emergency: [''], email: [''],
      mapQuery: [''], directionsUrl: [''],
      whatsapp: [''], linkdnUrl: ['']
    })
  });

  get aboutHighlights(): FormArray { return this.form.get('aboutSection.highlights') as FormArray; }
  get services(): FormArray { return this.form.get('servicesSection.items') as FormArray; }
  get careerStats(): FormArray { return this.form.get('careerSection.stats') as FormArray; }
  get sisterCards(): FormArray { return this.form.get('sisterCompany.serviceCards') as FormArray; }
  get industries(): FormArray { return this.form.get('sisterCompany.industries') as FormArray; }
  get policyItems(): FormArray { return this.form.get('policySection.items') as FormArray; }

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
