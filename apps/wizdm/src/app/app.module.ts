import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ContentModule } from '@wizdm/content';
import { ConnectModule } from '@wizdm/connect';
import { AuthModule } from '@wizdm/connect/auth';
import { DatabaseModule } from '@wizdm/connect/database';
import { StorageModule } from '@wizdm/connect/storage';
import { DoorbellModule } from '@wizdm/doorbell';
import { ReadmeNavigator } from '@wizdm/elements/readme';
import { RedirectService } from '@wizdm/redirect';
import { EmojiSupportModule } from '@wizdm/emoji';
import { IpListModule } from '@wizdm/iplist';
import { GtagModule } from '@wizdm/gtag';
import { AppComponent } from './app.component';  
//import { environment } from '../environments/environment';
import { appname, content, emoji, router } from '../environments/common';
import { firebase, doorbell, gtag } from '../environments/secrets';

// Define the singe lazy loading navigation routes
const routes: Routes = [ 
  { path: '', loadChildren: () => import('./navigator/navigator.module').then(m => m.NavigatorModule) }
];

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    // Basics
    BrowserModule,
    BrowserAnimationsModule,
    // Database tools (Firebase)
    ConnectModule.init(firebase, appname),
    AuthModule, DatabaseModule, StorageModule,
    // IP location (iplist.cc)
    IpListModule,   
    // Dynamic content (i18n)
    ContentModule.init(content),    
    // Doorbell service (Feedback form)
    DoorbellModule.init(doorbell),
    // Google Analytics
    GtagModule.init(gtag),
    // Universal Emoji support
    EmojiSupportModule.init(emoji),
    // Angular's Router
    RouterModule.forRoot(routes, router)
  ],
  providers: [
    // Provides the redirection service globally
    RedirectService,
    // Applies the  redirection service to ReadmeComponent from @wizdm/elements
    { provide: ReadmeNavigator, useExisting: RedirectService },
    // Provides the MatIconRegistry globally
    MatIconRegistry,
    // Provides the MomentDateAdaper globally for @angular/material DatePicker
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [ MAT_DATE_LOCALE ]},
    // Configures Material Date Format accordingly
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
