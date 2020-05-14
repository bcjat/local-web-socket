import { Component } from '@angular/core';
import { WebSocketServer } from "@ionic-native/web-socket-server/ngx";

//declare var wsserver:any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    constructor(private webserver:WebSocketServer ) {
  }

  initServer(){
    
     this.webserver.start( 8888, {}).subscribe({
      next: server => console.log(`Listening on ${server.addr}:${server.port}`),
      error:error=>{
        console.log('error occured: '+error);
      }
    })
    
    this.webserver.watchOpen().subscribe({
      next: data=>{
      console.log(data);
      },
      error: error => console.log(error)
    })
  
   
  }
  
}
