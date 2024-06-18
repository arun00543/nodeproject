import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(
    http: HttpClient
  ) { }
  showNotification(from, align, message){

    const icon = (message?.status === "danger" ? "fa-trash" : message?.status === "warning" ? "fa-exclamation-triangle" : "fa-check");

      $.notify({
          icon: "info",
          title: (message?.status === "danger" ? "SUCCESS" : message?.status === "info" ? "UPDATED" : message?.status.toUpperCase()),
          message: message.message

      },{
          type: message.status,
          delay: 2000,
          // timer: -3000,
          placement: {
              from: from,
              align: align
          },
          template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
            '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="fa fa-times" style="color:black;font-size:21px;" aria-hidden="true"></i></button>' +
            `<i class="fa ${icon}" style="color: black;
            font-size: xx-large;
            margin-left: -46px;
            margin-top: 23px;
            position: absolute;" aria-hidden="true"></i> ` +
            '<span data-notify="title" style="font-size: larger;" class="notifications-title">{1}</span> ' +
            '<span data-notify="message" class="notifications-message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
              '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
          '</div>'
      });
  }
  ngOnInit() {
  }

}
