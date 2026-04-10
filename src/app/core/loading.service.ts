import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

/**
 * Servicio para controlar el estado global del Spinner de carga.
 */
@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private _loading = new BehaviorSubject<boolean>(false);
    public readonly loading$ = this._loading.asObservable();

    private _activeRequests = 0;

    constructor(private router: Router) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                this.show();
            } else if (
                event instanceof NavigationEnd ||
                event instanceof NavigationCancel ||
                event instanceof NavigationError
            ) {
                this.hide();
            }
        });
    }

    /**
     * Muestra el spinner de carga. Incrementa el contador de tareas.
     */
    show() {
        this._activeRequests++;
        if (this._activeRequests > 0) {
            setTimeout(() => this._loading.next(true), 0);
        }
    }

    /**
     * Oculta el spinner. Decrementa el contador de tareas y oculta cuando llega a 0.
     */
    hide() {
        this._activeRequests--;
        if (this._activeRequests <= 0) {
            this._activeRequests = 0;
            setTimeout(() => this._loading.next(false), 0);
        }
    }
}
