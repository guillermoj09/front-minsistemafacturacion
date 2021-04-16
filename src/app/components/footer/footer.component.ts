import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: [
  ]
})
export class FooterComponent implements OnInit {
  
  autor: any = { nombre: 'Guillermo', apellido: 'Jimenez' };
  constructor() { }

  ngOnInit(): void {
  }

}
