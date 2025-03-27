/**
 * A `HashSet` is a collection of unique values with efficient lookup, insertion
 * and removal.
 *
 * ## Basic Usage
 *
 * HashSet solves the problem of maintaining an unsorted collection where each
 * value appears exactly once, with fast operations for checking membership and
 * adding/removing values.
 *
 * ### Value-Based Equality
 *
 * Unlike JavaScript's built-in {@link Set}, which checks for equality by
 * reference, `HashSet` supports _value-based equality_ through the {@link Equal}
 * interface. This allows objects with the same content to be treated as equal:
 *
 * ```ts
 * import { Data, HashSet, pipe } from "effect"
 *
 * // Creating a HashSet with objects that implement the Equal interface
 * const set: HashSet.HashSet<{
 *   readonly age: number
 *   readonly name: string
 * }> = pipe(
 *   HashSet.empty(),
 *   HashSet.add(Data.struct({ name: "Alice", age: 30 })),
 *   HashSet.add(Data.struct({ name: "Alice", age: 30 }))
 * )
 *
 * // HashSet recognizes them as equal, so only one element is stored
 * console.log(HashSet.size(set)) // Output: 1
 * ```
 *
 * However, without using the Data module (or another way to implement Equal):
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * // Objects that do NOT implement the Equal interface const set =
 * const set = pipe(
 *   HashSet.empty(),
 *   HashSet.add({ name: "Alice", age: 30 }),
 *   HashSet.add({ name: "Alice", age: 30 })
 * )
 *
 * // Objects are compared by reference, so two elements are stored
 * console.log(HashSet.size(set)) // Output: 2
 * ```
 *
 * ## When to Use
 *
 * Use HashSet when you need:
 *
 * - A collection with no duplicate values
 * - Efficient membership testing (O(1) average complexity)
 * - Set operations like union, intersection, and difference
 * - An immutable data structure that preserves functional programming patterns
 *
 * ## Operations Reference
 *
 * ### Constructors
 *
 * | Operation            | Description                            | Complexity |
 * | -------------------- | -------------------------------------- | ---------- |
 * | {@link empty}        | Creates an empty HashSet               | O(1)       |
 * | {@link fromIterable} | Creates a HashSet from an iterable     | O(n)       |
 * | {@link make}         | Creates a HashSet from multiple values | O(n)       |
 *
 * ### Elements
 *
 * | Operation        | Description                                 | Complexity |
 * | ---------------- | ------------------------------------------- | ---------- |
 * | {@link has}      | Checks if a value exists in the set         | O(1) avg   |
 * | {@link some}     | Checks if any element satisfies a predicate | O(n)       |
 * | {@link every}    | Checks if all elements satisfy a predicate  | O(n)       |
 * | {@link isSubset} | Checks if a set is a subset of another      | O(n)       |
 *
 * ### Getters
 *
 * | Operation        | Description                    | Complexity |
 * | ---------------- | ------------------------------ | ---------- |
 * | {@link values}   | Gets an iterator of all values | O(1)       |
 * | {@link toValues} | Gets an array of all values    | O(n)       |
 * | {@link size}     | Gets the number of elements    | O(1)       |
 *
 * ### Mutations
 *
 * | Operation      | Description                  | Complexity |
 * | -------------- | ---------------------------- | ---------- |
 * | {@link add}    | Adds a value to the set      | O(1) avg   |
 * | {@link remove} | Removes a value from the set | O(1) avg   |
 * | {@link toggle} | Toggles a value's presence   | O(1) avg   |
 *
 * ### Operations
 *
 * | Operation            | Description                       | Complexity |
 * | -------------------- | --------------------------------- | ---------- |
 * | {@link difference}   | Computes set difference (A - B)   | O(n)       |
 * | {@link intersection} | Computes set intersection (A ∩ B) | O(n)       |
 * | {@link union}        | Computes set union (A ∪ B)        | O(n)       |
 *
 * ### Mapping
 *
 * | Operation   | Description             | Complexity |
 * | ----------- | ----------------------- | ---------- |
 * | {@link map} | Transforms each element | O(n)       |
 *
 * ### Sequencing
 *
 * | Operation       | Description                      | Complexity |
 * | --------------- | -------------------------------- | ---------- |
 * | {@link flatMap} | Transforms and flattens elements | O(n)       |
 *
 * ### Traversing
 *
 * | Operation       | Description                        | Complexity |
 * | --------------- | ---------------------------------- | ---------- |
 * | {@link forEach} | Applies a function to each element | O(n)       |
 *
 * ### Folding
 *
 * | Operation      | Description                       | Complexity |
 * | -------------- | --------------------------------- | ---------- |
 * | {@link reduce} | Reduces the set to a single value | O(n)       |
 *
 * ### Filtering
 *
 * | Operation      | Description                             | Complexity |
 * | -------------- | --------------------------------------- | ---------- |
 * | {@link filter} | Keeps elements that satisfy a predicate | O(n)       |
 *
 * ### Partitioning
 *
 * | Operation         | Description                         | Complexity |
 * | ----------------- | ----------------------------------- | ---------- |
 * | {@link partition} | Splits into two sets by a predicate | O(n)       |
 *
 * ## Advanced Features
 *
 * HashSet provides operations for:
 *
 * - Transforming sets with map and flatMap
 * - Filtering elements with filter
 * - Combining sets with union, intersection and difference
 * - Performance optimizations via mutable operations in controlled contexts
 *
 * ## Performance Characteristics
 *
 * - Lookup operations (has): O(1) average time complexity
 * - Insertion operations (add): O(1) average time complexity
 * - Removal operations (remove): O(1) average time complexity
 * - Set operations (union, intersection): O(n) where n is the size of the smaller
 *   set
 * - Iteration: O(n) where n is the size of the set
 *
 * ## Notes
 *
 * The HashSet data structure implements the following traits:
 *
 * - {@link Iterable}: allows iterating over the values in the set
 * - {@link Equal}: allows comparing two sets for value-based equality
 * - {@link Pipeable}: allows chaining operations with the pipe operator
 * - {@link Inspectable}: allows inspecting the contents of the set
 *
 * @module HashSet
 * @since 2.0.0
 */

