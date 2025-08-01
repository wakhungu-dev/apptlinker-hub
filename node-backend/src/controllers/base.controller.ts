import { Request, Response } from 'express';
import mongoose from 'mongoose';

interface MongooseError extends Error {
  name: string;
  message: string;
  code?: number;
}

export class BaseController<T extends mongoose.Document> {
  private model: mongoose.Model<T>;

  constructor(model: mongoose.Model<T>) {
    this.model = model;
  }

  // Get all documents
  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const items = await this.model.find();
      return res.status(200).json(items);
    } catch (error: unknown) {
      const err = error as MongooseError;
      return res.status(500).json({ error: 'Error fetching data', details: err.message });
    }
  };

  // Get document by id
  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
      
      const item = await this.model.findById(id);
      
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      return res.status(200).json(item);
    } catch (error: unknown) {
      const err = error as MongooseError;
      return res.status(500).json({ error: 'Error fetching item', details: err.message });
    }
  };

  // Create new document
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const newItem = await this.model.create(req.body);
      return res.status(201).json(newItem);
    } catch (error: unknown) {
      const err = error as MongooseError;
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error', details: err.message });
      }
      return res.status(500).json({ error: 'Error creating item', details: err.message });
    }
  };

  // Update document by id
  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
      
      const updatedItem = await this.model.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      
      if (!updatedItem) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      return res.status(200).json(updatedItem);
    } catch (error: unknown) {
      const err = error as MongooseError;
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error', details: err.message });
      }
      return res.status(500).json({ error: 'Error updating item', details: err.message });
    }
  };

  // Delete document by id
  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
      
      const deletedItem = await this.model.findByIdAndDelete(id);
      
      if (!deletedItem) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error: unknown) {
      const err = error as MongooseError;
      return res.status(500).json({ error: 'Error deleting item', details: err.message });
    }
  };
}
