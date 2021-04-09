import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ActoresComponent } from './pages/actores/actores.component';
import { PeliculasComponent } from './pages/peliculas/peliculas.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ConfirmationComponent } from './pages/modals/confirmation/confirmation.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalService } from './services/modal.service';
import { RestService } from './services/rest.service';
import { LoginComponent } from './pages/modals/login/login.component';
import { AutoCompleteModule, CalendarModule, DropdownModule, KeyFilterModule } from 'primeng';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { MisReservasComponent } from './pages/modals/mis-reservas/mis-reservas.component';
import { ReservasComponent } from './pages/reservas/reservas.component';

registerLocaleData(localeES);
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ActoresComponent,
    PeliculasComponent,
    UsuariosComponent,
    ConfirmationComponent,
    LoginComponent,
    MisReservasComponent,
    ReservasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    DropdownModule,
    KeyFilterModule,
    AutoCompleteModule,
    CalendarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'ES'},
    ModalService,
    RestService
  ],
  bootstrap: [AppComponent],
  entryComponents:[
    ConfirmationComponent,
    LoginComponent,
    MisReservasComponent
  ]
})
export class AppModule { }
