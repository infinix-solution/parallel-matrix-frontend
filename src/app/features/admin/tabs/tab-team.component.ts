import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ContentService } from '../../../core/services/content.service';
import { ToastService } from '../../../core/services/toast.service';
import { TeamMember } from '../../../core/models';

@Component({
  selector: 'app-tab-team',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tab-team.component.html'
})
export class TabTeamComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private cnt = inject(ContentService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup = this.fb.group({ members: this.fb.array([]) });

  get members(): FormArray { return this.form.get('members') as FormArray; }

  ngOnInit() { this.load(); }

  load() {
    this.api.getTeam().subscribe({
      next: r => {
        this.members.clear();
        (r?.data || []).forEach(m => this.members.push(this.toGroup(m)));
        this.cdr.markForCheck();
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
          this.cdr.markForCheck();
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
        next: () => { this.toast.show('Updated.'); this.cdr.markForCheck(); },
        error: () => { this.toast.show('Update failed.', 'err'); this.cdr.markForCheck(); }
      });
    } else {
      this.api.createTeam(v).subscribe({
        next: r => { if (r?.data?._id) g.patchValue({ _id: r.data._id }); this.toast.show('Created.'); this.cdr.markForCheck(); },
        error: () => { this.toast.show('Create failed.', 'err'); this.cdr.markForCheck(); }
      });
    }
  }

  remove(i: number) {
    const g = this.members.at(i) as FormGroup;
    const id = g.get('_id')?.value;
    if (!id) { this.members.removeAt(i); return; }
    if (!confirm('Delete this member?')) return;
    this.api.deleteTeam(id).subscribe({
      next: () => { this.members.removeAt(i); this.toast.show('Deleted.'); this.cdr.markForCheck(); },
      error: () => { this.toast.show('Delete failed.', 'err'); this.cdr.markForCheck(); }
    });
  }

  discard(i: number) { this.members.removeAt(i); }
}
