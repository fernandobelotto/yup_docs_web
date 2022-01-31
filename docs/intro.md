---
sidebar_position: 1
---

# Getting Started

Yup is a schema builder for runtime value parsing and validation. Define a schema, transform a value to match, assert the shape of an existing value, or both. Yup schema are extremely expressive and allow modeling complex, interdependent validations, or value transformation.

**Killer Features**:

- Concise yet expressive schema interface, equipped to model simple to complex data models
- Powerful TypeScript support. Infer static types from schema, or ensure schema correctly implement a type
- Built-in async validation support. Model server-side and client-side validation equally well
- Extensible: add your own type-safe methods and schema
- Rich error details, make debugging a breeze


Schema are comprised of parsing actions (transforms) as well as assertions (tests) about the input value.
Validate an input value to parse it and run the configured set of assertions. Chain together methods to build a schema.

```ts
import { object, string, number, date, InferType } from 'yup';

let userSchema = object({
  name: string().required(),
  age: number().required().positive().integer(),
  email: string().email(),
  website: string().url().nullable(),
  createdOn: date().default(() => new Date()),
});

// parse and assert validity
const user = await userSchema.validate(await fetchUser());

type User = InferType<typeof userSchema>;
/* {
  name: string;
  age: number;
  email?: string | undefined
  website?: string | null | undefined
  createdOn: Date
}*/
```

Use a schema to coerce or "cast" an input value into the correct type, and optionally
transform that value into more concrete and specific values, without making further assertions.

```ts
// Attempts to coarce values to the correct type
const parsedUser = userSchema.cast({
  name: 'jimmy',
  age: '24',
  createdOn: '2014-09-23T19:25:25Z',
});
// ✅  { name: 'jimmy', age: 24, createdOn: Date }
```

Know that your input value is already parsed? You can "strictly" validate an input, and avoid the overhead
of running parsing logic.

```ts
// ❌  ValidationError "age is not a number"
const parsedUser = await userSchema.validate(
  {
    name: 'jimmy',
    age: '24',
  },
  { strict: true },
);
```
