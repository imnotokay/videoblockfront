import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IActores } from 'src/app/interfaces/iactores';
import { IDataGrid } from 'src/app/interfaces/idata-grid';
import { IPeliculas } from 'src/app/interfaces/ipeliculas';
import { IReservas } from 'src/app/interfaces/ireservas';
import { ModalService } from 'src/app/services/modal.service';
import { RestService } from 'src/app/services/rest.service';
import { LoginComponent } from '../modals/login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  Peliculas: Array<IPeliculas>;
  collectionSize: number;
  page: number;
  pageSize: number;
  DataGrid: Array<IPeliculas>;
  Filter: IPeliculas;
  ResultActores: Array<IActores>;
  GlobalActores: Array<IActores>;

  
  @ViewChild("titulo", { static: false}) titulo:ElementRef;
  @ViewChild("director", { static: false}) director:ElementRef;
  @ViewChild("precio", { static: false}) precio:ElementRef;
  @ViewChild("cantidad", { static: false}) cantidad:ElementRef;

  constructor(private rest:RestService, private modal: ModalService, private modales: NgbModal) { 
    this.page = 1;
    this.pageSize = 5;
    this.collectionSize = 0;
    this.Filter = {
      Codigo: -1,
      Actores: [],
      CantidaInventario: 0,
      CostoAlquiler: 0,
      Director: '',
      Titulo: ''
    }
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
    
    if(this.Filter.CostoAlquiler === null || this.Filter.CostoAlquiler.toString() === ''){
      this.Filter.CostoAlquiler = 0;
    }
    if(this.Filter.CantidaInventario === null || this.Filter.CantidaInventario.toString() === ''){
      this.Filter.CantidaInventario = 0;
    }
    this.rest.get('api/Peliculas/Reservas?Take=' + this.pageSize + '&Skip=' + (((this.page - 1) * this.pageSize)) + '&filter=' + JSON.stringify(this.Filter)).then((res:IDataGrid<IPeliculas>)=>{
      this.DataGrid = res.Data;
      this.collectionSize = res.Count;
    }).catch(err=>{
    });
  }
  
  reservar(codigo: number){
    if(this.isAuthenticated()){
      let reserva: IReservas = {
        Codigo: -1,
        CodigoCliente: -1,
        CodigoPelicula: codigo,
        Estado: 1,
        Cliente: '',
        FechaReserva: new Date(),
        Pelicula: ''
      };
      this.modal.showLoading('Reservando su pelicula');
      this.rest.post('api/Reservas', reserva).then(res=>{
        this.modal.hideLoading();
        this.modal.showAlert('Pelicula reservada satisfactoriamente', 2);
      }).catch(err=>{
        this.modal.hideLoading();
      });
    }else{
      this.modal.showAlert('Para realizar una reserva debe estar autenticado', 1);
      
      let ref = this.modales.open(LoginComponent,
      {
        size: 'md',
        centered: true,
        backdrop:'static'
      });
  
      ref.result.then(res=>{
  
      });
    }
  }

  isAuthenticated(): Boolean{
    if(localStorage.getItem('isAuthenticated') === null || localStorage.getItem('isAuthenticated') === 'false' || localStorage.getItem('isAuthenticated') === undefined){
      return false;
    }else{
      return true;
    }
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

  ngAfterViewInit(){
    fromEvent(this.titulo.nativeElement, 'keyup').pipe(debounceTime(500)).subscribe(c=>{
      this.cargarGrid();
    });
    fromEvent(this.director.nativeElement, 'keyup').pipe(debounceTime(500)).subscribe(c=>{
      this.cargarGrid();
    });
    fromEvent(this.cantidad.nativeElement, 'keyup').pipe(debounceTime(500)).subscribe(c=>{
      this.cargarGrid();
    });
    fromEvent(this.precio.nativeElement, 'keyup').pipe(debounceTime(500)).subscribe(c=>{
      this.cargarGrid();
    });
  }

}
