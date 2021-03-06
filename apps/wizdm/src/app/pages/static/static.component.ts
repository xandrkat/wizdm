import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RedirectService } from '@wizdm/redirect';
import { SidenavDirective } from 'app/navigator/sidenav';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'wm-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss'],
  //host: { "style": "flex 1 1 auto" }
})
export class StaticComponent {

  /** The sidenav panel */
  @ViewChild(SidenavDirective) sidenav: SidenavDirective;

  readonly page$: Observable<string>;

  constructor(private redirect: RedirectService, route: ActivatedRoute) {

    // Resolves the requested page to be used with gtag directive
    this.page$ = route.paramMap.pipe( map( params => params && params.get('page') || '') );
  }

  public navigate(url: string, closeSidenav?: boolean) { 

    // Closes the sidenav panel on request
    if(!!closeSidenav) { this.sidenav?.close(); }
    // Performs the navigation
    return this.redirect.navigate(url);
  }
}
