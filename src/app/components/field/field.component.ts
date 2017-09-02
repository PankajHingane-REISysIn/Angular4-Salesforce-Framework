import { Component, OnInit, Input } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { SalesforceService } from '../../services/salesforce.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';

@Component({
	moduleId: module.id,
  selector: 'app-field',
  templateUrl: 'field.component.html'
  //styleUrls: ['./field.component.css'] 
})
export class FieldComponent implements OnInit {
	@Input() fieldMetadata;
	@Input() objectAPIName : String;
	@Input() recordObj;
  required = false;
  hasError = false;
	error = 'The input has an error!';
  lookupResponse;
  constructor(private sfdc: SalesforceService) {
    this.sfdc.controller = 'ConfigFieldController';
   }

  ngOnInit() {
  	console.log('fieldMetadata----  Field---', this.fieldMetadata);
  }

  lookupAsync = (query: string): Observable<any[]> => {
      this.sfdc.controller = 'ConfigFieldController';
      console.log('query-----', query);
      if (!query) {
        return null;
      }

      var res = this.sfdc.execute('getLookupData', { searchString: query, objName: this.objectAPIName, fieldName:this.fieldMetadata.fieldAPIName })
            .then((res) => {
               console.log('Got response', res);
               this.lookupResponse = res[0].Records;
            });
      console.log('------------Option');
      return Observable.of(this.lookupResponse);
      /* 
      let Observable<any[]> obj1 = Observable.of(this.lookupResponse);
      return obj1;*/
      /*let items = [
          {
           Name: "incidents_dialog_tab_actions_measures_defined", Id: "ddf"
          },
          {
           Name: "incidents_dialog_tab_actions_measures_with_supplier_agreed", Id: "ddf1"
          },
          {
            Name: "incidents_dialog_tab_actions_measures_are_implemented", Id: "ddf2"
          },
          {
            Name: "incidents_dialog_tab_actions_measures_are_effective", Id: "ddf3"
          }
      ];
      return Observable.of(items);

       /* Call the translation service for each item.
       .mergxeMap(item =>
         this.commonModel.translate(item.Name)
           // Store the translation in an object with the shape you want.
           .map(translatedLabel => ({ Name: translatedLabel }))
       )

       // Use this to put back all translated items in a single array again.
       .toArray();
     // return Observable.fromPromise(res);
      /*return this.lookupResponse;
      return this.http.get(`//maps.googleapis.com/maps/api/geocode/json?address=${query}`)
        .map((res: Response) => res.json())
        .map((response: any) => response.results);*/
  }

}
