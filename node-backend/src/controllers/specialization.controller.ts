import { Request, Response } from 'express';
import Specialization from '../models/specialization.model';
import { BaseController } from './base.controller';
import { ISpecialization } from '../models/interfaces';

export class SpecializationController extends BaseController<ISpecialization> {
  constructor() {
    super(Specialization);
  }
}
