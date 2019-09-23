import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import swal from 'sweetalert';
import { AuthService } from 'src/app/auth.service';
import { VisitorService } from '../../visitor.service';
import { capitalize } from 'src/app/functions';

@Component({
  selector: 'app-v-r-add',
  templateUrl: './v-r-add.component.html',
  styleUrls: ['./v-r-add.component.scss']
})
export class V_R_AddComponent implements OnInit {

  id: string

  constructor(
    private authService: AuthService,
    private visitorService: VisitorService,
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['/visitor', 'resident-add']);

    this.validateUserType().then(res => {
      if(res) {
        this.visitorService.getId();
        this.visitorService.id.subscribe(id => {
          this.id = id;
          $('#inputFirstName, #inputLastName').keyup(e => {
            if(e.which == 13) {
              this.addResident();
            }
          });
        });
      }
    });
  }

  validateUserType() {
    return new Promise((resolve, reject) => {
      this.authService.checkUserType();
      resolve(this.router.url.includes("/visitor/resident-add"));
    })
  }

  addResident(){
    const rFirstName = capitalize($('#inputFirstName').val());
    const rLastName = capitalize($('#inputLastName').val());
    if(rFirstName != "" && rLastName != "") {
      this.visitorService.addResident(this.id, rFirstName, rLastName);
    }
    else {
      swal({
        title: "Error!",
        text: "Some fields are left empty!",
        icon: "error",
        buttons: {
          ok: "OK"
        }
      } as any)
    }
  }

}
