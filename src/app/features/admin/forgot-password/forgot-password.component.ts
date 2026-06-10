import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ToastHostComponent } from '../../../shared/toast-host/toast-host.component';

@Component({
  selector: 'app-admin-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ToastHostComponent],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  loading = false;
  sent = false;
  submittedEmail = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const email = this.form.value.email!;
    this.auth.forgotPassword(email).subscribe({
      next: () => {
        this.loading = false;
        this.submittedEmail = email;
        this.sent = true;
      },
      error: err => {
        this.loading = false;
        this.toast.show(err?.error?.message || 'Could not send reset email.', 'err');
      }
    });
  }
}
