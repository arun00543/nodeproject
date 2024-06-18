import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export class NOR {
  data?:any;
  formData?:any;
  class:string
}
@Injectable()
export class SharedService {

  private id = sessionStorage.getItem("e_IdFe") ? parseInt(sessionStorage.getItem("e_IdFe")) : null;
  private orderDetails = sessionStorage.getItem("u_OD") ? JSON.parse(sessionStorage.getItem("u_OD")) : null;
  private orderStatusDetail = sessionStorage.getItem("u_OSD") ? JSON.parse(sessionStorage.getItem("u_OSD")) : null;
  private leaveDetails = sessionStorage.getItem("u_LD") ? JSON.parse(sessionStorage.getItem("u_LD")) : null;
  private className = sessionStorage.getItem("ie_CN") ? sessionStorage.getItem("ie_CN") : null;
  private notification = sessionStorage.getItem("e_tGN") ? JSON.parse(sessionStorage.getItem("e_tGN")) : null;
  private newItem : NOR = sessionStorage.getItem("i_NOR") ? JSON.parse(sessionStorage.getItem("i_NOR")) : null;
  private activeRoute = sessionStorage.getItem("l_AR") ? sessionStorage.getItem("l_AR") : null;

  set toEdit(id) {
    this.id = id;
    sessionStorage.setItem("e_IdFe", JSON.stringify(id));
  }

  get toEdit() {
    return this.id;
  }

  set orderDetail(orderDetails) {
    this.orderDetails = orderDetails;
    sessionStorage.setItem("u_OD", JSON.stringify(orderDetails));
  }

  get orderDetail() {
    return this.orderDetails;
  }

  set orderStatus(orderStatusDetail) {
    this.orderStatusDetail = orderStatusDetail;
    sessionStorage.setItem("u_OSD", JSON.stringify(orderStatusDetail));
  }

  get orderStatus() {
    return this.orderStatusDetail;
  }

  set leaveDetail(leaveDetails) {
    this.leaveDetails = leaveDetails;
    sessionStorage.setItem("u_LD", JSON.stringify(leaveDetails));
  }

  get leaveDetail() {
    return this.leaveDetails;
  }

  set importExportClass(className) {
    this.className = className;
    sessionStorage.setItem("ie_CN", className);
  }

  get importExportClass() {
    return this.className;
  }

  set generalNotification(data) {
    this.notification = data;
    sessionStorage.setItem("e_tGN", JSON.stringify(data));
  }

  get generalNotification() {
    return this.notification;
  }

  set newOnRow(data) {
    this.newItem = data;
    sessionStorage.setItem("i_NOR", JSON.stringify(data));
  }

  get newOnRow() {
    return this.newItem;
  }

  set activeLink(data) {
    this.activeRoute = data;
    sessionStorage.setItem("l_AR", data);
  }

  get activeLink() {
    return this.activeRoute;
  }
}