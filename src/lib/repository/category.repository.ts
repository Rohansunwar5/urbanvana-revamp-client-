import categoryModel, { ICategory } from '@/lib/models/category.model';

export interface ICreateCategoryParams {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  attributes?: { attributeId: string; displayOrder: number }[];
  displayOrder?: number;
}

export class CategoryRepository {
  private _model = categoryModel;

  async create(params: ICreateCategoryParams): Promise<ICategory> {
    return this._model.create(params) as unknown as ICategory;
  }

  async findById(id: string): Promise<ICategory | null> {
    return this._model.findById(id);
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    return this._model.findOne({ slug }).lean() as Promise<ICategory | null>;
  }

  async findAll(isActive?: boolean): Promise<ICategory[]> {
    const filter = isActive !== undefined ? { isActive } : {};
    return this._model.find(filter).sort({ displayOrder: 1, name: 1 }).lean() as unknown as Promise<ICategory[]>;
  }

  async update(id: string, params: Partial<ICreateCategoryParams>): Promise<ICategory | null> {
    return this._model.findByIdAndUpdate(id, params, { new: true });
  }

  async slugExists(slug: string): Promise<boolean> {
    const doc = await this._model.findOne({ slug }).select('_id');
    return !!doc;
  }
}
