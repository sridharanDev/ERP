import { Component,EventEmitter,Output } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';

@Component({
  selector: 'app-attendance-calendar',
  templateUrl: './attendance-calendar.component.html',
  styleUrls: ['./attendance-calendar.component.css']
})
export class AttendanceCalendarComponent 
{
  @Output() eventAdded = new EventEmitter<CalendarEvent>();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  colors: Record<string, EventColor> = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
    green:{ 
      primary: '#2ecc71', 
      secondary: '#a6e4b5' 
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
  };

  events: CalendarEvent[] = [
    
  ]; 


  addEvent(event: CalendarEvent) {
    if(!this.events.includes(event))
    {
      this.events.push(event);  
      this.eventAdded.emit(event);  
    }
  }


  setView(view: CalendarView) {
    this.view = view;
  }
}