import type { Equal } from "./Equal.js"
import type { Inspectable } from "./Inspectable.js"
import * as HS from "./internal/hashSet.js"
import type { Pipeable } from "./Pipeable.js"
import type { Predicate, Refinement } from "./Predicate.js"
import type { NoInfer } from "./Types.js"

const TypeId: unique symbol = HS.HashSetTypeId as TypeId

/**
 * @since 2.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 2.0.0
 * @category models
 */
export interface HashSet<out A> extends Iterable<A>, Equal, Pipeable, Inspectable {
  readonly [TypeId]: TypeId
}

/**
 * @since 2.0.0
 * @category refinements
 */
export const isHashSet: {
  <A>(u: Iterable<A>): u is HashSet<A>
  (u: unknown): u is HashSet<unknown>
} = HS.isHashSet

/**
 * Creates an empty `HashSet`.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category constructors
 * @example
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * console.log(
 *   pipe(
 *     // Provide a type argument to create a HashSet of a specific type
 *     HashSet.empty<number>(),
 *     HashSet.add(1),
 *     HashSet.add(1), // Notice the duplicate
 *     HashSet.add(2),
 *     HashSet.toValues
 *   )
 * ) // Output: [1, 2]
 * ```
 *
 * @see Other `HashSet` constructors are {@link make} {@link fromIterable}
 * @todo Remember to add time complexity analisys
 */
export const empty: <A = never>() => HashSet<A> = HS.empty

/**
 * Creates a new `HashSet` from an iterable collection of values.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category constructors
 * @example Creating a HashSet from an {@link Array}
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * console.log(
 *   pipe(
 *     [1, 2, 3, 4, 5, 1, 2, 3], // Array<number> is an Iterable<number>;  Note the duplicates.
 *     HashSet.fromIterable,
 *     HashSet.toValues
 *   )
 * ) // Output: [1, 2, 3, 4, 5]
 * ```
 *
 * @example Creating a HashSet from a {@link Set}
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * console.log(
 *   pipe(
 *     new Set(["apple", "banana", "orange", "apple"]), // Set<string> is an Iterable<string>
 *     HashSet.fromIterable,
 *     HashSet.toValues
 *   )
 * ) // Output: ["apple", "banana", "orange"]
 * ```
 *
 * @example Creating a HashSet from a {@link Generator}
 *
 * ```ts
 * import { HashSet } from "effect"
 *
 * // Generator functions return iterables
 * function* fibonacci(n: number): Generator<number, void, unknown> {
 *   let [a, b] = [0, 1]
 *   for (let i = 0; i < n; i++) {
 *     yield a
 *     ;[a, b] = [b, a + b]
 *   }
 * }
 *
 * // Create a HashSet from the first 10 Fibonacci numbers
 * const fibonacciSet = HashSet.fromIterable(fibonacci(10))
 *
 * console.log(HashSet.toValues(fibonacciSet))
 * // Outputs: [0, 1, 2, 3, 5, 8, 13, 21, 34] but in unsorted order
 * ```
 *
 * @example Creating a HashSet from another {@link HashSet}
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * console.log(
 *   pipe(
 *     // since HashSet implements the Iterable interface, we can use it to create a new HashSet
 *     HashSet.make(1, 2, 3, 4),
 *     HashSet.fromIterable,
 *     HashSet.toValues // turns the HashSet back into an array
 *   )
 * ) // Output: [1, 2, 3, 4]
 * ```
 *
 * @example Creating a HashSet from other Effect's data structures like
 * {@link Chunk}
 *
 * ```ts
 * import { Chunk, HashSet, pipe } from "effect"
 *
 * console.log(
 *   pipe(
 *     Chunk.make(1, 2, 3, 4), // Iterable<number>
 *     HashSet.fromIterable,
 *     HashSet.toValues // turns the HashSet back into an array
 *   )
 * ) // Outputs: [1, 2, 3, 4]
 * ```
 *
 * @todo Remember to add time complexity analisys
 */
export const fromIterable: <A>(elements: Iterable<A>) => HashSet<A> = HS.fromIterable

