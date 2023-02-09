import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import * as signalR from "@microsoft/signalr"
import { ConnectedModel } from "./connected.model";
import { DisconnectedModel } from "./disconnected.model";
import { LoadedModel } from "./loaded.model";
import { SendModel } from "./send.model";
import { SentModel } from "./sent.model";

@Injectable({ providedIn: "root" })
export class AppChatService {
    $connected = new Subject<ConnectedModel>();
    $disconnected = new Subject<DisconnectedModel>();
    $loaded = new Subject<LoadedModel>();
    $sent = new Subject<SentModel>();

    private connection!: any;

    start(name: string) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`chathub?name=${name}`)
            .configureLogging(signalR.LogLevel.Error)
            .withAutomaticReconnect()
            .build();

        this.connection.on("Connected", (connected: ConnectedModel) => this.$connected.next(connected));
        this.connection.on("Disconnected", (disconnected: DisconnectedModel) => this.$disconnected.next(disconnected));
        this.connection.on("Loaded", (loaded: LoadedModel) => this.$loaded.next(loaded));
        this.connection.on("Sent", (sent: SentModel) => this.$sent.next(sent));
        this.connection.start();
    }

    send = (send: SendModel) => this.connection.invoke("Send", send);
}
