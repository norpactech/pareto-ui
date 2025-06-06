/**
 * © 2025 Northern Pacific Technologies, LLC. All Rights Reserved.
 *
 * For license details, see the LICENSE file in this project root.
 */
export interface IProperty {
  id: string
  idDataObject: string
  dataObjectName: string
  idGenericDataType: string
  genericDataTypeName: string
  idValidation: string
  validationName: string
  idGenericPropertyType: string
  genericPropertyTypeName: string
  sequence: number
  name: string
  description: string
  fkViewable: boolean
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
