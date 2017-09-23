import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
@Component({
	moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html'
  //styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private router: Router){
     // override the route reuse strategy
     this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
     }

     this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationEnd) {
           // trick the Router into believing it's last link wasn't previously loaded
           this.router.navigated = false;
           // if you need to scroll back to top, here is the right place
           window.scrollTo(0, 0);
        }
    });

}
  ngOnInit() {
  }
}
