import { z } from "zod";

export const courseSchema = z.object({
    id : z.string().optional(),
    title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
    thumbnail: z.string().min(1, "Thumbnail is required"),
    content: z.string().min(1, "Content is required"),
    htmlContent: z.string().optional().nullable(),
    JsonContent: z.any().optional().nullable(),   
    price: z.number().min(0, "Price must be non-negative"),
    published: z.boolean().optional().default(false),
  });

export type CourseFormValues = z.infer<typeof courseSchema>



export const chapterSchema = z.object({
  id : z.string().optional(),
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  content: z.string().min(1, "Content is required"),
  video : z.string().optional().nullable(),
  htmlContent: z.string().optional().nullable(),
  JsonContent: z.any().optional().nullable(),
  module  : z.string().min(1, "Module is required"),
});

export type ChapterType =  z.infer<typeof chapterSchema>



export const PaymentSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(1, { message: "Name is required" }),
  bank_account_number: z.string().min(6, { message: "Account number is required" }),
  bank_ifsc: z.string().min(5, { message: "IFSC code is required" }),
  pan_number : z.string({required_error : "Pan number is important"}).min(10, {message : "Pan Number has 10 digits"}).max(10 , {message : "Pan Number has only 10 digits"}),
  phone : z.string({required_error : "Phone number is a must"}).min(10, {message : "The phone number should be the min of 10 numbers"})
});

export type PaymentSchemaType = z.infer<typeof PaymentSchema>