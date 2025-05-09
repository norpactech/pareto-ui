/**
 * © 2025 Northern Pacific Technologies, LLC. All Rights Reserved. 
 *  
 * For license details, see the LICENSE file in this project root.
 */
export interface ICardinality {
  id: string
  idProperty: string
  idObjectReference: string
  idRtCardinality: string
  idRtCardinalityStrength: string
  hasReferencialAction: boolean
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  isActive: boolean
}