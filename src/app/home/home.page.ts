import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";

import { Plugins } from "@capacitor/core";
const { SocketClientPlugin } = Plugins;
//declare var plugins: any;
declare var cordova: any;

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  web: any; // store ws server after device ready
  diceReady: boolean = true;
  uuids: string[] = [];
  ipAddress:any = '';
  platformReady:boolean = false;
  ipInput:string='';

  webClient:any;
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.platformReady = true;
    });
  }

  getInterface() {
    this.web.getInterfaces( (result) => {
      for (var iface in result) {
        if (result.hasOwnProperty(iface)) {
          console.log("interface", iface);
          console.log("ipv4", result[iface].ipv4Addresses[0]);
          this.ipAddress += "interface:"+ iface + " ip: " + result[iface].ipv4Addresses[0] + "<br/>";
        }
      }
    });
    
  }

  exitApp() {
    navigator["app"].exitApp();
  }

  startServer(){
    var wsserver = cordova.plugins.wsserver;
    this.web = wsserver;
    this.diceReady = false;
    this.web.start(
      8888,
      {
        // WebSocket Server handlers
        onFailure: function (addr, port, reason) {
          console.log(
            "Stopped listening on %s:%d. Reason: %s",
            addr,
            port,
            reason
          );
        },
        // WebSocket Connection handlers
        onOpen: (conn) => {
          this.openWatch(conn);
        },
        onMessage: function (conn, msg) {
          console.log(conn, msg); // msg can be a String (text message) or ArrayBuffer (binary message)
        },
        onClose: function (conn, code, reason, wasClean) {
          console.log("A user disconnected from %s", conn.remoteAddr);
        },
        // Other options
        //origins: ["file://"], // validates the 'Origin' HTTP Header.
        //protocols: ["my-protocol-v1", "my-protocol-v2"], // validates the 'Sec-WebSocket-Protocol' HTTP Header.
        tcpNoDelay: true, // disables Nagle's algorithm.
      },
      function onStart(addr, port) {
        console.log("Listening on %s:%d", addr, port);
      },
      function onDidNotStart(reason) {
        console.log("Did not start. Reason: %s", reason);
      }
    );

  }

  connectSocket(){ 
    /* this.webClient = new WebSocket( this.ipInput +":8888");
    this.webClient.onopen =  (event) => {
      this.webClient.send("Here's some text that the server is urgently awaiting!"); 
    }; */

    SocketClientPlugin.connect({uri:this.ipInput}).then((res)=>{
      console.log(res);
    }).catch(err=>{
      console.log(err);
    });
  }

  openWatch(conn: any) {

    this.uuids.push(conn.uuid);
    /* conn: {
 'uuid' : '8e176b14-a1af-70a7-3e3d-8b341977a16e',
 'remoteAddr' : '192.168.1.10',
 'httpFields' : {...},
 'resource' : '/?param1=value1&param2=value2'
 } */
    console.log("A user connected from %s", conn.remoteAddr);
  }
}
