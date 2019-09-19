import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';

import { LoginComponent } from './login/login.component';
import { A_LoginComponent } from './login/a-login/a-login.component';
import { C_LoginComponent } from './login/c-login/c-login.component';
import { S_LoginComponent } from './login/s-login/s-login.component';
import { V_LoginComponent } from './login/v-login/v-login.component';

import { A_C_AddComponent } from './admin/a-contractor/a-c-add/a-c-add.component';
import { A_C_UpdateComponent } from './admin/a-contractor/a-c-update/a-c-update.component';
import { A_C_ViewComponent } from './admin/a-contractor/a-c-view/a-c-view.component';
import { A_FeedbackComponent } from './admin/a-feedback/a-feedback.component';
import { A_R_AddComponent } from './admin/a-resident/a-r-add/a-r-add.component';
import { A_R_UpdateComponent } from './admin/a-resident/a-r-update/a-r-update.component';
import { A_R_ViewComponent } from './admin/a-resident/a-r-view/a-r-view.component';
import { A_S_AddComponent } from './admin/a-staff/a-s-add/a-s-add.component';
import { A_S_UpdateComponent } from './admin/a-staff/a-s-update/a-s-update.component';
import { A_S_ViewComponent } from './admin/a-staff/a-s-view/a-s-view.component';
import { A_V_UpdateComponent } from './admin/a-visitor/a-v-update/a-v-update.component';
import { A_V_ViewComponent } from './admin/a-visitor/a-v-view/a-v-view.component';

import { C_UpdateComponent } from './contractor/c-update/c-update.component';

import { S_FeedbackComponent } from './staff/s-feedback/s-feedback.component';
import { S_R_ScheduleComponent } from './staff/s-resident/s-r-schedule/s-r-schedule.component';
import { S_R_ViewComponent } from './staff/s-resident/s-r-view/s-r-view.component';
import { S_V_ViewComponent } from './staff/s-visitor/s-v-view/s-v-view.component';

import { V_B_AddComponent } from './visitor/v-booking/v-b-add/v-b-add.component';
import { V_B_ModifyComponent } from './visitor/v-booking/v-b-modify/v-b-modify.component';
import { V_B_ViewComponent } from './visitor/v-booking/v-b-view/v-b-view.component';
import { V_R_AddComponent } from './visitor/v-resident/v-r-add/v-r-add.component';
import { V_R_ViewComponent } from './visitor/v-resident/v-r-view/v-r-view.component';
import { V_RegisterComponent } from './visitor/v-register/v-register.component';
import { V_UpdateComponent } from './visitor/v-update/v-update.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login'},
  {
    path: 'login', component: LoginComponent,
    children: [
      { path: 'login-a', component: A_LoginComponent },
      { path: 'login-c', component: C_LoginComponent },
      { path: 'login-s', component: S_LoginComponent },
      { path: 'login-v', component: V_LoginComponent }
    ]
  },
  {
    path: 'admin',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'contractor-view' },
      { path: 'contractor-add', component: A_C_AddComponent },
      { path: 'contractor-update', component: A_C_UpdateComponent },
      { path: 'contractor-view', component: A_C_ViewComponent },
      { path: 'feedback', component: A_FeedbackComponent },
      { path: 'resident-add', component: A_R_AddComponent },
      { path: 'resident-update', component: A_R_UpdateComponent },
      { path: 'resident-view', component: A_R_ViewComponent },
      { path: 'staff-add', component: A_S_AddComponent },
      { path: 'staff-update', component: A_S_UpdateComponent },
      { path: 'staff-view', component: A_S_ViewComponent },
      { path: 'visitor-update', component: A_V_UpdateComponent },
      { path: 'visitor-view', component: A_V_ViewComponent }
    ]
  },
  {
    path: 'contractor',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'update' },
      { path: 'update', component: C_UpdateComponent }
    ]
  },
  {
    path: 'staff',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'visitor-view' },
      { path: 'feedback', component: S_FeedbackComponent },
      { path: 'resident-schedule', component: S_R_ScheduleComponent },
      { path: 'resident-view', component: S_R_ViewComponent },
      { path: 'visitor-view', component: S_V_ViewComponent }
    ]
  },
  { path: 'register', component: V_RegisterComponent },
  {
    path: 'visitor',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'booking-view' },
      { path: 'booking-add', component: V_B_AddComponent },
      { path: 'booking-modify', component: V_B_ModifyComponent },
      { path: 'booking-view', component: V_B_ViewComponent },
      { path: 'resident-add', component: V_R_AddComponent },
      { path: 'resident-view', component: V_R_ViewComponent },
      { path: 'update', component: V_UpdateComponent }
    ]
  },
  { path: '404', component: NotFoundComponent },
  //{ path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
