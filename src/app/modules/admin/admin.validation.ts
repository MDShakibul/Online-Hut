import { z } from 'zod';

const createAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone Number is required',
    }),
    role: z.enum(['admin'] as [string, ...string[]], {
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
  }),
});
const logAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone Number is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});



export const AdminValidation = {
  createAdminZodSchema, logAdminZodSchema
};
