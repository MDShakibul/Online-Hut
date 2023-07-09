import { z } from 'zod';
import { cowCategory, cowLable, cowLocation } from './cow.constant';

const createCowZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    age: z.number({
      required_error: 'age is required',
    }),
    price: z.number({
      required_error: 'Price is required',
    }),
    location: z.enum([...cowLocation] as [string, ...string[]], {
      required_error: 'Location is required',
    }),
    breed: z.string({
      required_error: 'Breed is required',
    }),
    weight: z.number({
      required_error: 'Weignt is required',
    }),
    label: z
      .enum([...cowLable] as [string, ...string[]], {
        required_error: 'Label is required',
      })
      .optional(),
    category: z.enum([...cowCategory] as [string, ...string[]], {
      required_error: 'Category is required',
    }),
    seller: z.string({
      required_error: 'Seller is required',
    }),
  }),
});

const updateCowZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .optional(),
    age: z
      .number({
        required_error: 'age is required',
      })
      .optional(),
    price: z
      .number({
        required_error: 'Price is required',
      })
      .optional(),
    location: z
      .enum([...cowLocation] as [string, ...string[]], {
        required_error: 'Location is required',
      })
      .optional(),
    breed: z
      .string({
        required_error: 'Breed is required',
      })
      .optional(),
    weight: z
      .number({
        required_error: 'Weignt is required',
      })
      .optional(),
    label: z
      .enum([...cowLable] as [string, ...string[]], {
        required_error: 'Label is required',
      })
      .optional(),
    category: z
      .enum([...cowCategory] as [string, ...string[]], {
        required_error: 'Category is required',
      })
      .optional(),
    seller: z
      .string({
        required_error: 'Seller is required',
      })
      .optional(),
  }),
});

export const CowValidation = {
  createCowZodSchema,
  updateCowZodSchema,
};
