import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-v-update',
  templateUrl: './v-update.component.html',
  styleUrls: ['./v-update.component.scss']
})
export class V_UpdateComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['/visitor', 'update']);
  }

  updateDetails(){
        
    //if fields are not filled in
        swal({
          title: "Error!",
          text: "All fields are not filled in!",
          icon: "error",
          buttons: {
            ok: "OK"
          }
        } as any)
      
      // else, add resident to firebase collection
  
      swal({
        title: "Success!",
        text: "Details updated",
        icon: "success",
        buttons: {
          ok: "OK"
        }
      } as any)
      this.router.navigate(['/visitor','booking-view']); //return to booking screen
    }

}
