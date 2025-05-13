/**
 * © 2025 Northern Pacific Technologies, LLC. All Rights Reserved.
 *
 * For license details, see the LICENSE file in this project root.
 */
export interface IProjectComponent {
  id: string
  idProject: string
  idPlugin: string
  idContext: string
  name: string
  description: string
  subPackage: string
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  isActive: boolean
}
