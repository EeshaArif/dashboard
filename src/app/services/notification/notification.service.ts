import { Inject, Injectable } from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(@Inject(TuiAlertService) private alertService: TuiAlertService) {}

  openErrorAlert(errors: any, message?: string) {
    if (Array.isArray(errors)) {
      errors.forEach((error: any) => {
        this.handleNotifError(error, message);
      });
    } else {
      this.handleNotifError(errors, message);
    }
  }

  openSuccessAlert(label: string, message: string, status?: TuiNotification) {
    this.alertService
      .open(message, {
        status: status ?? TuiNotification.Success,
        label: label,
      })
      .pipe(take(1))
      .subscribe();
  }

  private handleNotifError(error: any, message?: string) {
    console.error(error);
    this.alertService
      .open(message ?? error.message, {
        label: 'Error',
        status: TuiNotification.Error,
      })
      .pipe(take(1))
      .subscribe();
  }
}
