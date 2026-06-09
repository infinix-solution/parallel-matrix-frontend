import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ContentService } from '../../../core/services/content.service';
import { ToastService } from '../../../core/services/toast.service';
import { TeamMember } from '../../../core/models';

@Component({
  selector: 'app-tab-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="adm-panel">
      <h3>Leadership Team</h3>
      <p class="help">Add, edit or remove members. Name max 50 chars. Email & phone validated. LinkedIn falls back to <code>#</code> if blank. Upload a photo per member.</p>

      <div class="adm-list" [formGroup]="form">
        <div formArrayName="members">
          <div *ngFor="let m of members.controls; let i = index" [formGroupName]="i" class="adm-card" style="margin-bottom:14px;padding:0;overflow:hidden">
            <!-- Card header with member name preview -->
            <div style="padding:14px 20px 0;background:#f0f4ff;border-bottom:1px solid #e5ecf6;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
              <span style="font-weight:700;color:var(--navy);font-size:14px">
                <i class="fa-solid fa-user" style="margin-right:6px;opacity:.6" aria-hidden="true"></i>
                {{ m.get('name')?.value || ('Member #' + (i + 1)) }}
              </span>
              <span *ngIf="m.get('_id')?.value" style="font-size:11px;color:var(--mute);font-weight:500">ID: {{ m.get('_id')?.value }}</span>
            </div>

            <div style="padding:20px">
              <div class="grid2">
                <div class="field">
                  <label>Full Name *</label>
                  <input formControlName="name" maxlength="50" placeholder="Full name">
                  <div class="err" *ngIf="m.get('name')?.touched && m.get('name')?.invalid">Required, max 50 chars.</div>
                </div>
                <div class="field">
                  <label>Role *</label>
                  <input formControlName="role" placeholder="e.g. Founder">
                </div>
                <div class="field">
                  <label>Email *</label>
                  <input formControlName="email" type="email" placeholder="name@parallelmatrixcorp.com">
                  <div class="err" *ngIf="m.get('email')?.touched && m.get('email')?.invalid">Valid email required.</div>
                </div>
                <div class="field">
                  <label>Phone *</label>
                  <input formControlName="phone" placeholder="+91 ...">
                  <div class="err" *ngIf="m.get('phone')?.touched && m.get('phone')?.invalid">Valid phone required.</div>
                </div>
                <div class="field">
                  <label>LinkedIn URL</label>
                  <input formControlName="linkedin" placeholder="https://linkedin.com/in/...">
                </div>
                <div class="field">
                  <label>Badge label</label>
                  <input formControlName="badge" placeholder="Founder">
                </div>
                <div class="field">
                  <label>Order</label>
                  <input formControlName="order" type="number" min="0">
                </div>
                <div class="field">
                  <label>Photo</label>
                  <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
                    <img *ngIf="m.get('photoUrl')?.value" [src]="resolve(m.get('photoUrl')?.value)" alt=""
                         style="width:64px;height:64px;border-radius:12px;object-fit:cover;border:1.5px solid #e5ecf6">
                    <label class="adm-btn ghost" style="cursor:pointer;margin:0">
                      <i class="fa-solid fa-folder-open" style="margin-right:4px" aria-hidden="true"></i>Upload Photo
                      <input type="file" accept="image/*" hidden (change)="uploadPhoto($event, i)">
                    </label>
                    <button *ngIf="m.get('photoUrl')?.value" type="button" class="adm-btn danger" (click)="clearPhoto(i)" style="padding:6px 12px">Clear</button>
                  </div>
                  <small style="color:var(--mute);font-size:11.5px;display:block;margin-top:6px">{{ m.get('photoUrl')?.value || 'No photo — UI will fall back to placeholder.' }}</small>
                </div>
              </div>
            </div>

            <!-- Sticky action footer — always visible at bottom of card -->
            <div style="padding:14px 20px;background:#f8fafd;border-top:1.5px solid #e5ecf6;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
              <button type="button" class="adm-btn primary" (click)="save(i)" style="flex:1;min-width:120px;justify-content:center;display:flex;align-items:center;gap:6px">
                <i class="fa-solid fa-floppy-disk" aria-hidden="true"></i>
                {{ m.get('_id')?.value ? 'Update Member' : 'Create Member' }}
              </button>
              <button type="button" class="adm-btn danger" (click)="remove(i)" *ngIf="m.get('_id')?.value">
                <i class="fa-solid fa-trash" aria-hidden="true"></i> Delete
              </button>
              <button type="button" class="adm-btn ghost" (click)="discard(i)" *ngIf="!m.get('_id')?.value">
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>

      <button class="adm-btn ghost" (click)="addRow()">+ Add New Member</button>
    </div>
  `
})
export class TabTeamComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private cnt = inject(ContentService);
  private toast = inject(ToastService);

  form: FormGroup = this.fb.group({ members: this.fb.array([]) });

  get members(): FormArray { return this.form.get('members') as FormArray; }

  ngOnInit() { this.load(); }

  load() {
    this.api.getTeam().subscribe({
      next: r => {
        this.members.clear();
        (r?.data || []).forEach(m => this.members.push(this.toGroup(m)));
      }
    });
  }

  toGroup(m: Partial<TeamMember> = {}): FormGroup {
    return this.fb.group({
      _id: [m._id || null],
      name: [m.name || '', [Validators.required, Validators.maxLength(50)]],
      role: [m.role || '', Validators.required],
      email: [m.email || '', [Validators.required, Validators.email]],
      phone: [m.phone || '', [Validators.required, Validators.pattern(/^[+]?[\d\s\-()]{7,20}$/)]],
      linkedin: [m.linkedin || ''],
      photoUrl: [m.photoUrl || ''],
      badge: [m.badge || ''],
      order: [m.order ?? 0]
    });
  }

  addRow() { this.members.push(this.toGroup()); }

  uploadPhoto(e: Event, i: number) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    input.value = '';
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { this.toast.show('Image too large (max 2MB).', 'err'); return; }
    this.cnt.uploadImage(f).subscribe({
      next: r => {
        if (r?.success && r.data) {
          (this.members.at(i) as FormGroup).patchValue({ photoUrl: r.data.url });
          this.toast.show('Photo uploaded.');
        }
      },
      error: err => this.toast.show(err?.error?.message || 'Upload failed.', 'err')
    });
  }

  clearPhoto(i: number) {
    (this.members.at(i) as FormGroup).patchValue({ photoUrl: '' });
  }

  resolve(u: string) { return this.cnt.resolveUrl(u); }

  save(i: number) {
    const g = this.members.at(i) as FormGroup;
    if (g.invalid) { g.markAllAsTouched(); return; }
    const v = g.value;
    if (!v.linkedin) v.linkedin = '#';
    if (v._id) {
      this.api.updateTeam(v._id, v).subscribe({
        next: () => this.toast.show('Updated.'),
        error: () => this.toast.show('Update failed.', 'err')
      });
    } else {
      this.api.createTeam(v).subscribe({
        next: r => { if (r?.data?._id) g.patchValue({ _id: r.data._id }); this.toast.show('Created.'); },
        error: () => this.toast.show('Create failed.', 'err')
      });
    }
  }

  remove(i: number) {
    const g = this.members.at(i) as FormGroup;
    const id = g.get('_id')?.value;
    if (!id) { this.members.removeAt(i); return; }
    if (!confirm('Delete this member?')) return;
    this.api.deleteTeam(id).subscribe({
      next: () => { this.members.removeAt(i); this.toast.show('Deleted.'); },
      error: () => this.toast.show('Delete failed.', 'err')
    });
  }

  discard(i: number) { this.members.removeAt(i); }
}
