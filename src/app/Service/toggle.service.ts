import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  // isOpen = false;
  // isViewOneTableOpen = false;
  // @Output() change: EventEmitter<boolean> = new EventEmitter();
  // @Output() changeViewOneTable: EventEmitter<boolean> = new EventEmitter();
  changeViewOneTable: EventEmitter<boolean> = new EventEmitter

  // toggle() {
  //   // this.isOpen = !this.isOpen;
  //   // this.change.emit(this.isOpen);
  // }

  // toggleViewOneTable() {
  //   // this.isViewOneTableOpen = !this.isViewOneTableOpen;
  //   // this.changeViewOneTable.emit(this.isViewOneTableOpen);
  // }
}
