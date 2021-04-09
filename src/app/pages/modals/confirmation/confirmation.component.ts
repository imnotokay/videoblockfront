import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  @Input() Title;
  @Input() Message;
  @Input() Aceptar;
  @Input() Cancelar;
  labelAceptar: string;
  labelCancelar: string;
  constructor(public activeModal: NgbActiveModal) { 
    if(this.Aceptar){
      this.labelAceptar = this.Aceptar;
    }else{
      this.labelAceptar = 'Aceptar';
    }
    if(this.Cancelar){
      this.labelCancelar = this.Cancelar;
    }else{
      this.labelCancelar = 'Cancelar';
    }
  }

  ngOnInit() {
    if(this.Aceptar){
      this.labelAceptar = this.Aceptar;
    }else{
      this.labelAceptar = 'Aceptar';
    }
    if(this.Cancelar){
      this.labelCancelar = this.Cancelar;
    }else{
      this.labelCancelar = 'Cancelar';
    }
  }

}
