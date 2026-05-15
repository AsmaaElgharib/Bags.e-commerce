import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr'
import { Order } from '../../shared/models/order';

@Injectable({
  providedIn: 'root',
})
export class Signalr {
  //hubUrl = environment.hubUrl;
  hubUrl = `${window.location.protocol}//${window.location.host}${environment.hubUrl}`;
  hubConnection?: HubConnection;
  orderSignal = signal<Order | null>(null);
  createHubConnection() {
    console.log(this.hubUrl);
    this.hubConnection = new HubConnectionBuilder()
        .withUrl(environment.hubUrl, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();
      console.log(this.hubConnection);
    this.hubConnection.start()
      .catch(error => console.log(error));

    this.hubConnection.on('OrderCompleteNotification', (order: Order) => {
      this.orderSignal.set(order)
    })
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(error => console.log(error))
    }
  }

}
 