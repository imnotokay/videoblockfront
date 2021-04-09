import { Component, OnInit } from '@angular/core';
import { IDataGrid } from 'src/app/interfaces/idata-grid';
import { IReservas } from 'src/app/interfaces/ireservas';
import { ModalService } from 'src/app/services/modal.service';
import { OnSelectTableService } from 'src/app/services/on-select-table.service';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {
  collectionSize: number;
  page: number;
  pageSize: number;
  DataGrid: Array<IReservas>;
  constructor(private rest: RestService, private modal: ModalService, private onselect: OnSelectTableService) {
    this.page = 1;
    this.pageSize = 5;
    this.collectionSize = 0;
  }
  ngOnInit() {
    this.cargarGrid();
  }

  cargarGrid(){
    this.rest.get('api/Reservas?Take=' + this.pageSize + '&Skip=' + (((this.page - 1) * this.pageSize))).then((res:IDataGrid<IReservas>)=>{
      this.DataGrid = res.Data;
      this.collectionSize = res.Count;
    }).catch(err=>{
    });
  }

  onChange(e){
    this.page = e;
    this.cargarGrid();
  }

  entregar(){
    let data = this.onselect.Select('tbl');
    if(data === null){
      this.modal.showAlert('Debe seleccionar una fila para continuar', 3);
    }else{
      this.modal.showConfirm('Devolución', 'Esta seguro que desea realizar la devolución de la pelicula ' + data.Pelicula + ' para el cliente ' + data.Cliente).then(()=>{
        this.modal.showLoading('Generando devolución');
        data.Estado = 2;
        this.rest.put('api/Reservas', data).then(res=>{
          this.modal.hideLoading();
          this.modal.showAlert('Devolución realizada satisfactoriamente', 1);
          this.cargarGrid();
        }).catch(err=>{
          this.modal.hideLoading();
        });
      });
    }
  }
  
  onSelect(e:MouseEvent, item: any){
    this.onselect.onSelect(e, item);
  }
}
