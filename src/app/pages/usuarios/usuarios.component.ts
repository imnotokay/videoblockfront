import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng';
import { IDataGrid } from 'src/app/interfaces/idata-grid';
import { IUsuarios } from 'src/app/interfaces/iusuarios';
import { ModalService } from 'src/app/services/modal.service';
import { OnSelectTableService } from 'src/app/services/on-select-table.service';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  collectionSize: number;
  page: number;
  pageSize: number;
  enable: boolean;
  model: IUsuarios;
  DataGrid: Array<IUsuarios>;
  Password: string;
  Roles: SelectItem[];
  TiposDocumento: SelectItem[];
  es: any;

  constructor(private rest: RestService, private modal:ModalService, private onselect: OnSelectTableService) 
  {
    this.page = 1;
    this.pageSize = 5;
    this.collectionSize = 0;
    this.enable = false;
    this.model = {
      Codigo: -1,
      Usuario: '',
      Password: '',
      Nombres: '',
      Apellidos: '',
      Correo: '',
      Rol: null,
      Cliente: {
        Codigo: -1,
        Documento: '',
        TipoDocumento: null,
        FechaNacimiento: null
      }
    };
    this.Password = '';
    this.Roles = [
      { label: 'Seleccione una Opción', value: null },
      { label: 'Administrador', value: 1 },
      { label: 'Cliente', value: 2 },
    ];
    this.es = {
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sáb"],
      dayNamesMin: ["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
      monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dic" ],
      today: 'Hoy',
      clear: 'Limpiar',
      dateFormat: 'dd/MM/yy',
      weekHeader: 'Se'
    };

    this.TiposDocumento = [
      { label: 'Seleccione una Opción', value: null },
      { label: 'Cedula de Ciudadanía', value: 1 },
      { label: 'Tarjeta de Identidad', value: 2 },
      { label: 'Pasaporte', value: 3 },
      { label: 'Cedula Extenjería', value: 4 },
      { label: 'N.I.T.', value: 5 }
    ];
  }

  ngOnInit() {
    this.cargarGrid();
  }


  cargarGrid(){
    this.rest.get('api/Usuarios?Take=' + this.pageSize + '&Skip=' + (((this.page - 1) * this.pageSize))).then((res:IDataGrid<IUsuarios>)=>{
      this.DataGrid = res.Data;
      this.collectionSize = res.Count;
    }).catch(err=>{
    });
  }

  Crear(){
    localStorage.setItem('isSaving', 'true');
    this.enable = true;
    this.Password = '';
    this.model = {
      Codigo: -1,
      Usuario: '',
      Password: '',
      Nombres: '',
      Apellidos: '',
      Correo: '',
      Rol: null,
      Cliente: {
        Codigo: -1,
        Documento: '',
        TipoDocumento: null,
        FechaNacimiento: null
      }
    };
  };

  Cancelar(){
    localStorage.setItem('isSaving', 'false');
    this.enable = false;
    this.Password = '';
    this.model = {
      Codigo: -1,
      Usuario: '',
      Password: '',
      Nombres: '',
      Apellidos: '',
      Correo: '',
      Rol: null,
      Cliente: {
        Codigo: -1,
        Documento: '',
        TipoDocumento: null,
        FechaNacimiento: null
      }
    };
    this.cargarGrid();
  };

  Guardar(){
    let message = '';
    if(this.model.Usuario.trim() === ''){
      message += '<li>Debe ingresar el campo "Usuario"</li>';
    }else if (this.model.Usuario.length > 50){
      message += '<li>La longitud máxima para el campo "Usuario" es de 50 caracteres</li>';
    }
    
    if(this.model.Password.trim() === ''){
      message += '<li>Debe ingresar el campo "Contraseña"</li>';
    }else if (this.model.Password.length > 255){
      message += '<li>La longitud máxima para el campo "Contraseña" es de 255 caracteres</li>';
    }
    
    if(this.Password.trim() === ''){
      message += '<li>Debe ingresar el campo "Repita Contraseña"</li>';
    }else if (this.Password.length > 255){
      message += '<li>La longitud máxima para el campo "Repita Contraseña" es de 255 caracteres</li>';
    }

    if(this.Password.trim() !== '' && this.model.Password !== ''){
      if(this.Password != this.model.Password){
        message += '<li>Los campos de contraseña deben coincidir</li>';
      }
    }
    if(this.model.Correo.trim() === ''){
      message += '<li>Debe ingresar el campo "Correo Electrónico"</li>';
    }else if (this.model.Correo.length > 150){
      message += '<li>La longitud máxima para el campo "Correo Electrónico" es de 150 caracteres</li>';
    }else if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.model.Correo)){
      message += '<li>El formato de correo electrónico no es válido, corrigalo e intentelo de nuevo. Ej. info@correo.com</li>';
    }

    if(this.model.Rol == null){
      message += '<li>Debe seleccionar un valor para el campo "Rol"</li>';
    }else if (this.model.Rol == 2){
      if(this.model.Cliente.Documento.trim() == ''){
        message += '<li>Debe ingresar el campo "Documento"</li>';
      }else if (this.model.Cliente.Documento.length > 15){
        message += '<li>La longitud máxima para el campo "Documento" es de 15 caracteres</li>';
      }

      if(this.model.Cliente.TipoDocumento == null){
        message += '<li>Debe ingresar el campo "Tipo Documento"</li>';
      }

      if(this.model.Cliente.FechaNacimiento == null){
        message += '<li>Debe ingresar el campo "Fecha Nacimiento"</li>';
      }
    }

    if(message !== ''){
      this.modal.showAlert('<ul>' + message + '</ul>', 3);
    }else{
      if (this.model.Codigo === -1) {
        this.modal.showLoading('Almacenando información');
        this.rest.post('api/Usuarios', this.model).then(res=>{
          this.modal.hideLoading();
          this.modal.showAlert('Información almacenada satisfactoriamente', 2);
          this.Cancelar();
        }).catch(err=>{
          this.modal.hideLoading();
        });
      }else{
        this.modal.showLoading('Almacenando información');
        this.rest.put('api/Usuarios', this.model).then(res=>{
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
        this.rest.delete('api/Usuarios?codigo=' + data.Codigo).then(res=>{
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
