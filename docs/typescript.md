---
sidebar_position: 3
---

# TypeScript integration

Yup schema produce, static TypeScript interfaces. Use `InferType` to extract that interface:

```ts
import * as yup from 'yup';

const personSchema = yup.object({
  firstName: yup.string().defined(),
  nickName: yup.string().default('').nullable(),
  sex: yup
    .mixed()
    .oneOf(['male', 'female', 'other'] as const)
    .defined(),
  email: yup.string().nullable().email(),
  birthDate: yup.date().nullable().min(new Date(1900, 0, 1)),
});

interface Person extends yup.InferType<typeof personSchema> {}
```

## Schema defaults

a schema's default is used when casting produces an `undefined` output value. Because of this,
setting a default affects the output type of the schema, effectively marking it as "defined()".

```ts
import { string } from 'yup';

const value: string = string().default('hi').validate(undefined);

// vs

const value: string | undefined = string().validate(undefined);
```

## Ensuring a schema matches an existing type

In some cases, the TypeScript type already exists, and you want to ensure that
your schema produces a compatible type:

```ts
import { object, number string, ObjectSchema } from 'yup';

interface Person {
  name: string;
  age?: number;
  sex: 'male' | 'female' | 'other' | null;
}

// will raise a compile-time type error if the schema does not produce a valid Person
const schema: ObjectSchema<Person> = object({
  name: string().defined(),
  age: number().optional(),
  sex: string<'male' | 'female' | 'other'>().nullable().defined();
});

// ❌ errors:
// "Type 'number | undefined' is not assignable to type 'string'."
const badSchema: ObjectSchema<Person> = object({
  name: number(),
});

```

## Extending built-in schema with new methods

You can use TypeScript's interface merging behavior to extend the schema types
if needed. Type extensions should go in an "ambient" type definition file such as your
`globals.d.ts`. Remember to actually extend the yup type in your application code!

> Watch out! merging only works if the type definition is _exactly_ the same, including
> generics. Consult the yup source code for each type to ensure you are defining it correctly

```ts
// globals.d.ts
declare module 'yup' {
  interface StringSchema<TType, TContext, TDefault, TFlags> {
    append(appendStr: string): this;
  }
}

// app.ts
import { addMethod, string } from 'yup';

addMethod(string, 'append', function append(appendStr: string) {
  return this.transform((value) => `${value}${appendStr}`);
});

string().append('~~~~').cast('hi'); // 'hi~~~~'
```

## TypeScript configuration

You **must** have the `strictNullChecks` compiler option enabled for type inference to work.

We also recommend settings `strictFunctionTypes` to `false`, for functionally better types. Yes
this reduces overall soundness, however TypeScript already disables this check
anyway for methods and constructors (note from TS docs):

> During development of this feature, we discovered a large number of inherently
> unsafe class hierarchies, including some in the DOM. Because of this,
> the setting only applies to functions written in function syntax, not to those in method syntax:

Your mileage will vary, but we've found that this check doesn't prevent many of
real bugs, while increasing the amount of onerous explicit type casting in apps.
