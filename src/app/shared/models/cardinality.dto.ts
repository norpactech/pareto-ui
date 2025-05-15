/**
 * © 2025 Northern Pacific Technologies, LLC. All Rights Reserved.
 *
 * For license details, see the LICENSE file in this project root.
 */
export interface ICardinality {
  id: string
  idProperty: string
  propertyName: string
  idObjectReference: string
  objectReferenceName: string
  idRtCardinality: string
  rtCardinalityName: string
  idRtCardinalityStrength: string
  rtCardinalityStrengthName: string
  hasReferencialAction: boolean
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  isActive: boolean
}
