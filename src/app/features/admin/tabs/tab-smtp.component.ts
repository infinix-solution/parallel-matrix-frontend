import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { SmtpConfig, SmtpConfigPayload } from '../../../core/models';

@Component({
  selector: 'app-tab-smtp',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './tab-smtp.component.html'
})
export class TabSmtpComponent implements OnInit {
  private api   = inject(ApiService);
  private toast = inject(ToastService);
  private cdr   = inject(ChangeDetectorRef);

  loading = signal(true);
  saving  = signal(false);
  currentConfig = signal<SmtpConfig | null>(null);
  hasExistingPassword = false;
  showPass = false;

  form: SmtpConfigPayload = {
    host: '', port: 587, secure: false, user: '',
    pass: '', mailFrom: '', mailTo: ''
  };

  // Regex: hostname or IP, allows subdomains, no spaces
  readonly hostPattern = '^[a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?)*$';

  ngOnInit() {
    this.api.getSmtpConfig().subscribe({
      next: res => {
        this.loading.set(false);
        if (res?.success && res.data) {
          const d = res.data;
          this.currentConfig.set(d);
          this.hasExistingPassword = !!d.hasPassword;
          // Plain object replacement — not tracked by Angular's signal graph.
          // markForCheck() ensures the OnPush view re-evaluates the ngModel bindings.
          this.form = {
            host:     d.host,
            port:     d.port,
            secure:   d.secure,
            user:     d.user,
            mailFrom: d.mailFrom,
            mailTo:   d.mailTo,
            pass:     ''
          };
          this.cdr.markForCheck();
        }
      },
      error: () => {
        this.loading.set(false);
        this.toast.show('Could not load SMTP configuration.', 'err');
        this.cdr.markForCheck();
      }
    });
  }

  save(valid: boolean | null) {
    if (!valid) return;
    this.saving.set(true);

    const payload: SmtpConfigPayload = { ...this.form };
    if (!payload.pass) delete payload.pass; // Don't overwrite existing pass if blank

    this.api.saveSmtpConfig(payload).subscribe({
      next: res => {
        this.saving.set(false);
        if (res?.success) {
          this.toast.show('SMTP configuration saved.');
          this.hasExistingPassword = !!this.form.pass || this.hasExistingPassword;
          this.form.pass = '';
          this.cdr.markForCheck();
          this.ngOnInit();
        } else {
          this.toast.show(res?.message || 'Save failed.', 'err');
          this.cdr.markForCheck();
        }
      },
      error: err => {
        this.saving.set(false);
        this.toast.show(err?.error?.message || 'Save failed.', 'err');
        this.cdr.markForCheck();
      }
    });
  }

  clearConfig() {
    if (!confirm('Clear the database SMTP config? The system will fall back to environment variables.')) return;
    this.saving.set(true);
    this.api.clearSmtpConfig().subscribe({
      next: res => {
        this.saving.set(false);
        if (res?.success) {
          this.toast.show('SMTP configuration cleared.');
          this.currentConfig.set(null);
          this.hasExistingPassword = false;
          this.form = { host: '', port: 587, secure: false, user: '', pass: '', mailFrom: '', mailTo: '' };
          this.cdr.markForCheck();
        }
      },
      error: () => {
        this.saving.set(false);
        this.toast.show('Could not clear configuration.', 'err');
        this.cdr.markForCheck();
      }
    });
  }
}
