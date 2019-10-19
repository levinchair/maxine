import { Component } from '@angular/core';
import { CentralService } from './Service/central.service';

//material
import {MatDialog, MatDialogRef} from '@angular/material';
//spinner component
import { ProgressSpinnerComponent } from "./modalComponents/progress-spinner/progress-spinner.component"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private dialogRef: MatDialogRef<ProgressSpinnerComponent>;

  constructor(private centralService: CentralService,
              private dialog: MatDialog){}

  ngOnInit(){
    this.centralService.showSpinner.subscribe( bol => {
      if(bol){
        this.dialogRef = this.dialog.open(ProgressSpinnerComponent,
            {
              panelClass: 'transparent',
              disableClose: true
            });
      } else {
        if(this.dialogRef !== undefined){
          this.dialogRef.close();
        }
      }
    });
  }

}
