import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { capitalize } from '../../functions';
import swal from 'sweetalert';

@Component({
  selector: 'app-v-register',
  templateUrl: './v-register.component.html',
  styleUrls: ['./v-register.component.scss']
})
export class V_RegisterComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.router.navigate(['/register']);

    this.authService.registerVisitor(capitalize("Jacques"), capitalize("Bates"));
  }

  register(){
     //if not all fields are filled in, show popup
     
     swal({
      title: "Error!",
      text: "Not all fields are filled in",
      icon: "error",
      buttons: {
        ok: "OK"
      }
    } as any)
    
    // else, if the resident names don't match
    swal({
      title: "Error!",
      text: "Resident names don't match",
      icon: "error",
      buttons: {
        ok: "OK"
      }
    } as any)

    //else, routerlink to success page?

    this.router.navigate(['/visitor','register-success']);
    
  }
  

}
