import { Injectable } from '@angular/core';
import { DomService } from './dom-service.service';
import { CentralService } from '../Service/central.service';
@Injectable()
export class ModalService {

  constructor(private domService: DomService,
              private centralService: CentralService) { }

  private modalElementId = 'modal-container';
  private overlayElementId = 'overlay';

  init(component: any, inputs: object, outputs: object) {
    let componentConfig = {
      inputs:inputs,
      outputs:outputs
    }
    this.domService.appendComponentTo(this.modalElementId, component, componentConfig);
    this.centralService.getChartData();
    document.getElementById(this.modalElementId).className = 'show';
    document.getElementById(this.overlayElementId).className = 'show';
  }

  destroy() {
    this.domService.removeComponent();
    document.getElementById(this.modalElementId).className = 'hidden';
    document.getElementById(this.overlayElementId).className = 'hidden';
  }
}
