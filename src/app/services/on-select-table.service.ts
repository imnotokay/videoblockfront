import { Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class OnSelectTableService {
  constructor() { }

  onSelect(e:MouseEvent, item: any){ 
    $(e.currentTarget).data('item', item);
    $(e.currentTarget).closest('table').find('.table-active').removeClass('table-active');
    $(e.currentTarget).addClass('table-active');
  }

  Select(tag): any{
    if($('#' + tag).find('.table-active').length === 0){
      return null;
    }else{
      return $($('#' + tag).find('.table-active')[0]).data('item');
    }
  }
}
