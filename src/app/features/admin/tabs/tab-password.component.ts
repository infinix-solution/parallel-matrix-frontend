import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-tab-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="adm-panel" style="max-width:520px">
      <h3>Change Password</h3>
      <p class="help">Choose a strong password (min 8 chars).</p>
      <form [formGroup]="form" (ngSubmit)="save()">
        <div class="field">
          <label>Current Password</label>
          <input type="password" formControlName="currentPassword">
        </div>
        <div class="field">
          <label>New Password</label>
          <input type="password" formControlName="newPassword">
          <div class="err" *ngIf="form.get('newPassword')?.touched && form.get('newPassword')?.invalid">Min 8 characters.</div>
        </div>
        <div class="field">
          <label>Confirm New Password</label>
          <input type="password" formControlName="confirmPassword">
          <div class="err" *ngIf="form.hasError('mismatch') && form.get('confirmPassword')?.touched">Passwords don't match.</div>
        </div>
        <button class="adm-btn primary" type="submit" [disabled]="loading">{{ loading ? 'Updating...' : 'Update Password' }}</button>
      </form>
    </div>
  `
})
export class TabPasswordComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  loading = false;

  form = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: g => g.get('newPassword')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true } }
  );

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const { currentPassword, newPassword } = this.form.value;
    this.api.changePassword(currentPassword!, newPassword!).subscribe({
      next: () => { this.toast.show('Password updated.'); this.form.reset(); this.loading = false; },
      error: err => { this.toast.show(err?.error?.message || 'Update failed.', 'err'); this.loading = false; }
    });
  }
}
