# Types

## mixed

Creates a schema that matches all types, or just the ones you configure. Inherits from [`Schema`](#Schema).

```ts
import { mixed, InferType } from 'yup';

let schema = mixed();

schema.validateSync('string'); // 'string';

schema.validateSync(1); // 1;

schema.validateSync(new Date()); // Date;

InferType<typeof schema> // any
```

Custom types can be implemented by passing a type check function:

```ts
import { mixed, InferType } from 'yup';

let objectIdSchema = yup
  .mixed((input): input is ObjectId => input instanceof ObjectId)
  .transform((value: any, input, ctx) => {
    if (ctx.typeCheck(value)) return value;
    return new ObjectId(value);
  });

await objectIdSchema.validate(ObjectId('507f1f77bcf86cd799439011')); // ObjectId("507f1f77bcf86cd799439011")

await objectIdSchema.validate('507f1f77bcf86cd799439011'); // ObjectId("507f1f77bcf86cd799439011")


InferType<typeof objectIdSchema> // ObjectId
```

## string

Define a string schema. Inherits from [`Schema`](#Schema).

```js
let schema = yup.string();

await schema.isValid('hello'); // => true
```

By default, the `cast` logic of `string` is to call `toString` on the value if it exists.

empty values are not coerced (use `ensure()` to coerce empty values to empty strings).

Failed casts return the input value.

### `string.required(message?: string | function): Schema`

The same as the `mixed()` schema required, **except** that empty strings are also considered 'missing' values.

### `string.length(limit: number | Ref, message?: string | function): Schema`

Set a required length for the string value. The `${length}` interpolation can be used in the `message` argument

### `string.min(limit: number | Ref, message?: string | function): Schema`

Set a minimum length limit for the string value. The `${min}` interpolation can be used in the `message` argument

### `string.max(limit: number | Ref, message?: string | function): Schema`

Set a maximum length limit for the string value. The `${max}` interpolation can be used in the `message` argument

### `string.matches(regex: Regex, message?: string | function): Schema`

Provide an arbitrary `regex` to match the value against.

```js
let schema = string().matches(/(hi|bye)/);

await schema.isValid('hi'); // => true
await schema.isValid('nope'); // => false
```

### `string.matches(regex: Regex, options: { message: string, excludeEmptyString: bool }): Schema`

An alternate signature for `string.matches` with an options object. `excludeEmptyString`, when true,
short circuits the regex test when the value is an empty string

```js
let schema = string().matches(/(hi|bye)/, { excludeEmptyString: true });

await schema.isValid(''); // => true
```

### `string.email(message?: string | function): Schema`

Validates the value as an email address via a regex.

### `string.url(message?: string | function): Schema`

Validates the value as a valid URL via a regex.

### `string.uuid(message?: string | function): Schema`

Validates the value as a valid UUID via a regex.

### `string.ensure(): Schema`

Transforms `undefined` and `null` values to an empty string along with
setting the `default` to an empty string.

### `string.trim(message?: string | function): Schema`

Transforms string values by removing leading and trailing whitespace. If
`strict()` is set it will only validate that the value is trimmed.

### `string.lowercase(message?: string | function): Schema`

Transforms the string value to lowercase. If `strict()` is set it
will only validate that the value is lowercase.

### `string.uppercase(message?: string | function): Schema`

Transforms the string value to uppercase. If `strict()` is set it
will only validate that the value is uppercase.

## number

Define a number schema. Inherits from [`Schema`](#Schema).

```js
let schema = yup.number();

await schema.isValid(10); // => true
```

The default `cast` logic of `number` is: [`parseFloat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat).

Failed casts return `NaN`.

### `number.min(limit: number | Ref, message?: string | function): Schema`

Set the minimum value allowed. The `${min}` interpolation can be used in the
`message` argument.

### `number.max(limit: number | Ref, message?: string | function): Schema`

Set the maximum value allowed. The `${max}` interpolation can be used in the
`message` argument.

### `number.lessThan(max: number | Ref, message?: string | function): Schema`

Value must be less than `max`. The `${less}` interpolation can be used in the
`message` argument.

### `number.moreThan(min: number | Ref, message?: string | function): Schema`

Value must be strictly greater than `min`. The `${more}` interpolation can be used in the
`message` argument.

### `number.positive(message?: string | function): Schema`

Value must be a positive number.

### `number.negative(message?: string | function): Schema`

Value must be a negative number.

### `number.integer(message?: string | function): Schema`

Validates that a number is an integer.

### `number.truncate(): Schema`

Transformation that coerces the value to an integer by stripping off the digits
to the right of the decimal point.

### `number.round(type: 'floor' | 'ceil' | 'trunc' | 'round' = 'round'): Schema`

Adjusts the value via the specified method of `Math` (defaults to 'round').

## boolean

Define a boolean schema. Inherits from [`Schema`](#Schema).

```js
let schema = yup.boolean();

await schema.isValid(true); // => true
```

## date

Define a Date schema. By default ISO date strings will parse correctly,
for more robust parsing options see the extending schema types at the end of the readme.
Inherits from [`Schema`](#Schema).

```js
let schema = yup.date();

await schema.isValid(new Date()); // => true
```

The default `cast` logic of `date` is pass the value to the `Date` constructor, failing that, it will attempt
to parse the date as an ISO date string.

Failed casts return an invalid Date.

### `date.min(limit: Date | string | Ref, message?: string | function): Schema`

Set the minimum date allowed. When a string is provided it will attempt to cast to a date first
and use the result as the limit.

### `date.max(limit: Date | string | Ref, message?: string | function): Schema`

Set the maximum date allowed, When a string is provided it will attempt to cast to a date first
and use the result as the limit.

## array

Define an array schema. Arrays can be typed or not, When specifying the element type, `cast` and `isValid`
will apply to the elements as well. Options passed into `isValid` are passed also passed to child schemas.

Inherits from [`Schema`](#Schema).

```js
let schema = yup.array().of(yup.number().min(2));

await schema.isValid([2, 3]); // => true
await schema.isValid([1, -24]); // => false

schema.cast(['2', '3']); // => [2, 3]
```

You can also pass a subtype schema to the array constructor as a convenience.

```js
array().of(yup.number());
// or
array(yup.number());
```

Arrays have no default casting behavior.

### `array.of(type: Schema): this`

Specify the schema of array elements. `of()` is optional and when omitted the array schema will
not validate its contents.

### `array.json(): this`

Attempt to parse input string values as JSON using [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).

### `array.length(length: number | Ref, message?: string | function): this`

Set a specific length requirement for the array. The `${length}` interpolation can be used in the `message` argument.

### `array.min(limit: number | Ref, message?: string | function): this`

Set a minimum length limit for the array. The `${min}` interpolation can be used in the `message` argument.

### `array.max(limit: number | Ref, message?: string | function): this`

Set a maximum length limit for the array. The `${max}` interpolation can be used in the `message` argument.

### `array.ensure(): this`

Ensures that the value is an array, by setting the default to `[]` and transforming `null` and `undefined`
values to an empty array as well. Any non-empty, non-array value will be wrapped in an array.

```js
array().ensure().cast(null); // => []
array().ensure().cast(1); // => [1]
array().ensure().cast([1]); // => [1]
```

### `array.compact(rejector: (value) => boolean): Schema`

Removes falsey values from the array. Providing a rejecter function lets you specify the rejection criteria yourself.

```js
array().compact().cast(['', 1, 0, 4, false, null]); // => [1, 4]

array()
  .compact(function (v) {
    return v == null;
  })
  .cast(['', 1, 0, 4, false, null]); // => ['', 1, 0, 4, false]
```

## tuple

Tuples, are fixed length arrays where each item has a distinct type.

Inherits from [`Schema`](#Schema).

```js
import { tuple, string, number, InferType } from 'yup';

let schema = tuple([
  string().label('name'),
  number().label('age').positive().integer(),
]);

await schema.validate(['James', 3]); // ['James', 3]

await schema.validate(['James', -24]); // => ValidationError: age must be a positive number

InferType<typeof schema> // [string, number] | undefined
```

tuples have no default casting behavior.

## object

Define an object schema. Options passed into `isValid` are also passed to child schemas.
Inherits from [`Schema`](#Schema).

```js
yup.object({
  name: string().required(),
  age: number().required().positive().integer(),
  email: string().email(),
  website: string().url(),
});
```

object schema do not have any default transforms applied.

### Object schema defaults

Object schema come with a default value already set, which "builds" out the object shape, a
sets any defaults for fields:

```js
const schema = object({
  name: string().default(''),
});

schema.default(); // -> { name: '' }
```

This may be a bit suprising, but is usually helpful since it allows large, nested
schema to create default values that fill out the whole shape and not just the root object. There is
one gotcha! though. For nested object schema that are optional but include non optional fields
may fail in unexpected ways:

```js
const schema = object({
  id: string().required(),
  names: object({
    first: string().required(),
  }),
});

schema.isValid({ id: 1 }); // false! names.first is required
```

This is because yup casts the input object before running validation
which will produce:

> `{ id: '1', names: { first: undefined }}`

During the validation phase `names` exists, and is validated, finding `names.first` missing.
If you wish to avoid this behavior do one of the following:

- Set the nested default to undefined: `names.default(undefined)`
- mark it nullable and default to null: `names.nullable().default(null)`

### `object.shape(fields: object, noSortEdges?: Array<[string, string]>): Schema`

Define the keys of the object and the schemas for said keys.

Note that you can chain `shape` method, which acts like `Object.assign`.

```ts
object({
  a: string(),
  b: number(),
}).shape({
  b: string(),
  c: number(),
});
```

would be exactly the same as:

```ts
object({
  a: string(),
  b: string(),
  c: number(),
});
```

### `object.json(): this`

Attempt to parse input string values as JSON using [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).

### `object.concat(schemaB: ObjectSchema): ObjectSchema`

Creates a object schema, by applying all settings and fields from `schemaB` to the base, producing a new schema.
The object shape is shallowly merged with common fields from `schemaB` taking precedence over the base
fields.

### `object.pick(keys: string[]): Schema`

Create a new schema from a subset of the original's fields.

```js
const person = object({
  age: number().default(30).required(),
  name: string().default('pat').required(),
  color: string().default('red').required(),
});

const nameAndAge = person.pick(['name', 'age']);
nameAndAge.getDefault(); // => { age: 30, name: 'pat'}
```

### `object.omit(keys: string[]): Schema`

Create a new schema with fields omitted.

```js
const person = object({
  age: number().default(30).required(),
  name: string().default('pat').required(),
  color: string().default('red').required(),
});

const nameAndAge = person.omit(['color']);
nameAndAge.getDefault(); // => { age: 30, name: 'pat'}
```

### `object.from(fromKey: string, toKey: string, alias: boolean = false): this`

Transforms the specified key to a new key. If `alias` is `true` then the old key will be left.

```js
let schema = object({
  myProp: mixed(),
  Other: mixed(),
})
  .from('prop', 'myProp')
  .from('other', 'Other', true);

schema.cast({ prop: 5, other: 6 }); // => { myProp: 5, other: 6, Other: 6 }
```

### `object.noUnknown(onlyKnownKeys: boolean = true, message?: string | function): Schema`

Validate that the object value only contains keys specified in `shape`, pass `false` as the first
argument to disable the check. Restricting keys to known, also enables `stripUnknown` option, when not in strict mode.

### `object.camelCase(): Schema`

Transforms all object keys to camelCase

### `object.constantCase(): Schema`

Transforms all object keys to CONSTANT_CASE.