import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ToastHostComponent } from '../../../shared/toast-host/toast-host.component';

@Component({
  selector: 'app-admin-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ToastHostComponent],
  template: `
    <div class="adm-login">
      <div class="card">
        <h2>Reset Password</h2>

        <div *ngIf="checking" style="text-align:center;padding:20px 0">
          <p style="color:var(--mute)">Verifying reset link...</p>
        </div>

        <div *ngIf="!checking && tokenInvalid" style="text-align:center;padding:20px 0">
          <div style="font-size:48px;margin-bottom:12px">⚠️</div>
          <h3 style="color:#b91c1c;margin-bottom:8px">Link expired or invalid</h3>
          <p style="color:var(--mute);font-size:14px">
            This reset link is no longer valid. Please request a new one.
          </p>
          <a routerLink="/admin/forgot-password" class="btn btn-primary" style="margin-top:18px;display:inline-block">Request new link</a>
        </div>

        <div *ngIf="!checking && !tokenInvalid && !done">
          <p style="color:var(--mute);font-size:14px;margin-bottom:18px">Setting new password for <strong>{{ emailForToken }}</strong></p>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="field">
              <label>New Password</label>
              <input type="password" formControlName="newPassword" placeholder="At least 8 characters">
              <div class="err" *ngIf="form.get('newPassword')?.touched && form.get('newPassword')?.invalid">
                Password must be at least 8 characters.
              </div>
            </div>
            <div class="field">
              <label>Confirm Password</label>
              <input type="password" formControlName="confirmPassword">
              <div class="err" *ngIf="form.hasError('mismatch') && form.get('confirmPassword')?.touched">
                Passwords don't match.
              </div>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center" [disabled]="loading || form.invalid">
              {{ loading ? 'Updating...' : 'Set New Password' }}
            </button>
          </form>
        </div>

        <div *ngIf="done" style="text-align:center;padding:20px 0">
          <div style="font-size:48px;margin-bottom:12px">✅</div>
          <h3 style="color:#16a34a;margin-bottom:8px">Password updated</h3>
          <p style="color:var(--mute);font-size:14px">Redirecting to login...</p>
        </div>

        <div *ngIf="!checking" style="text-align:center;margin-top:18px">
          <a routerLink="/admin/login" style="color:var(--blue2);font-weight:600;font-size:13.5px">&larr; Back to login</a>
        </div>
      </div>
    </div>
    <app-toast-host></app-toast-host>
  `
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  checking = true;
  tokenInvalid = false;
  done = false;
  loading = false;
  emailForToken = '';
  private token = '';

  form = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: g => g.get('newPassword')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true } }
  );

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.checking = false;
      this.tokenInvalid = true;
      return;
    }
    this.auth.verifyResetToken(this.token).subscribe({
      next: r => {
        this.checking = false;
        if (r?.success && r.data) {
          this.emailForToken = r.data.email;
        } else {
          this.tokenInvalid = true;
        }
      },
      error: () => {
        this.checking = false;
        this.tokenInvalid = true;
      }
    });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.resetPassword(this.token, this.form.value.newPassword!).subscribe({
      next: () => {
        this.loading = false;
        this.done = true;
        this.toast.show('Password updated successfully.');
        setTimeout(() => this.router.navigate(['/admin/login']), 2000);
      },
      error: err => {
        this.loading = false;
        this.toast.show(err?.error?.message || 'Reset failed.', 'err');
      }
    });
  }
}