/**
 * Construct a new `HashSet` from a variable number of values.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category constructors
 * @example
 *
 * ```ts
 * import { Equal, Hash, HashSet, pipe } from "effect"
 * import assert from "node:assert/strict"
 *
 * class Character implements Equal.Equal {
 *   readonly name: string
 *   readonly trait: string
 *
 *   constructor(name: string, trait: string) {
 *     this.name = name
 *     this.trait = trait
 *   }
 *
 *   // Define equality based on name, and trait
 *   [Equal.symbol](that: Equal.Equal): boolean {
 *     if (that instanceof Character) {
 *       return (
 *         Equal.equals(this.name, that.name) &&
 *         Equal.equals(this.trait, that.trait)
 *       )
 *     }
 *     return false
 *   }
 *
 *   // Generate a hash code based on the sum of the character's name and trait
 *   [Hash.symbol](): number {
 *     throw Hash.hash(this.name + this.trait)
 *   }
 *
 *   static readonly of = (name: string, trait: string): Character => {
 *     return new Character(name, trait)
 *   }
 * }
 *
 * assert.strictEqual(
 *   Equal.equals(
 *     HashSet.make(
 *       Character.of("Alice", "Curious"),
 *       Character.of("Alice", "Curious"),
 *       Character.of("White Rabbit", "Always late"),
 *       Character.of("Mad Hatter", "Tea enthusiast")
 *     ),
 *     // Is the same as adding each character to an empty set
 *     pipe(
 *       HashSet.empty(),
 *       HashSet.add(Character.of("Alice", "Curious")),
 *       HashSet.add(Character.of("Alice", "Curious")), // Alice tried to attend twice!
 *       HashSet.add(Character.of("White Rabbit", "Always late")),
 *       HashSet.add(Character.of("Mad Hatter", "Tea enthusiast"))
 *     )
 *   ),
 *   true,
 *   "`HashSet.make` and `HashSet.empty() + HashSet.add()` should be equal"
 * )
 *
 * assert.strictEqual(
 *   Equal.equals(
 *     HashSet.make(
 *       Character.of("Alice", "Curious"),
 *       Character.of("Alice", "Curious"),
 *       Character.of("White Rabbit", "Always late"),
 *       Character.of("Mad Hatter", "Tea enthusiast")
 *     ),
 *     HashSet.fromIterable([
 *       Character.of("Alice", "Curious"),
 *       Character.of("Alice", "Curious"),
 *       Character.of("White Rabbit", "Always late"),
 *       Character.of("Mad Hatter", "Tea enthusiast")
 *     ])
 *   ),
 *   true,
 *   "`HashSet.make` and `HashSet.fromIterable` should be equal"
 * )
 * ```
 *
 * @see Other `HashSet` constructors are {@link fromIterable} {@link empty}
 * @todo Remember to add time complexity analisys
 */
export const make: <As extends ReadonlyArray<any>>(...elements: As) => HashSet<As[number]> = HS.make

/**
 * Checks if the specified value exists in the `HashSet`.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category elements
 * @example **syntax**
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(HashSet.make(0, 1, 2), HashSet.has(3)) // false
 *
 * // or piped with the pipe function
 * HashSet.make(0, 1, 2).pipe(HashSet.has(3)) // false
 *
 * // or with `data-first` API
 * HashSet.has(HashSet.make(0, 1, 2), 3) // false
 * ```
 *
 * @returns A `boolean` signaling the presence of the value in the HashSet
 * @todo Add time complexity analisys
 */
export const has: {
  /**
   * @example {@link has} `data-last` a.k.a. `pipeable` API
   *
   * ```ts
   * import * as assert from "node:assert/strict"
   * import { HashSet, pipe } from "effect"
   *
   * const set = HashSet.make(0, 1, 2)
   *
   * assert.equal(pipe(set, HashSet.has(0)), true)
   * assert.equal(pipe(set, HashSet.has(1)), true)
   * assert.equal(pipe(set, HashSet.has(2)), true)
   * assert.equal(pipe(set, HashSet.has(3)), false)
   * ```
   */
  <A>(value: A): (self: HashSet<A>) => boolean

  /**
   * @example {@link has} `data-first` API
   *
   * ```ts
   * import * as assert from "node:assert/strict"
   * import { HashSet, pipe } from "effect"
   *
   * const set = HashSet.make(0, 1, 2)
   *
   * assert.equal(HashSet.has(set, 0), true)
   * assert.equal(HashSet.has(set, 1), true)
   * assert.equal(HashSet.has(set, 2), true)
   * assert.equal(HashSet.has(set, 3), false)
   * ```
   */
  <A>(self: HashSet<A>, value: A): boolean
} = HS.has

/**
 * Check if a predicate holds true for some `HashSet` element.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category elements
 * @example **syntax**
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * const set: HashSet.HashSet<number> = HashSet.make(0, 1, 2)
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(
 *   set,
 *   HashSet.some((n) => n > 0)
 * ) // true
 *
 * // or piped with the pipe function
 * set.pipe(HashSet.some((n) => n > 0)) // true
 *
 * // or with `data-first` API
 * HashSet.some(set, (n) => n > 0) // true
 * ```
 *
 * @todo Add time complexity analisys
 */
export const some: {
  /**
   * @example {@link some} `data-last` a.k.a. `pipeable` API
   *
   * ```ts
   * import * as assert from "node:assert/strict"
   * import { HashSet, pipe } from "effect"
   *
   * const set = HashSet.make(0, 1, 2)
   *
   * assert.equal(
   *   pipe(
   *     set,
   *     HashSet.some((n) => n > 0)
   *   ),
   *   true
   * )
   *
   * assert.equal(
   *   pipe(
   *     set,
   *     HashSet.some((n) => n > 2)
   *   ),
   *   false
   * )
   * ```
   */
  <A>(f: Predicate<A>): (self: HashSet<A>) => boolean

  /**
   * @example {@link some} `data-first` API
   *
   * ```ts
   * import * as assert from "node:assert/strict"
   * import { HashSet } from "effect"
   *
   * const set = HashSet.make(0, 1, 2)
   *
   * assert.equal(
   *   HashSet.some(set, (n) => n > 0),
   *   true
   * )
   *
   * assert.equal(
   *   HashSet.some(set, (n) => n > 2),
   *   false
   * )
   * ```
   */
  <A>(self: HashSet<A>, f: Predicate<A>): boolean
} = HS.some

