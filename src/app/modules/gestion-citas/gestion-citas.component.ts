import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef  } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CitasService } from '../../core/citas.service';
import { Paciente } from '../../model/vo/paciente';

import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionCitasComponent implements OnInit {
  citaForm: UntypedFormGroup;
  pacientes: Paciente[] = [];
  citas: any[] = []; // Array para almacenar las citas

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;
  constructor(
    private fb: UntypedFormBuilder,
    private citasService: CitasService, private modal: NgbModal
  ) {
    this.citaForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      pacienteId: ['', Validators.required],
      medicoId: ['', Validators.required] // Asumiendo que tienes una lista de médicos
    });
  }

  ngOnInit(): void {
    this.loadPacientes();
    this.loadCitas();
    this.citasService.getCitas().subscribe(citas => {
      this.events = citas.map(cita => ({
        start: startOfDay(new Date(cita.fecha)),
        title: cita.descripcion,
      }));
    });
  }

  loadPacientes(): void {
    // Llama al servicio para cargar la lista de pacientes
    this.citasService.getPacientes().subscribe(pacientes => {
      this.pacientes = pacientes;
    });
  }

  loadCitas(): void {
    // Llama al servicio para cargar la lista de citas
    this.citasService.getCitas().subscribe(citas => {
      this.citas = citas;
    });
  }

  agendarCita(): void {
    if (this.citaForm.valid) {
      const nuevaCita = this.citaForm.value;
      this.citasService.agendarCita(nuevaCita).subscribe(response => {
        alert('Cita agendada con éxito');
        this.loadCitas();
        this.citaForm.reset();
      });
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

}
