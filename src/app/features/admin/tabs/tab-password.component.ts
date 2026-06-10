import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-tab-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tab-password.component.html'
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
