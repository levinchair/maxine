import { Component } from '@angular/core';
import { ModalService } from './Service/modal-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private modalService: ModalService){}

  removeModal(){
    this.modalService.destroy();
  }
}
