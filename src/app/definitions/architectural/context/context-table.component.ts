import { CommonModule } from '@angular/common' // Import CommonModule for AsyncPipe
import { Component, OnInit } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { Observable } from 'rxjs'

import { IContext } from './context'
import { IContexts } from './context'
import { ContextService } from './context.service'

@Component({
  selector: 'app-context-table',
  templateUrl: './context-table.component.html',
  styleUrls: ['./context-table.component.scss'],
  standalone: true,
  imports: [MatTableModule, CommonModule], // Add CommonModule here
})
export class ContextTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description'] // Columns to display
  contexts$!: Observable<IContext[]> // Observable for the data

  constructor(private contextService: ContextService) {}

  ngOnInit(): void {
    this.contextService.getContexts().subscribe({
      next: (response: IContexts) => {
        console.log('Received contexts:', response)
      },
      error: (err) => {
        console.error('Error fetching contexts:', err)
      },
    })
  }
}
