import { Component,Input  } from '@angular/core';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent 
{
  @Input() 
  public pdfUrl: string | undefined = '';
  public show:boolean = true;

  CloseSubmit()
  {
    if(this.show)
    {
      this.show = false;
    }
  }
}
