import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './pages/modals/login/login.component';
import { MisReservasComponent } from './pages/modals/mis-reservas/mis-reservas.component';
import { RestService } from './services/rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAdmin = false;
  CurrentTitle: string;
  title = 'VideoBlock';
  constructor(private rest: RestService, private modales: NgbModal, private router: Router){
    this.CurrentTitle = '';
  }
  ngOnInit(): void {
    this.router.events.subscribe((event: any)=>{
      if(event instanceof NavigationEnd){
        this.rest.get('api/Seguridad/getRole').then(res=>{
          if(res !== 1){
            if(window.location.pathname !== '/' && window.location.pathname !== '/inicio'){
              window.location.href = '/';
            }
          }else{
            this.isAdmin = true;
          }
        });
      }
    });
  }

  isAuthenticated(): Boolean{
    if(localStorage.getItem('isAuthenticated') === null || localStorage.getItem('isAuthenticated') === 'false' || localStorage.getItem('isAuthenticated') === undefined){
      return false;
    }else{
      return true;
    }
  }

  login(){
    let ref = this.modales.open(LoginComponent,
    {
      size: 'md',
      centered: true,
      backdrop:'static'
    });

    ref.result.then(res=>{

    });
  }

  mostrarReservas(){
    let ref = this.modales.open(MisReservasComponent,
      {
        size: 'xl',
        centered: true,
        backdrop:'static'
      });
  
      ref.result.then(res=>{
  
      });
  }
}
