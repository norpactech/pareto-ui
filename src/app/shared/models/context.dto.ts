export interface IContexts {
  data: IContext[]
  total: number
}

export interface IContext {
  id: string
  name: string
  description: string
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  isActive: boolean
}