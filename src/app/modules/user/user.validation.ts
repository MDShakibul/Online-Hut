import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone Number is required',
    }),
    role: z.enum(['seller', 'buyer'] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
    name: z.object({
      firstName: z.string({
        required_error: 'First name is required',
      }),
      lastName: z.string({
        required_error: 'Last name is required',
      }),
    }),
    address: z.string({
      required_error: 'Address is required',
    }),
    budget: z.number({
      required_error: 'Budget is required',
    }),
    income: z.number({
      required_error: 'Income is required',
    }),
  }),
});

const updateUpdateZodSchema = z.object({
  body: z.object({
    phoneNumber: z
      .string({
        required_error: 'Phone Number is required',
      })
      .optional(),
    role: z
      .enum(['seller', 'buyer'] as [string, ...string[]], {
        required_error: 'Role is required',
      })
      .optional(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .optional(),
    name: z
      .object({
        firstName: z
          .string({
            required_error: 'First name is required',
          })
          .optional(),
        lastName: z
          .string({
            required_error: 'Last name is required',
          })
          .optional(),
      })
      .optional(),
    address: z
      .string({
        required_error: 'Address is required',
      })
      .optional(),
    budget: z
      .number({
        required_error: 'Budget is required',
      })
      .optional(),
    income: z
      .number({
        required_error: 'Income is required',
      })
      .optional(),
  }),
});

const logUserZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone Number is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

const updateProfileZodSchema = z.object({
  body: z.object({
    phoneNumber: z
      .string({
        required_error: 'Phone Number is required',
      })
      .optional(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .optional(),
    name: z
      .object({
        firstName: z
          .string({
            required_error: 'First name is required',
          })
          .optional(),
        lastName: z
          .string({
            required_error: 'Last name is required',
          })
          .optional(),
      })
      .optional(),
    address: z
      .string({
        required_error: 'Address is required',
      })
      .optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUpdateZodSchema,
  logUserZodSchema,
  refreshTokenZodSchema,
  updateProfileZodSchema,
};
