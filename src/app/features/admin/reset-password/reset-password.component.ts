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
  templateUrl: './reset-password.component.html'
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
