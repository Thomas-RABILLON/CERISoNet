import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class webSocketService {
    socket;
    constructor() {
        this.socket = io('https://localhost:3117');
    }

    listen(eventname: string): Observable<any> {
        return new Observable((subscribe) => {
            this.socket.on(eventname, (data: any) => {
                subscribe.next(data);
            })
        })
    }

    emit(eventname: string, data: any) {
        this.socket.emit(eventname, data);
    }
}