/**
 * Check if a predicate holds true for every `HashSet` element.
 *
 * Time complexity is **O(n)** as it need to traverse the whole HashSet
 * collection
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category elements
 * @example **syntax** with {@link Refinement}
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * const numberOrString = HashSet.make(1, "1", "one", "uno")
 *
 * // with `data-last`, a.k.a. `pipeable` API and `Refinement`
 * pipe(
 *   numberOrString, // HashSet.HashSet<number | string>
 *   HashSet.every(Predicate.isString)
 * ) // HashSet.HashSet<string>
 *
 * // or piped with the pipe function and  `Refinement`
 * numberOrString // HashSet.HashSet<number | string>
 *   .pipe(HashSet.every(Predicate.isString)) // HashSet.HashSet<string>
 *
 * // or with `data-first` API and `Refinement`
 * HashSet.every(
 *   numberOrString, // HashSet.HashSet<number | string>
 *   Predicate.isString
 * ) // HashSet.HashSet<string>
 * ```
 *
 * @example **syntax** with {@link Predicate}
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * const set = HashSet.make(1, 2, 3)
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(
 *   set,
 *   HashSet.every((n) => n >= 0)
 * ) // true
 *
 * // or piped with the pipe function
 * set.pipe(HashSet.every((n) => n >= 0)) // true
 *
 * // or with `data-first` API
 * HashSet.every(set, (n) => n >= 0) // true
 * ```
 *
 * @returns A boolean once it has evaluated that whole collecion fullfill the
 *   Predicate function
 */
export const every: {
  /**
   * @example
   *
   * ```ts
   * import * as assert from "node:assert/strict"
   * import { Effect, HashSet, pipe, Predicate } from "effect"
   *
   * const numberOrString: HashSet.HashSet<number | string> = HashSet.make(
   *   1,
   *   "1",
   *   "one",
   *   "uno"
   * )
   *
   * assert.equal(
   *   pipe(
   *     numberOrString, // HashSet.HashSet<number | string>
   *     HashSet.every(Predicate.isString)
   *   ), // HashSet.HashSet<string>
   *   false
   * )
   * ```
   */
  <A, B extends A>(
    refinement: Refinement<NoInfer<A>, B>
  ): (self: HashSet<A>) => self is HashSet<B>

  /**
   * @example
   *
   * ```ts
   * import * as assert from "node:assert/strict"
   * import { HashSet, pipe } from "effect"
   *
   * const set = HashSet.make(0, 1, 2)
   *
   * assert.equal(
   *   pipe(
   *     set,
   *     HashSet.every((n) => n >= 0)
   *   ),
   *   true
   * )
   * ```
   */
  <A>(predicate: Predicate<A>): (self: HashSet<A>) => boolean

  /**
   * @example
   *
   * ```ts
   * import * as assert from "node:assert/strict"
   * import { Effect, HashSet, pipe, Predicate } from "effect"
   *
   * const numberOrString: HashSet.HashSet<number | string> = HashSet.make(
   *   1,
   *   "1",
   *   "one",
   *   "uno"
   * )
   *
   * assert.equal(
   *   HashSet.every(
   *     numberOrString, // HashSet.HashSet<number | string>
   *     Predicate.isString
   *   ), // HashSet.HashSet<string>
   *   false
   * )
   * ```
   */
  <A, B extends A>(
    self: HashSet<A>,
    refinement: Refinement<A, B>
  ): self is HashSet<B>

  /**
   * @example
   *
   * ```ts
   * import * as assert from "node:assert/strict"
   * import { HashSet } from "effect"
   *
   * const set = HashSet.make(0, 1, 2)
   *
   * assert.equal(
   *   HashSet.every(set, (n) => n >= 0),
   *   true
   * )
   * ```
   */
  <A>(self: HashSet<A>, predicate: Predicate<A>): boolean
} = HS.every

/**
 * Returns `true` if and only if every element in the this `HashSet` is an
 * element of the second set,
 *
 * **NOTE**: the hash and equal of both sets must be the same.
 *
 * Time complexity analisys is of `O(n)`
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category elements
 * @example **Syntax**
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * const set1 = HashSet.make(0, 1)
 * const set2 = HashSet.make(1, 2)
 * const set3 = HashSet.make(0, 1, 2)
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(set1, HashSet.isSubset(set2)) // false
 * pipe(set1, HashSet.isSubset(set3)) // true
 *
 * // or piped with the pipe function
 * set1.pipe(HashSet.isSubset(set2)) // false
 * set1.pipe(HashSet.isSubset(set3)) // true
 *
 * // or with `data-first` API
 * HashSet.isSubset(set1, set2) // false
 * HashSet.isSubset(set1, set3) // true)
 * ```
 */
export const isSubset: {
  /**
   * @example
   *
   * ```ts
   * import { HashSet, pipe } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * assert.equal(
   *   pipe(
   *     HashSet.make(0, 1), //
   *     HashSet.isSubset(HashSet.make(1, 2))
   *   ),
   *   false
   * )
   *
   * assert.equal(
   *   pipe(
   *     HashSet.make(0, 1), //
   *     HashSet.isSubset(HashSet.make(0, 1, 2))
   *   ),
   *   true
   * )
   * ```
   */
  <A>(that: HashSet<A>): (self: HashSet<A>) => boolean

  /**
   * @example
   *
   * ```ts
   * import { HashSet } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * assert.equal(HashSet.isSubset(set1, set2), false)
   *
   * assert.equal(HashSet.isSubset(set1, set3), true)
   * ```
   */
  <A>(self: HashSet<A>, that: HashSet<A>): boolean
} = HS.isSubset

