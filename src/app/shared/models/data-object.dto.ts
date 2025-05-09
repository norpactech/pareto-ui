/**
 * © 2025 Northern Pacific Technologies, LLC. All Rights Reserved. 
 *  
 * For license details, see the LICENSE file in this project root.
 */
export interface IDataObject {
  id: string
  idSchema: string
  name: string
  description: string
  hasIdentifier: boolean
  hasAudit: boolean
  hasActive: boolean
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  isActive: boolean
}