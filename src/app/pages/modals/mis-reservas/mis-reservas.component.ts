import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IDataGrid } from 'src/app/interfaces/idata-grid';
import { IReservas } from 'src/app/interfaces/ireservas';
import { ModalService } from 'src/app/services/modal.service';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.scss']
})
export class MisReservasComponent implements OnInit {
  collectionSize: number;
  page: number;
  pageSize: number;
  DataGrid: Array<IReservas>;
  constructor(private rest: RestService, public activeModal: NgbActiveModal) {
    this.page = 1;
    this.pageSize = 5;
    this.collectionSize = 0;
  }
  ngOnInit() {
    this.cargarGrid();
  }

  cargarGrid(){
    this.rest.get('api/Reservas/Cliente?Take=' + this.pageSize + '&Skip=' + (((this.page - 1) * this.pageSize))).then((res:IDataGrid<IReservas>)=>{
      this.DataGrid = res.Data;
      this.collectionSize = res.Count;
    }).catch(err=>{
    });
  }

  onChange(e){
    this.page = e;
    this.cargarGrid();
  }

}