/**
 * Returns an `IterableIterator` of the values in the `HashSet`.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category getters
 * @example
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * const numberIterable = pipe(
 *   HashSet.make(0, 1, 1, 2), // HashSet.HashSet<number>
 *   HashSet.values // takes an HashSet<A> and returns an IterableIterator<A>
 * )
 *
 * for (const number of numberIterable) {
 *   console.log(number) // it will logs: 0, 1, 2
 * }
 * ```
 *
 * @see check out the other gettes {@link toValues} {@link size}
 * @todo Remember to add time complexity analisys
 */
export const values: <A>(self: HashSet<A>) => IterableIterator<A> = HS.values

/**
 * Returns an `Array` of the values within the `HashSet`.
 *
 * Time complexity of O(n)
 *
 * @memberof HashSet
 * @since 3.13.0
 * @category getters
 * @example
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 * import { deepStrictEqual } from "node:assert/strict"
 *
 * deepStrictEqual(
 *   pipe(
 *     HashSet.make(0, 1, 1, 2), // HashSet<number>
 *     HashSet.toValues // takes an HashSet<A> and returns an Array<A>
 *   ),
 *   Array.of(0, 1, 2)
 * )
 * ```
 *
 * @see check out the other gettes {@link values} {@link size}
 * @todo Remember to add time complexity analisys
 */
export const toValues = <A>(self: HashSet<A>): Array<A> => Array.from(values(self))

/**
 * Calculates the number of values in the `HashSet`.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category getters
 * @example
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 * import assert from "node:assert/strict"
 *
 * assert.deepStrictEqual(pipe(HashSet.empty(), HashSet.size), 0)
 *
 * assert.deepStrictEqual(
 *   pipe(HashSet.make(1, 2, 2, 3, 4, 3), HashSet.size),
 *   4
 * )
 * ```
 *
 * @see check out the other gettes {@link values} {@link toValues}
 * @todo Remember to add time complexity analisys
 */
export const size: <A>(self: HashSet<A>) => number = HS.size

/**
 * Marks the `HashSet` as mutable.
 *
 * @since 2.0.0
 */
export const beginMutation: <A>(self: HashSet<A>) => HashSet<A> = HS.beginMutation

/**
 * Marks the `HashSet` as immutable.
 *
 * @since 2.0.0
 */
export const endMutation: <A>(self: HashSet<A>) => HashSet<A> = HS.endMutation

/**
 * Mutates the `HashSet` within the context of the provided function.
 *
 * @since 2.0.0
 */
export const mutate: {
  <A>(f: (set: HashSet<A>) => void): (self: HashSet<A>) => HashSet<A>
  <A>(self: HashSet<A>, f: (set: HashSet<A>) => void): HashSet<A>
} = HS.mutate

/**
 * Adds a value to the `HashSet`.
 *
 * @remarks
 * Remember that a `HashSet` is a collection of unique values, so adding a value
 * that already exists in the `HashSet` will not add a duplicate.
 *
 * Remember that HashSet is an immutable data structure, so the `add` function,
 * like all other functions that modify the HashSet, will return a new HashSet
 * with the added value.
 * @memberof HashSet
 * @since 2.0.0
 * @example **Syntax**
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * // with data-last, a.k.a. pipeable API
 * pipe(HashSet.empty(), HashSet.add(0), HashSet.add(0))
 *
 * // or piped with the pipe function
 * HashSet.empty().pipe(HashSet.add(0))
 *
 * // or with data-first API
 * HashSet.add(HashSet.empty(), 0)
 * ```
 *
 * @see check out the other mutations {@link remove} {@link toggle}
 * @todo Remember to add time complexity analisys
 */
export const add: {
  /**
   * @example {@link add} `data-last` a.k.a. `pipeable` API
   *
   * ```ts
   * import { HashSet, pipe } from "effect"
   * import assert from "node:assert/strict"
   *
   * assert.deepStrictEqual(
   *   pipe(
   *     HashSet.empty<number>(), // HashSet.HashSet<number>
   *     HashSet.add(0),
   *     HashSet.add(1),
   *     HashSet.add(1),
   *     HashSet.add(2),
   *     HashSet.toValues
   *   ),
   *   Array.of(0, 1, 2)
   * )
   * ```
   */
  <A>(value: A): (self: HashSet<A>) => HashSet<A>

  /**
   * @example {@link add} `data-first` API
   *
   * ```ts
   * import { HashSet, pipe } from "effect"
   * import assert from "node:assert/strict"
   *
   * const empty = HashSet.empty<number>()
   * const withZero = HashSet.add(empty, 0)
   * const withOne = HashSet.add(withZero, 1)
   * const withTwo = HashSet.add(withOne, 2)
   * const withTwoTwo = HashSet.add(withTwo, 2)
   *
   * assert.deepStrictEqual(HashSet.toValues(withTwoTwo), Array.of(0, 1, 2))
   * ```
   */ 
  <A>(self: HashSet<A>, value: A): HashSet<A>
} = HS.add

/**
 * Removes a value from the `HashSet`.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @example **Syntax**
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(HashSet.make(0, 1, 2), HashSet.remove(0))
 *
 * // or piped with the pipe function
 * HashSet.make(0, 1, 2).pipe(HashSet.remove(0))
 *
 * // or with `data-first` API
 * HashSet.remove(HashSet.make(0, 1, 2), 0)
 * ```
 *
 * @todo Remind the user of the immutability garanties of the HashSet data type
 *
 * @todo Add time complexity analisys
 */
