import { Router } from 'express';
import { sample_foods, sample_tags } from '../data';
import asyncHandler from 'express-async-handler';
import { FoodModel } from '../models/food.model';

const router = Router();

// Seed foods
router.get(
  '/seed',
  asyncHandler(async (req, res) => {
    const foodsCount = await FoodModel.countDocuments();
    if (foodsCount > 0) {
      res.send('Seed is already done!');
      return;
    }

    await FoodModel.create(sample_foods);
    res.send('Seed Is Done!');
  })
);

// Get all foods
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find();
    res.send(foods);
  })
);

// Search foods by search term
router.get(
  '/search/:searchTerm',
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, 'i');
    const foods = await FoodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  })
);

// Get tags with count
router.get(
  '/tags',
  asyncHandler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: '$count',
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: 'All',
      count: await FoodModel.countDocuments(),
    };

    tags.unshift(all);
    res.send(tags);
  })
);

// Get foods by tag
router.get(
  '/tag/:tagName',
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find({ tags: req.params.tagName });
    res.send(foods);
  })
);

// Get food by ID
router.get(
  '/:foodId',
  asyncHandler(async (req, res) => {
    const food = await FoodModel.findById(req.params.foodId);
    res.send(food);
  })
);

// Add a new food item
router.post(
  '/add',
  asyncHandler(async (req, res) => {
    const { name, price, tags, favorite, stars, imageUrl, origins, cookTime } = req.body;

    const newFood = new FoodModel({
      name,
      price,
      tags,
      favorite,
      stars,
      imageUrl,
      origins,
      cookTime,
    });

    const createdFood = await newFood.save();
    res.status(201).json(createdFood);
  })
);

// Delete a food item by ID
router.delete(
  '/delete/:foodId',
  asyncHandler(async (req, res) => {
    const foodId = req.params.foodId;
    const food = await FoodModel.findById(foodId);

    if (food) {
      await food.remove();
      res.json({ message: 'Food item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  })
);

export default router;
