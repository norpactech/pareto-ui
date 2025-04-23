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

export class Context implements IContext {
  constructor(
    public id = '',
    public name = '',
    public description = '',
    public createdAt: Date = new Date(),
    public createdBy = '',
    public updatedAt: Date = new Date(),
    public updatedBy = '',
    public isActive = true,
  ) {}

  static Build(context: IContext) {
    if (!context) {
      return new Context()
    }

    return new Context(
      context.id,
      context.name,
      context.description,
      new Date(context.createdAt), // Converts to Local Date
      context.createdBy,
      new Date(context.updatedAt), // Converts to Local Date
      context.updatedBy,
      context.isActive
    )
  }

  toJSON(): object {
    const serialized = Object.assign(this)
    return serialized
  }
}