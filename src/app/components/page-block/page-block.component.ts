import { Component, OnInit , Input} from '@angular/core';

@Component({
	moduleId: module.id,
  selector: 'app-page-block',
  templateUrl: 'page-block.component.html'
  //styleUrls: ['./page-block.component.css']
})
export class PageBlockComponent implements OnInit {
	expandBlock: boolean = true;
	@Input() fieldMetadata;
	@Input() objectAPIName : String;
	@Input() recordObj;
  constructor() { }

  ngOnInit() {
  	console.log('---fieldMetadata--', this.fieldMetadata);
  }

}
