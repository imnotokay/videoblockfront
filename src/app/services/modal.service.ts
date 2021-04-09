import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationComponent } from '../pages/modals/confirmation/confirmation.component';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modales: NgbModal) { }

  /**
   * Función encargada de mostrar un mensaje modal
   * @param message texto que deseas que aparezca en la ventana modal
   * @param type Tipo de notificación que desea mostrar 
   * @enum 1-Información
   * @enum 2-Exito
   * @enum 3-Advertencia
   * @enum 4-Error
   */
  showAlert(message: string, type: number){
    let clase = '', titulo = '';
    
    if(type === 1){
      clase = 'alert-info';
      titulo = 'Información';
    }else if(type === 2){
      clase = 'alert-success';
      titulo = 'Exito';
    }else if (type === 3){
      clase = 'alert-warning';
      titulo = 'Advertencia';
    }else if(type === 4){
      clase = 'alert-danger';
      titulo = 'Error';
    }

    document.getElementById('alertComponent').children[1].innerHTML = titulo;
    document.getElementById('alertComponent').children[2].innerHTML = message;
    document.getElementById('alertComponent').removeAttribute('class');
    document.getElementById('alertComponent').classList.add('customModal');
    document.getElementById('alertComponent').classList.add('show');
    document.getElementById('alertComponent').classList.add('alert');
    document.getElementById('alertComponent').classList.add(clase);
    
    $('#closeAlert').click(function(){
      document.getElementById('alertComponent').classList.remove('show');
      document.getElementById('alertComponent').classList.add('customModal');
      document.getElementById('alertComponent').classList.add('hidemodal');
    })
  }

  /**
   * Función encargada de mostrar una ventana de espera con un mensaje para el usuario
   * @param message Mensaje que se mostrará al usuario mientras se realiza la espera
   */
  showLoading(message){
    $('#loadingComponent').css('display', 'inline-block');
    $('#loadingComponent').find('span').html(message);
  }

  /**
   * Función encargada de cambiar el texto mostrado en una ventana de espera
   * @param message Mensaje a cambiar en una espera abierta
   */
  changeLoadingText(message){
    $('#loadingComponent').find('span').html(message);
  }

  /**
   * Funcíon encargada de ocultar una espera, esta tambien limpia el texto del último mensaje mostrado
   */
  hideLoading(){
    $('#loadingComponent').css('display', 'none');
    $('#loadingComponent').find('span').html('');
  }

  showConfirm(title, message){
    return new Promise((resolve, reject)=>{
      let ref = this.modales.open(ConfirmationComponent,
        {
          size: 'md',
          centered: true,
          backdrop:'static'
        });
    
        ref.componentInstance.Title = title;
        ref.componentInstance.Message = message;

        ref.result.then((res:boolean)=>{
          if(res){
            resolve('');
          }else{
            reject();
          }
        })
    });
  }
}
