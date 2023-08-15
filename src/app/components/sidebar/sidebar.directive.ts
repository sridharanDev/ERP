import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSidebar]'
})
export class SidebarDirective {

  private animationSpeed = 300;
  private subMenuSelector = '.sidebar-submenu';

  constructor(private el: ElementRef) { }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    const target = event.target as HTMLElement;
    const $this = $(target);
    const checkElement = $this.next();

    if (checkElement.is(this.subMenuSelector) && checkElement.is(':visible')) {
      checkElement.slideUp(this.animationSpeed, () => {
        checkElement.removeClass('menu-open');
      });
      checkElement.parent('li').removeClass('active');
    } else if (checkElement.is(this.subMenuSelector) && !checkElement.is(':visible')) {
      const parent = $this.parents('ul').first();
      const ul = parent.find('ul:visible').slideUp(this.animationSpeed);
      ul.removeClass('menu-open');
      const parentLi = $this.parent('li');
      checkElement.slideDown(this.animationSpeed, () => {
        checkElement.addClass('menu-open');
        parent.find('li.active').removeClass('active');
        parentLi.addClass('active');
      });
    }

    if (checkElement.is(this.subMenuSelector) || $this.is('a')) {
      event.preventDefault();
    }
  }

}