export const remove: {
  /**
   * @example {@link remove} `data-last` a.k.a. `pipeable` API
   *
   * ```ts
   * import { HashSet, pipe } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * const set = HashSet.make(0, 1, 2)
   * const result = pipe(set, HashSet.remove(0))
   *
   * assert.equal(pipe(result, HashSet.has(0)), false) // it has correctly removed 0
   * assert.equal(pipe(set, HashSet.has(0)), true) // it does not mutate the original set
   * assert.equal(pipe(result, HashSet.has(1)), true)
   * assert.equal(pipe(result, HashSet.has(2)), true)
   * ```
   */
  <A>(value: A): (self: HashSet<A>) => HashSet<A>

  /**
   * @example {@link remove} `data-first` API
   *
   * ```ts
   * import { HashSet, pipe } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * const set = HashSet.make(0, 1, 2)
   * const result = HashSet.remove(set, 0)
   *
   * assert.equal(HashSet.has(result, 0), false) // it has correctly removed 0
   * assert.equal(HashSet.has(set, 0), true) // it does not mutate the original set
   * assert.equal(HashSet.has(result, 1), true)
   * assert.equal(HashSet.has(result, 2), true)
   * ```
   */
  <A>(self: HashSet<A>, value: A): HashSet<A>
} = HS.remove

/**
 * Computes the set difference between this `HashSet` and the specified
 * `Iterable<A>`.
 *
 * **NOTE**: the hash and equal of the values in both the set and the iterable
 * must be the same.
 *
 * @since 2.0.0
 */
export const difference: {
  <A>(that: Iterable<A>): (self: HashSet<A>) => HashSet<A>
  <A>(self: HashSet<A>, that: Iterable<A>): HashSet<A>
} = HS.difference

/**
 * Returns a `HashSet` of values which are present in both this set and that
 * `Iterable<A>`.
 *
 * **NOTE**: the hash and equal of the values in both the set and the iterable
 * must be the same.
 *
 * @since 2.0.0
 */
export const intersection: {
  <A>(that: Iterable<A>): (self: HashSet<A>) => HashSet<A>
  <A>(self: HashSet<A>, that: Iterable<A>): HashSet<A>
} = HS.intersection

/**
 * Computes the set union `(`self` + `that`)` between this `HashSet` and the
 * specified `Iterable<A>`.
 *
 * **NOTE**: the hash and equal of the values in both the set and the iterable
 * must be the same.
 *
 * @since 2.0.0
 */
export const union: {
  <A>(that: Iterable<A>): (self: HashSet<A>) => HashSet<A>
  <A>(self: HashSet<A>, that: Iterable<A>): HashSet<A>
} = HS.union

/**
 * Checks if a value is present in the `HashSet`. If it is present, the value
 * will be removed from the `HashSet`, otherwise the value will be added to the
 * `HashSet`.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @example **Syntax**
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(HashSet.make(0, 1, 2), HashSet.toggle(0))
 *
 * // or piped with the pipe function
 * HashSet.make(0, 1, 2).pipe(HashSet.toggle(0))
 *
 * // or with `data-first` API
 * HashSet.toggle(HashSet.make(0, 1, 2), 0)
 * ```
 *
 * @returns A new `HashSet` where the toggled value is being either added or
 *   removed based on the initial `HashSet` state.
 * @todo Add time space complexity analisys
 *
 * @todo Remember to point out that HasSet is an immutable data structure
 */
export const toggle: {
  /**
   * @example {@link toggle} `data-last` a.k.a. `pipeable` API
   *
   * ```ts
   * import { HashSet, pipe } from "effect"
   * import assert from "node:assert/strict"
   *
   * // arrange
   * let set = HashSet.make(0, 1, 2)
   *
   * // assert 1: 0 is in the set
   * assert.equal(pipe(set, HashSet.has(0)), true)
   *
   * // act 2: toggle 0 once on the set
   * set = pipe(set, HashSet.toggle(0))
   *
   * // assert 2: 0 is not in the set any longer
   * assert.equal(pipe(set, HashSet.has(0)), false)
   *
   * // act 3: toggle 0 once again on the set
   * set = pipe(set, HashSet.toggle(0))
   *
   * // assert 3: 0 in now back in the set
   * assert.equal(pipe(set, HashSet.has(0)), true)
   * ```
   */
  <A>(value: A): (self: HashSet<A>) => HashSet<A>

  /**
   * @example {@link toggle} `data-first` API
   *
   * ```ts
   * import { HashSet, pipe } from "effect"
   * import assert from "node:assert/strict"
   *
   * // arrange
   * let set = HashSet.make(0, 1, 2)
   *
   * // assert 1: 0 is in the set
   * assert.equal(HashSet.has(set, 0), true)
   *
   * // act 2: toggle 0 once on the set
   * set = HashSet.toggle(set, 0)
   *
   * // assert 2: 0 is not in the set any longer
   * assert.equal(HashSet.has(set, 0), false)
   *
   * // act 3: toggle 0 once again on the set
   * set = HashSet.toggle(set, 0)
   *
   * // assert 3: 0 in now back in the set
   * assert.equal(HashSet.has(set, 0), true)
   * ```
   */
  <A>(self: HashSet<A>, value: A): HashSet<A>
} = HS.toggle

/**
 * Maps over the values of the `HashSet` using the specified function.
 *
 * The time complexity is of **`O(n)`**.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category mapping
 * @example **Syntax**
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(
 *   HashSet.make(0, 1, 2), // HashSet.HashSet<number>
 *   HashSet.map(String) // HashSet.HashSet<string>
 * )
 *
 * // or piped with the pipe method
 * HashSet.make(0, 1, 2).pipe(HashSet.map(String))
 *
 * // or with `data-first` API
 * HashSet.map(HashSet.make(0, 1, 2), String)
 * ```
 */
