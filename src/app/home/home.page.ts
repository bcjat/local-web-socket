import { Component } from '@angular/core';
import { WebSocketServer } from "@ionic-native/web-socket-server/ngx";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  constructor(private webserver:WebSocketServer ) {
    this.webserver.start( 0, {

    }).subscribe({
      next:server=>{
        console.log('success: ',server);
      },
      error:error=>{
        console.log('error occured: ',error);
      }
    })

  }
  
  
  
}
