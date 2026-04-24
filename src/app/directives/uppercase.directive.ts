import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  standalone: false,
  selector: '[appUppercase]'
})
export class UppercaseDirective {

  constructor(private el: ElementRef) {}

    @HostListener('input', ['$event']) onInput(event: Event) {
      const input = event.target as HTMLInputElement;
      input.value = input.value.toUpperCase();
    }
    @HostListener('blur', ['$event']) onBlur(event: Event) {
      const input = event.target as HTMLInputElement;
      input.value = input.value.toUpperCase();
    }
}
