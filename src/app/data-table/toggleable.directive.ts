import { Directive, HostListener } from '@angular/core';
import { ToggleService } from '../Service/toggle.service';

@Directive({
  selector: '[viewOneTableToggleable]'
})
export class ToggleableDirective {

  // constructor(private toggleService: ToggleService) { }
  // @HostListener('click')
  // click() {
  //   this.toggleService.toggleViewOneTable();
  // } 
}
// can use ngContent for data showing thing. all table components shall be reusable.