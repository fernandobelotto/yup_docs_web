---
sidebar_position: 1
---

# yup

The module export.

```ts
// core schema
import {
  mixed,
  string,
  number,
  boolean,
  bool,
  date,
  object,
  array,
  ref,
  lazy,
} from 'yup';

// Classes
import {
  Schema,
  MixedSchema,
  StringSchema,
  NumberSchema,
  BooleanSchema,
  DateSchema,
  ArraySchema,
  ObjectSchema,
} from 'yup';

// Types
import type { InferType, ISchema, AnySchema, AnyObjectSchema } from 'yup';
```

### `reach(schema: Schema, path: string, value?: object, context?: object): Schema`

For nested schemas, `reach` will retrieve an inner schema based on the provided path.

For nested schemas that need to resolve dynamically, you can provide a `value` and optionally
a `context` object.

```js
import { reach } from 'yup';

let schema = object({
  nested: object({
    arr: array(object({ num: number().max(4) })),
  }),
});

reach(schema, 'nested.arr.num');
reach(schema, 'nested.arr[].num');
reach(schema, 'nested.arr[1].num');
reach(schema, 'nested["arr"][1].num');
```

### `addMethod(schemaType: Schema, name: string, method: ()=> Schema): void`

Adds a new method to the core schema types. A friendlier convenience method for `schemaType.prototype[name] = method`.

```ts
import { addMethod, date } from 'yup';

addMethod(date, 'format', function format(formats, parseStrict) {
  return this.transform((value, originalValue, ctx) => {
    if (ctx.isType(value)) return value;

    value = Moment(originalValue, formats, parseStrict);

    return value.isValid() ? value.toDate() : new Date('');
  });
});
```

If you want to add a method to ALL schema types, extend the abstract base class: `Schema`

```ts
import { addMethod, Schema } from 'yup';

addMethod(Schema, 'myMethod', ...)
```

### `ref(path: string, options: { contextPrefix: string }): Ref`

Creates a reference to another sibling or sibling descendant field. Refs are resolved
at _validation/cast time_ and supported where specified. Refs are evaluated in the proper order so that
the ref value is resolved before the field using the ref (be careful of circular dependencies!).

```js
import { ref, object, string } from 'yup';

let schema = object({
  baz: ref('foo.bar'),
  foo: object({
    bar: string(),
  }),
  x: ref('$x'),
});

schema.cast({ foo: { bar: 'boom' } }, { context: { x: 5 } });
// => { baz: 'boom',  x: 5, foo: { bar: 'boom' } }
```

### `lazy((value: any) => Schema): Lazy`

Creates a schema that is evaluated at validation/cast time. Useful for creating
recursive schema like Trees, for polymorphic fields and arrays.

**CAUTION!** When defining parent-child recursive object schema, you want to reset the `default()`
to `null` on the child—otherwise the object will infinitely nest itself when you cast it!

```js
let node = object({
  id: number(),
  child: yup.lazy(() => node.default(undefined)),
});

let renderable = yup.lazy((value) => {
  switch (typeof value) {
    case 'number':
      return number();
    case 'string':
      return string();
    default:
      return mixed();
  }
});

let renderables = array().of(renderable);
```

### `ValidationError(errors: string | Array<string>, value: any, path: string)`

Thrown on failed validations, with the following properties

- `name`: "ValidationError"
- `path`: a string, indicating where there error was thrown. `path` is empty at the root level.
- `errors`: array of error messages
- `inner`: in the case of aggregate errors, inner is an array of `ValidationErrors` throw earlier in the
  validation chain. When the `abortEarly` option is `false` this is where you can inspect each error thrown,
  alternatively, `errors` will have all of the messages from each inner error.
