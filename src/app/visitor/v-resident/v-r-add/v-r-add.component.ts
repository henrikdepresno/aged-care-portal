import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-v-r-add',
  templateUrl: './v-r-add.component.html',
  styleUrls: ['./v-r-add.component.scss']
})
export class V_R_AddComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['/visitor', 'resident-add']);
  }

  addResident() {

    //if no resident match found:

      swal({
        title: "Error!",
        text: "Resident not found!",
        icon: "error",
        buttons: {
          ok: "OK"
        }
      } as any)
    
    // else, add resident to firebase collection

    swal({
      title: "Success!",
      text: "Resident added succesfully",
      icon: "success",
      buttons: {
        ok: "OK"
      }
    } as any)
    this.router.navigate(['/visitor','resident-view']); //return to booking screen
  }

}