export const map: {
  /**
   * @example
   *
   * ```ts
   * import { HashSet, pipe } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * assert.deepStrictEqual(
   *   pipe(
   *     HashSet.make(0, 1, 2), //    HashSet.HashSet<number>
   *     HashSet.map((n) => String(n + 1)) // HashSet.HashSet<String>
   *   ),
   *   HashSet.make("1", "2", "3")
   * )
   * ```
   */
  <A, B>(f: (a: A) => B): (self: HashSet<A>) => HashSet<B>

  /**
   * @example
   *
   * ```ts
   * import { HashSet, pipe } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * assert.deepStrictEqual(
   *   HashSet.map(
   *     HashSet.make(0, 1, 2), //    HashSet.HashSet<number>
   *     (n) => String(n + 1)
   *   ), // HashSet.HashSet<String>
   *   HashSet.make("1", "2", "3")
   * )
   * ```
   */
  <A, B>(self: HashSet<A>, f: (a: A) => B): HashSet<B>
} = HS.map

/**
 * Chains over the values of the `HashSet` using the specified function.
 *
 * The time complexity is of **`O(n)`**.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category sequencing
 * @example **Syntax**
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(
 *   HashSet.make(0, 1, 2), // HashSet.HashSet<number>
 *   HashSet.flatMap((n) => Array.of(String(n))) // HashSet.HashSet<string>
 * )
 *
 * // or piped with the pipe method
 * HashSet.make(0, 1, 2) // HashSet.HashSet<number>
 *   .pipe(
 *     HashSet.flatMap((n) => Array.of(String(n))) // HashSet.HashSet<string>
 *   )
 *
 * // or with `data-first` API
 * HashSet.flatMap(HashSet.make(0, 1, 2), (n) => Array.of(String(n)))
 * ```
 */
export const flatMap: {
  /**
   * @example
   *
   * ```ts
   * import { HashSet, pipe, List } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * assert.deepStrictEqual(
   *   pipe(
   *     HashSet.make(0, 1, 2),
   *     HashSet.flatMap((n) => List.of(String(n * n))) // needs to return an Iterable
   *   ),
   *   HashSet.make("0", "1", "4")
   * )
   * ```
   */
  <A, B>(f: (a: A) => Iterable<B>): (self: HashSet<A>) => HashSet<B>

  /**
   * @example
   *
   * ```ts
   * import { HashSet, pipe, List } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * assert.deepStrictEqual(
   *   HashSet.flatMap(HashSet.make(0, 1, 2), (n) =>
   *     List.of(String(n * n * n))
   *   ), // needs to return an Iterable
   *   HashSet.make("0", "1", "8")
   * )
   * ```
   */
  <A, B>(self: HashSet<A>, f: (a: A) => Iterable<B>): HashSet<B>
} = HS.flatMap

/**
 * Applies the specified function to the values of the `HashSet`.
 *
 * The time complexity is of **`O(n)`**.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category traversing
 * @example **Syntax**
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(HashSet.make(0, 1, 2), HashSet.forEach(console.log)) // logs: 0 1 2
 *
 * // or piped with the pipe method
 * HashSet.make(0, 1, 2).pipe(HashSet.forEach(console.log)) // logs: 0 1 2
 *
 * // or with `data-first` API
 * HashSet.forEach(HashSet.make(0, 1, 2), console.log) // logs: 0 1 2
 * ```
 */
export const forEach: {
  /**
   * @example
   *
   * ```ts
   * import { HashSet, pipe } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * const result: Array<number> = []
   *
   * pipe(
   *   HashSet.make(0, 1, 2),
   *   HashSet.forEach((n): void => {
   *     result.push(n)
   *   })
   * )
   *
   * assert.deepStrictEqual(result, [0, 1, 2])
   * ```
   */
  <A>(f: (value: A) => void): (self: HashSet<A>) => void

  /**
   * @example
   *
   * ```ts
   * import { HashSet, pipe } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * const result: Array<number> = []
   *
   * HashSet.forEach(HashSet.make(0, 1, 2), (n): void => {
   *   result.push(n)
   * })
   *
   * assert.deepStrictEqual(result, [0, 1, 2])
   * ```
   */
  <A>(self: HashSet<A>, f: (value: A) => void): void
} = HS.forEach

/**
 * Reduces the specified state over the values of the `HashSet`.
 *
 * The time complexity is of **`O(n)`**.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category folding
 * @example **Syntax**
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * const sum = (a: number, b: number): number => a + b
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(HashSet.make(0, 1, 2), HashSet.reduce(0, sum))
 *
 * // or with the pipe method
 * HashSet.make(0, 1, 2).pipe(HashSet.reduce(0, sum))
 *
 * // or with `data-first` API
 * HashSet.reduce(HashSet.make(0, 1, 2), 0, sum)
 * ```
 */
export const reduce: {
  /**
   * @example
   *
   * ```ts
   * import { HashSet, pipe } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * assert.equal(
   *   pipe(
   *     HashSet.make(0, 1, 2),
   *     HashSet.reduce(10, (accumulator, value) => accumulator + value)
   *   ),
   *   13
   * )
   * ```
   */
  <A, Z>(zero: Z, f: (accumulator: Z, value: A) => Z): (self: HashSet<A>) => Z

  /**
   * @example
   *
   * ```ts
   * import { HashSet } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * assert.equal(
   *   HashSet.reduce(
   *     HashSet.make(0, 1, 2),
   *     -3,
   *     (accumulator, value) => accumulator + value
   *   ),
   *   0
   * )
   * ```
   */
  <A, Z>(self: HashSet<A>, zero: Z, f: (accumulator: Z, value: A) => Z): Z
} = HS.reduce

