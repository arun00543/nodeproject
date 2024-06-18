import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatCalendar } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { EventDialogComponent } from "app/additional-components/event-dialog/event-dialog.component";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component";
import { AdministrativeService } from "app/core/service/administrative/administrative.service";
import { AuthService } from "app/core/service/auth.service";

export class event {
  id?: number;
  holidayDate: string = "";
  holidayName: string = "";
  updatedBy: number;
}
@Component({
  selector: "app-holiday-tracker",
  templateUrl: "./holiday-tracker.component.html",
  styleUrls: ["./holiday-tracker.component.scss"],
})
export class HolidayTrackerComponent implements OnInit {
  @ViewChild("calendar", { static: false }) calendar: MatCalendar<Date>;
  encapsulation: ViewEncapsulation.None;

  holiday: any[] = [];
  daysSelected: Array<event> = [];
  selectedMonth: any;
  event: any;
  currentUser: number;
  currentDate = new Date();
  checkChange = this.currentDate.getMonth();

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private administrativeService: AdministrativeService,
    private notification: NotificationsComponent
  ) {
    this.currentUser = authService.currentUserValue.userId;
  }

  ngOnInit(): void {
    this.selectedMonth = this.currentDate;
    this.getHoliday(
      this.selectedMonth.getMonth(),
      this.selectedMonth.getFullYear()
    );
  }

  onMonthSelect(event) {
    this.selectedMonth = event;
    this.getHoliday(
      this.selectedMonth.getMonth(),
      this.selectedMonth.getFullYear()
    );
  }

  getHoliday(month, year) {
    this.administrativeService
      .getHolidayList(month + 1, year)
      .subscribe((response) => {
        this.daysSelected = response.data;
        this.calendar.updateTodaysDate();
      });
  }

  isSelected = (event: any) => {
    if (this.checkChange != event.getMonth()) {
      this.selectedMonth = event;
      this.getHoliday(
        this.selectedMonth.getMonth(),
        this.selectedMonth.getFullYear()
      );
      this.checkChange = event.getMonth();
    }
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    return this.daysSelected.find((x) => x.holidayDate == date)
      ? "selected"
      : null;
  };

  select(event: any) {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    const index = this.daysSelected.findIndex((x) => x.holidayDate == date);
    if (index < 0) {
      const dialogRef = this.dialog.open(EventDialogComponent, {
        data:
          event.getFullYear() +
          "-" +
          ("00" + (event.getMonth() + 1)).slice(-2) +
          "-" +
          ("00" + event.getDate()).slice(-2),
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          let data = {
            holidayDate: date,
            holidayName: result,
            updatedBy: this.currentUser,
          };
          this.updateHoliday(data);
        }
      });
    } else {
      this.removeHoliday(this.daysSelected[index].id);
    }
  }

  removeHoliday(id: number) {
    this.administrativeService.deleteHoliday(id).subscribe((res: any) => {
      let message;
      if (res.status === "NO_CONTENT") {
        this.getHoliday(
          this.selectedMonth.getMonth(),
          this.selectedMonth.getFullYear()
        );
        this.notification.showNotification(
          "top",
          "right",
          (message = {
            message: res.message,
            status: "danger",
          })
        );
      } else {
        this.notification.showNotification(
          "top",
          "right",
          (message = {
            message: res.message,
            status: "warning",
          })
        );
      }
    });
  }

  updateHoliday(data) {
    this.administrativeService.postHoliday(data).subscribe((data: any) => {
      let message;
      if (data.status === "OK") {
        this.getHoliday(
          this.selectedMonth.getMonth(),
          this.selectedMonth.getFullYear()
        );
        this.notification.showNotification(
          "top",
          "right",
          (message = {
            message: data.message,
            status: "success",
          })
        );
      } else {
        this.notification.showNotification(
          "top",
          "right",
          (message = {
            message: data.message,
            status: "danger",
          })
        );
      }
    });
  }
}
