import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatTableModule } from '@angular/material/table'

import { IContext } from './context'
import { ContextService } from './context.service'

@Component({
  selector: 'app-context-table',
  templateUrl: './context-table.component.html',
  styleUrls: ['./context-table.component.scss'],
  standalone: true,
  imports: [MatTableModule, CommonModule],
})
export class ContextTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description'] // Columns to display
  dataSource: IContext[] = [] // Data source for the table

  constructor(private contextService: ContextService) {}

  ngOnInit(): void {
    // Fetch data and populate the table
    this.contextService.getContexts().subscribe({
      next: (response) => {
        this.dataSource = response.data // Assign the data to the table's data source
      },
      error: (err) => {
        console.error('Error fetching contexts:', err)
      },
    })
  }
}
