import { Directive, HostListener } from '@angular/core';
import { ToggleService } from '../Service/toggle.service';

@Directive({
  selector: '[appToggleable]'
})
export class ToggleableDirective {

  // constructor(private toggleService: ToggleService) { }
  // @HostListener('click')
  // click() {
  //   this.toggleService.toggle();
  // } 
}
