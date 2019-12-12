import { Component, OnInit,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

  constructor() { }
  expanded = true;
  sideBarState = "block"
  ngOnInit() {
  }

  toggleSidebar(){
    if(this.expanded){
      //Needs to Collapse sidebar
      this.sideBarState = "none"
      this.expanded = false;
    }else{
      //Needs to expand sidebar
      this.sideBarState = "block"
      this.expanded = true;
    }
  }
}
