import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../core/loading.service';
import { Observable } from 'rxjs';

/**
 * Componente que muestra una capa oscura con un spinner si hay tareas activas.
 */
@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
    loading$: Observable<boolean>;

    constructor(public loadingService: LoadingService) {
        this.loading$ = this.loadingService.loading$;
    }

    ngOnInit(): void { }
}
