import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // 1. Import RouterLink here
import { ApiService } from '../api'; 

@Component({
  selector: 'app-farms-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // 2. Add it to the imports array here!
  templateUrl: './farms-list.html'
})
export class FarmsList implements OnInit {
  farms: any[] = []; 

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getFarms().subscribe((data: any) => {
      this.farms = data;
    });
  }
}