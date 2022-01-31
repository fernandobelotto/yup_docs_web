---
sidebar_position: 2
---

# Schema basics

Schema definitions, are comprised of parsing "transforms" which manipulate inputs into the desired shape and type, "tests", which make assertions over parsed data. Schema also store a bunch of "metadata", details about the schema itself, which can be used to improve error messages, build tools that dynamically consume schema, or serialize schema into another format.

In order to be maximally flexible yup allows running both parsing and assertions separately to match specific needs

## Parsing: Transforms

Each built-in type implements basic type parsing, which comes in handy when parsing serialized data, such as JSON.
Additionally types implement type specific transforms that can be enabled.

```ts
const num = number().cast('1'); // 1

const obj = object({
  firstName: string().lowercase().trim(),
})
  .camelCase()
  .cast('{"first_name": "jAnE "}'); // { firstName: 'jane' }
```

Custom transforms can be added

```ts
const reversedString = string()
  .transform((currentValue) => currentValue.split('').reverse().join(''))
  .cast('dlrow olleh'); // "hello world"
```

Transforms form a "pipeline", where the value of a previous transform is piped into the next one.
If the end value is `undefined` yup will apply the schema default if it's configured.

> Watch out! values are not guaranteed to be valid types in tranform functions. Previous transforms
> may have failed. For example a number transform may be receive the input value, `NaN`, or a number.

## Validation: Tests

yup has robust support for assertions, or "tests", over input values. Tests check that inputs conform to some
criteria. Tests are distinct from transforms, in that they do not change or alter the input (or its type)
and are usually reserved for checks that are hard, if not impossible, to represent in static types.

```ts
string()
  .min(3, 'must be at least 3 characters long')
  .email('must be a valid email')
  .validate('no'); // ValidationError
```

As with transforms, tests can be customized on the fly

```ts
const jamesSchema = string().test(
  'is-james',
  (d) => `${d.path} is not James`,
  (value) => value == null || value === 'James',
);

jamesSchema.validateSync('James'); // "James"

jamesSchema.validateSync('Jane'); // ValidationError "this is not James"
```

> Heads up: unlike transforms, `value` in a custom test is guaranteed to be the correct type
> (in this case an optional string). It still may be `undefined` or `null` depending on your schema
> in those cases, you may want to return `true` for absent values unless your transform, makes presence
> related assertions

## Composition and Reuse

Schema are immutable, each method call returns a new schema object. Reuse and pass them around without
fear of mutating another instance.

```ts
const optionalString = string().optional();

const definedString = optionalString.defined();

const value = undefined;
optionalString.isValid(value); // true
definedString.isValid(value); // false
```

