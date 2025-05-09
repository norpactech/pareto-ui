/**
 * © 2025 Northern Pacific Technologies, LLC. All Rights Reserved. 
 *  
 * For license details, see the LICENSE file in this project root.
 */
export interface IContextPropertyType {
  id: string
  idContext: string
  idSchema: string
  idGenericPropertyType: string
  length: number
  scale: number
  isNullable: boolean
  defaultValue: string
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  isActive: boolean
}