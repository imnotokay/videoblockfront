import { Component, OnInit } from '@angular/core';
import { IActores } from 'src/app/interfaces/iactores';
import { IDataGrid } from 'src/app/interfaces/idata-grid';
import { IPeliculas } from 'src/app/interfaces/ipeliculas';
import { ModalService } from 'src/app/services/modal.service';
import { OnSelectTableService } from 'src/app/services/on-select-table.service';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.component.html',
  styleUrls: ['./peliculas.component.scss']
})
export class PeliculasComponent implements OnInit {
  collectionSize: number;
  page: number;
  pageSize: number;
  enable: boolean;
  model: IPeliculas;
  DataGrid: Array<IPeliculas>;
  ResultActores: Array<IActores>;
  GlobalActores: Array<IActores>;

  constructor(private rest: RestService, private modal:ModalService, private onselect: OnSelectTableService) 
  {
    this.page = 1;
    this.pageSize = 5;
    this.collectionSize = 0;
    this.enable = false;
    this.model = {
      Codigo: -1,
      Titulo: '',
      Actores: [],
      CantidaInventario: null,
      CostoAlquiler: null,
      Director: ''
    };
    this.ResultActores = [];
    this.GlobalActores = [];
  }

  ngOnInit() {
    this.cargarGrid();
    this.rest.get('api/Actores/Cmb').then((res: Array<IActores>)=>{
      
      this.ResultActores = res;
      this.GlobalActores = res;
    });
  }

  search(event){
    this.ResultActores = this.GlobalActores.filter(x=> x.Nombre.toLowerCase().indexOf(event.query.toLowerCase(), 0) != -1);
  }

  cargarGrid(){
    this.rest.get('api/Peliculas?Take=' + this.pageSize + '&Skip=' + (((this.page - 1) * this.pageSize))).then((res:IDataGrid<IPeliculas>)=>{
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
      Titulo: '',
      Actores: [],
      CantidaInventario: null,
      CostoAlquiler: null,
      Director: ''
    };
  };

  Cancelar(){
    localStorage.setItem('isSaving', 'false');
    this.enable = false;
    this.model = {
      Codigo: -1,
      Titulo: '',
      Actores: [],
      CantidaInventario: null,
      CostoAlquiler: null,
      Director: ''
    };
    this.cargarGrid();
    
  };

  Guardar(){
    let message = '';
    if(this.model.Titulo.trim() === ''){
      message = '<li>Debe ingresar el campo "Título"</li>';
    }else if (this.model.Titulo.length > 100){
      message += '<li>La longitud máxima para el campo "Título" es de 100 caracteres</li>';
    }
    
    if(this.model.Director.trim() === ''){
      message = '<li>Debe ingresar el campo "Director"</li>';
    }else if (this.model.Director.length > 200){
      message += '<li>La longitud máxima para el campo "Director" es de 200 caracteres</li>';
    }

    if(this.model.CostoAlquiler === null){
      message += '<li>Debe ingresar el campo "Costo Alquiler"</li>';
    }

    if(this.model.CantidaInventario === null){
      message += '<li>Debe ingresar el campo "Cantidad Inventario"</li>';
    }

    if(this.model.Actores.length === 0){
      message += '<li>Debe seleccionar al menos un valor en el campo "Actores"</li>';
    }

    if(message !== ''){
      this.modal.showAlert('<ul>' + message + '</ul>', 3);
    }else{
      if (this.model.Codigo === -1) {
        this.modal.showLoading('Almacenando información');
        this.rest.post('api/Peliculas', this.model).then(res=>{
          this.modal.hideLoading();
          this.modal.showAlert('Información almacenada satisfactoriamente', 2);
          this.Cancelar();
        }).catch(err=>{
          this.modal.hideLoading();
        });
      }else{
        this.modal.showLoading('Almacenando información');
        this.rest.put('api/Peliculas', this.model).then(res=>{
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
        this.rest.delete('api/Peliculas?codigo=' + data.Codigo).then(res=>{
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

  mapearActores(actores: Array<IActores>): string{
    let result: string = '';
    actores.map(x=>{
      result += result == '' ? '': ',';
      result += x.Nombre;
    });

    return result;
  }

}
