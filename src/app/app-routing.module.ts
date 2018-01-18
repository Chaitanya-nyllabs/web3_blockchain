import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OwnerComponent } from './owner/owner.component';
import {UserComponent} from './user/user.component';
import {LoginComponent} from './login/login.component';
import {NYLAdminDashboardComponent} from './NYLadmin-dashboard/NYLadmin-dashboard.component';
import {FidadminDashboardComponent} from './fidadmin-dashboard/fidadmin-dashboard.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: OwnerComponent },
  {path: 'user', component: UserComponent},
  {path: 'login', component: LoginComponent},
  {path: 'nyl_admin', component: NYLAdminDashboardComponent},
  {path: 'fid_admin', component: FidadminDashboardComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule]

})

export class AppRoutingModule {
}
