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
    // tslint:disable-next-line: variable-name
    public id = '',
    public name = '',
    public description = '',
    public createdAt: Date = new Date(),
    public createdBy = '',
    public updatedAt: Date = new Date(),
    public updatedBy = '',
    public isActive = true,
    public phones: IContext[] = []
  ) {}

  static Build(context: IContext) {
    if (!context) {
      return new Context()
    }

    return new Context(
      context.id,
      context.name,
      context.description,
      context.createdAt,
      context.createdBy,
      context.updatedAt,
      context.updatedBy,
      context.isActive
    )
  }

  toJSON(): object {
    const serialized = Object.assign(this)
    return serialized
  }
}
