import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/services/modal.service';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login:{
    username: string;
    password: string;
  };
  constructor(private rest: RestService, private modal: ModalService, public activeModal: NgbActiveModal) { 
    this.login = {
      username: '',
      password: ''
    };
  }

  Login(){
    let message = '';
    if(this.login.username.trim() == ''){
      message += '<li>Debe ingresar el campo "Nombre de usuario"</li>';
    }
    if(this.login.password.trim() == ''){
      message += '<li>Debe ingresar el campo "Contraseña"</li>';
    }

    if(message == ''){
      this.modal.showLoading('Intentando iniciar sesión');
      this.rest.login(this.login.username, this.login.password).then((res: any)=>{
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('isAuthenticated', 'true');
        window.location.reload();
        this.modal.hideLoading();
      }).catch(err=>{
        this.modal.hideLoading();
        this.modal.showAlert('Usuaio y/o contraseña erroneos', 3);
      });
    }else{
      this.modal.showAlert(message, 3);
    }
  }

  ngOnInit(): void {
  }

}
