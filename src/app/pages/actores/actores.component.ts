import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectItem } from 'primeng';
import { IActores } from 'src/app/interfaces/iactores';
import { IDataGrid } from 'src/app/interfaces/idata-grid';
import { ModalService } from 'src/app/services/modal.service';
import { OnSelectTableService } from 'src/app/services/on-select-table.service';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-actores',
  templateUrl: './actores.component.html',
  styleUrls: ['./actores.component.scss']
})
export class ActoresComponent implements OnInit {
  collectionSize: number;
  page: number;
  pageSize: number;
  enable: boolean;
  model: IActores;
  DataGrid: Array<IActores>;

  constructor(private rest: RestService, private modal:ModalService, private onselect: OnSelectTableService) 
  {
    this.page = 1;
    this.pageSize = 5;
    this.collectionSize = 0;
    this.enable = false;
    this.model = {
      Codigo: -1,
      Nombre: ''
    };
  }

  ngOnInit() {
    this.cargarGrid();
  }

  cargarGrid(){
    this.rest.get('api/Actores?Take=' + this.pageSize + '&Skip=' + (((this.page - 1) * this.pageSize))).then((res:IDataGrid<IActores>)=>{
      debugger;
      this.DataGrid = res.Data;
      this.collectionSize = res.Count;
    }).catch(err=>{
    });
  }

  Crear(){
    localStorage.setItem('isSaving', 'true');
    this.enable = true;
    this.model = {
      Codigo: -1,
      Nombre: ''
    };
  };

  Cancelar(){
    localStorage.setItem('isSaving', 'false');
    this.enable = false;
    this.model = {
      Codigo: -1,
      Nombre: ''
    };
    this.cargarGrid();
  };

  Guardar(){
    let message = '';
    if(this.model.Nombre.trim() === ''){
      message = '<li>Debe ingresar el campo "Nombre"</li>';
    }else if (this.model.Nombre.length > 200){
      message += '<li>La longitud máxima para el campo "Nombre" es de 200 caracteres</li>';
    }

    if(message !== ''){
      this.modal.showAlert('<ul>' + message + '</ul>', 3);
    }else{
      if (this.model.Codigo === -1) {
        this.modal.showLoading('Almacenando información');
        this.rest.post('api/Actores', this.model).then(res=>{
          this.modal.hideLoading();
          this.modal.showAlert('Información almacenada satisfactoriamente', 2);
          this.Cancelar();
        }).catch(err=>{
          this.modal.hideLoading();
        });
      }else{
        this.modal.showLoading('Almacenando información');
        this.rest.put('api/Actores', this.model).then(res=>{
          this.modal.hideLoading();
          this.modal.showAlert('Información almacenada satisfactoriamente', 2);
          this.Cancelar();
        }).catch(err=>{
          this.modal.hideLoading();
        });
      }
    }
  }

  Editar(){
    let data = this.onselect.Select('tbl');
    if(data === null){
      this.modal.showAlert('Debe seleccionar una fila para continuar', 3);
    }else{
      this.model = data;
      this.enable = true;
      localStorage.setItem('isSaving', 'true');
    }
  }

  Eliminar(){
    let data = this.onselect.Select('tbl');
    if(data === null){
      this.modal.showAlert('Debe seleccionar una fila para continuar', 3);
    }else{
      this.modal.showConfirm('Eliminar Actor', 'Al eliminar el actor se perderá información importante, ¿Desea continuar?').then((res)=>{
        this.modal.showLoading('Eliminando Actor');
        this.rest.delete('api/Actores?codigo=' + data.Codigo).then(res=>{
          this.modal.hideLoading();
          this.modal.showAlert('Información eliminada satisfactoriamente', 2);
          this.Cancelar();
        }).catch(err=>{
          this.modal.hideLoading();
        });
      });
      
    }
  }

  onSelect(e:MouseEvent, item: any){
    this.onselect.onSelect(e, item);
  }

  onChange(e){
    this.page = e;
    this.cargarGrid();
  }

}
