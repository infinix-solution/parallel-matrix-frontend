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
  template: `
    <div class="adm-login">
      <div class="card">
        <h2>Forgot Password</h2>
        <p>Enter your admin email and we'll send a reset link.</p>

        <div *ngIf="!sent">
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="field">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="admin@parallelmatrixcorp.com">
              <div class="err" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">Valid email required.</div>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center" [disabled]="loading">
              {{ loading ? 'Sending...' : 'Send Reset Link' }}
            </button>
          </form>
        </div>

        <div *ngIf="sent" style="text-align:center;padding:20px 0">
          <div style="font-size:48px;margin-bottom:12px">📧</div>
          <h3 style="color:var(--navy);margin-bottom:8px">Check your email</h3>
          <p style="color:var(--mute);font-size:14px">
            If <strong>{{ submittedEmail }}</strong> matches an admin account, you'll receive a reset link within a few minutes.
            <br><br>The link will expire in 1 hour.
          </p>
        </div>

        <div style="text-align:center;margin-top:18px">
          <a routerLink="/admin/login" style="color:var(--blue2);font-weight:600;font-size:13.5px">&larr; Back to login</a>
        </div>
      </div>
    </div>
    <app-toast-host></app-toast-host>
  `
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