/**
 * Filters values out of a `HashSet` using the specified predicate.
 *
 * The time complexity is of **`O(n)`**.
 *
 * @memberof HashSet
 * @since 2.0.0
 * @category filtering
 * @example **Syntax** with {@link Predicate}
 *
 * ```ts
 * import { HashSet, type Predicate, pipe } from "effect"
 *
 * const filterPositiveNumbers: Predicate.Predicate<number> = (n) => n > 0
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(
 *   HashSet.make(-2, -1, 0, 1, 2),
 *   HashSet.filter(filterPositiveNumbers)
 * )
 *
 * // or with the pipe method
 * HashSet.make(-2, -1, 0, 1, 2).pipe(HashSet.filter(filterPositiveNumbers))
 *
 * // or with `data-first` API
 * HashSet.filter(HashSet.make(-2, -1, 0, 1, 2), filterPositiveNumbers)
 * ```
 *
 * @example **Syntax** with {@link Refinement}
 *
 * ```ts
 * import { HashSet, pipe } from "effect"
 *
 * const stringRefinement = (value: unknown): value is string =>
 *   typeof value === "string"
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(
 *   HashSet.make(1, "unos", 2, "two", 3, "trois", 4, "vier"), // // HashSet.HashSet<number | string>
 *   HashSet.filter(stringRefinement)
 * ) // HashSet.HashSet<string>
 *
 * // or with the pipe method
 * HashSet.make(1, "unos", 2, "two", 3, "trois", 4, "vier") // HashSet.HashSet<number | string>
 *   .pipe(HashSet.filter(stringRefinement)) // HashSet.HashSet<string>
 *
 * // or with `data-first` API
 * HashSet.filter(
 *   HashSet.make(1, "unos", 2, "two", 3, "trois", 4, "vier"), // HashSet.HashSet<number | string>
 *   stringRefinement
 * ) // HashSet.HashSet<string>
 * ```
 */
export const filter: {
  /**
   * @example
   *
   * ```ts
   * import { HashSet, pipe, Predicate } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * const numbersAndStringsHashSet: HashSet.HashSet<number | string> =
   *   HashSet.make(1, "unos", 2, "two", 3, "trois", 4, "vier")
   *
   * const stringRefinement: Predicate.Refinement<
   *   string | number,
   *   string
   * > = (value) => typeof value === "string"
   *
   * const stringHashSet: HashSet.HashSet<string> = pipe(
   *   numbersAndStringsHashSet,
   *   HashSet.filter(stringRefinement)
   * )
   *
   * assert.equal(
   *   pipe(stringHashSet, HashSet.every(Predicate.isString)),
   *   true
   * )
   * ```
   */
  <A, B extends A>(
    refinement: Refinement<NoInfer<A>, B>
  ): (self: HashSet<A>) => HashSet<B>

  /**
   * @example
   *
   * ```ts
   * import { HashSet, pipe, type Predicate } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * const filterPositiveNumbers: Predicate.Predicate<number> = (n) => n > 0
   *
   * assert.deepStrictEqual(
   *   pipe(
   *     HashSet.make(-2, -1, 0, 1, 2),
   *     HashSet.filter(filterPositiveNumbers)
   *   ),
   *   HashSet.make(1, 2)
   * )
   * ```
   */
  <A>(predicate: Predicate<NoInfer<A>>): (self: HashSet<A>) => HashSet<A>

  /**
   * @example
   *
   * ```ts
   * import { HashSet, Predicate } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * const numbersAndStringsHashSet: HashSet.HashSet<number | string> =
   *   HashSet.make(1, "unos", 2, "two", 3, "trois", 4, "vier")
   *
   * const stringRefinement: Predicate.Refinement<
   *   string | number,
   *   string
   * > = (value) => typeof value === "string"
   *
   * const stringHashSet: HashSet.HashSet<string> = HashSet.filter(
   *   numbersAndStringsHashSet,
   *   stringRefinement
   * )
   *
   * assert.equal(HashSet.every(stringHashSet, Predicate.isString), true)
   * ```
   */
  <A, B extends A>(
    self: HashSet<A>,
    refinement: Refinement<A, B>
  ): HashSet<B>

  /**
   * @example
   *
   * ```ts
   * import { HashSet, pipe, type Predicate } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * const filterPositiveNumbers: Predicate.Predicate<number> = (n) => n > 0
   *
   * assert.deepStrictEqual(
   *   HashSet.filter(HashSet.make(-2, -1, 0, 1, 2), filterPositiveNumbers),
   *   HashSet.make(1, 2)
   * )
   * ```
   */
  <A>(self: HashSet<A>, predicate: Predicate<A>): HashSet<A>
} = HS.filter

/**
 * Partition the values of a `HashSet` using the specified predicate.
 *
 * If a value matches the predicate, it will be placed into the `HashSet` on the
 * right side of the resulting `Tuple`, otherwise the value will be placed into
 * the left side.
 *
 * @since 2.0.0
 * @category partitioning
 */
export const partition: {
  <A, B extends A>(
    refinement: Refinement<NoInfer<A>, B>
  ): (self: HashSet<A>) => [excluded: HashSet<Exclude<A, B>>, satisfying: HashSet<B>]
  <A>(predicate: Predicate<NoInfer<A>>): (self: HashSet<A>) => [excluded: HashSet<A>, satisfying: HashSet<A>]
  <A, B extends A>(
    self: HashSet<A>,
    refinement: Refinement<A, B>
  ): [excluded: HashSet<Exclude<A, B>>, satisfying: HashSet<B>]
  <A>(self: HashSet<A>, predicate: Predicate<A>): [excluded: HashSet<A>, satisfying: HashSet<A>]
} = HS.partition
