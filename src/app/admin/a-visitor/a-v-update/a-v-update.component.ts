import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import swal from 'sweetalert';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { capitalize, isNumeric } from 'src/app/functions';
import { mergeMap } from 'rxjs/operators';
import { Flag } from 'src/app/classes';

@Component({
  selector: 'app-a-v-update',
  templateUrl: './a-v-update.component.html',
  styleUrls: ['./a-v-update.component.scss']
})
export class A_V_UpdateComponent implements OnInit {

  id: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'visitor-update']);

    this.validateUserType().then(res => {
      if(res) { 
        this.adminService.updateId.pipe(
          mergeMap(id => {
            this.id = id
            $('#visitorID').val(id);
            return this.adminService.getVisitor(id);
          })
        ).subscribe(res => {
          let flags = res.flags;
          this.loadFlagTable(flags);
        });
      }
    });

    $('#inputFirstName, #inputLastName, #inputPhone').keyup(e => {
      if(e.which == 13) {
        this.updateVisitor();
      }
    });
  }

  validateUserType() {
    return new Promise((resolve, reject) => {
      this.authService.checkUserType();
      resolve(this.router.url.includes("/admin/visitor-update"));
    })
  }

  loadFlagTable(flags: Flag[]) {
    for(let i = 0; i <= 3; i++) {
      const flag = flags[i - 1];
      $('p#date-' + i).text(flag.date);
      $('p#staff-' + i).text(flag.staff);
      $('span#view-' + i).show();
      $('span#view-' + i).click(() => {
        this.viewFlag(flag, flags, i - 1, this.id);
      });
    }
  }

  viewFlag(flag: Flag, flags: Flag[], index: number, visitorId: string) {
    swal({
      text: `Date flagged: ${flag.date}
      Flagged by: ${flag.staff}
      Reason: ${flag.reason}`,
      icon: "info",
      buttons: {
        cancel: "Clear flag",
        ok: "OK"
      }
    } as any)
    .then((pressOk) => {
      if(!pressOk) {
        swal({
          title: "Clear flag?",
          text: "Are you sure you want to clear this flag?",
          icon: "warning",
          dangerMode: true,
          buttons: {
            cancel: "Cancel",
            ok: "Yes"
          }
        } as any)
        .then((willClear) => {
          if(willClear) {
            this.adminService.clearFlag(flags, index, visitorId);
            swal("Flag cleared!", {
              icon: "success",
            })
          }
        });
      }
    });
  }

  updateVisitor(){
    const vFirstName = capitalize($('#inputFirstName').val());
    const vLastName = capitalize($('#inputLastName').val());
    const phone = $('#inputPhone').val();
    
    const updates = this.showUpdates(vFirstName, vLastName, phone)
    if(updates != "") {
      if(isNumeric(phone)) {
        swal({
          title: "New updates:",
          text: updates,
          icon: "info",
          dangerMode: true,
          buttons: {
            cancel: "Cancel",
            ok: "Update"
          }
        } as any)
        .then((willUpdate) => {
          if(willUpdate) {
            this.adminService.updateVisitor(this.id, vFirstName, vLastName, phone);
            swal({
              title: "Success!",
              text: "Details updated!",
              icon: "success",
              buttons: {
                ok: "OK"
              }
            } as any)
          }
        });
      }
      else {
        swal({
          title: "Error!",
          text: "The provided phone number can only be digits!",
          icon: "error",
          buttons: {
            ok: "OK"
          }
        } as any)
      }
    }
    else {
      swal({
        title: "Error!",
        text: "Please update at least one field!",
        icon: "error",
        buttons: {
          ok: "OK"
        }
      } as any)
    }
  }

  private showUpdates(sFirstName, sLastName, phone) {
    let updates = "";
    updates += (sFirstName == "") ? "" : "First Name: " + sFirstName + "\n";
    updates += (sLastName == "") ? "" : "Last Name: " + sLastName + "\n";
    updates += (phone == "") ? "" : "Phone: " + phone + "\n";
    return updates;
  }

}
