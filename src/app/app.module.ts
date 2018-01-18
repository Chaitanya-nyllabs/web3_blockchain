import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import { OwnerComponent } from './owner/owner.component';
import { AppRoutingModule } from './/app-routing.module';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import {SolContractService} from './sol-contract.service';
import { NYLAdminDashboardComponent } from './NYLadmin-dashboard/NYLadmin-dashboard.component';
import { FidadminDashboardComponent } from './fidadmin-dashboard/fidadmin-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    OwnerComponent,
    UserComponent,
    LoginComponent,
    NYLAdminDashboardComponent,
    FidadminDashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [ SolContractService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
