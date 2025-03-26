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
 * @module
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
 * @since 2.0.0
 * @category constructors
 * @example
 *
 * ```ts
 * import { HashSet } from "effect"
 *
 * // Provide a type argument to create a HashSet of a specific type
 * const emptyHashSetOfNumbers = HashSet.empty<number>().pipe(
 *   HashSet.add(1),
 *   HashSet.add(1),
 *   HashSet.add(2)
 * )
 *
 * console.log(HashSet.size(emptyHashSetOfNumbers)) // Output: 2
 * console.log(HashSet.toValues(emptyHashSetOfNumbers)) // Output: [1, 2]
 * ```
 */
export const empty: <A = never>() => HashSet<A> = HS.empty

/**
 * Creates a new `HashSet` from an iterable collection of values.
 *
 * @since 2.0.0
 * @category constructors
 */
export const fromIterable: <A>(elements: Iterable<A>) => HashSet<A> = HS.fromIterable

/**
 * Construct a new `HashSet` from a variable number of values.
 *
 * @since 2.0.0
 * @category constructors
 * @example
 *   import { Equal, Hash, HashSet, pipe } from "effect"
 *   import assert from "node:assert/strict"
 *
 *   assert.strictEqual(
 *     Equal.equals(
 *       HashSet.make(
 *         Character.of("Alice", "Curious"),
 *         Character.of("Alice", "Curious"),
 *         Character.of("White Rabbit", "Always late"),
 *         Character.of("Mad Hatter", "Tea enthusiast")
 *       ),
 *       // Is the same as adding each character to an empty set
 *       pipe(
 *         HashSet.empty(),
 *         HashSet.add(Character.of("Alice", "Curious")),
 *         HashSet.add(Character.of("Alice", "Curious")), // Alice tried to attend twice!
 *         HashSet.add(Character.of("White Rabbit", "Always late")),
 *         HashSet.add(Character.of("Mad Hatter", "Tea enthusiast"))
 *       )
 *     ),
 *     true
 *   )
 *
 *   assert.strictEqual(
 *     Equal.equals(
 *       HashSet.make(
 *         Character.of("Alice", "Curious"),
 *         Character.of("Alice", "Curious"),
 *         Character.of("White Rabbit", "Always late"),
 *         Character.of("Mad Hatter", "Tea enthusiast")
 *       ),
 *       // Is the same as creating a set from an iterable
 *       HashSet.fromIterable([
 *         Character.of("Alice", "Curious"),
 *         Character.of("Alice", "Curious"),
 *         Character.of("White Rabbit", "Always late"),
 *         Character.of("Mad Hatter", "Tea enthusiast")
 *       ])
 *     ),
 *     true
 *   )
 *
 *   class Character implements Equal.Equal {
 *     readonly name: string
 *     readonly trait: string
 *
 *     constructor(name: string, trait: string) {
 *       this.name = name
 *       this.trait = trait
 *     }
 *
 *     // Define equality based on name, and trait
 *     [Equal.symbol](that: Equal.Equal): boolean {
 *       if (that instanceof Character) {
 *         return (
 *           Equal.equals(this.name, that.name) &&
 *           Equal.equals(this.trait, that.trait)
 *         )
 *       }
 *       return false
 *     }
 *
 *     // Generate a hash code based on the sum of the character's name and trait
 *     [Hash.symbol](): number {
 *       throw Hash.hash(this.name + this.trait)
 *     }
 *
 *     static readonly of = (name: string, trait: string): Character => {
 *       return new Character(name, trait)
 *     }
 *   }
 *
 * @see Other `HashSet` constructors are {@link fromIterable} {@link empty}
 */
export const make: <As extends ReadonlyArray<any>>(...elements: As) => HashSet<As[number]> = HS.make

/**
 * Checks if the specified value exists in the `HashSet`.
 *
 * @since 2.0.0
 * @category elements
 */
export const has: {
  <A>(value: A): (self: HashSet<A>) => boolean
  <A>(self: HashSet<A>, value: A): boolean
} = HS.has

/**
 * Check if a predicate holds true for some `HashSet` element.
 *
 * @since 2.0.0
 * @category elements
 */
export const some: {
  <A>(f: Predicate<A>): (self: HashSet<A>) => boolean
  <A>(self: HashSet<A>, f: Predicate<A>): boolean
} = HS.some

/**
 * Check if a predicate holds true for every `HashSet` element.
 *
 * @since 2.0.0
 * @category elements
 */
export const every: {
  <A, B extends A>(refinement: Refinement<NoInfer<A>, B>): (self: HashSet<A>) => self is HashSet<B>
  <A>(predicate: Predicate<A>): (self: HashSet<A>) => boolean
  <A, B extends A>(self: HashSet<A>, refinement: Refinement<A, B>): self is HashSet<B>
  <A>(self: HashSet<A>, predicate: Predicate<A>): boolean
} = HS.every

/**
 * Returns `true` if and only if every element in the this `HashSet` is an
 * element of the second set,
 *
 * **NOTE**: the hash and equal of both sets must be the same.
 *
 * @since 2.0.0
 * @category elements
 */
export const isSubset: {
  <A>(that: HashSet<A>): (self: HashSet<A>) => boolean
  <A>(self: HashSet<A>, that: HashSet<A>): boolean
} = HS.isSubset

/**
 * Returns an `IterableIterator` of the values in the `HashSet`.
 *
 * @since 2.0.0
 * @category getters
 */
export const values: <A>(self: HashSet<A>) => IterableIterator<A> = HS.values

/**
 * Returns an `Array` of the values within the `HashSet`.
 *
 * @since 3.13.0
 * @category getters
 */
export const toValues = <A>(self: HashSet<A>): Array<A> => Array.from(values(self))

/**
 * Calculates the number of values in the `HashSet`.
 *
 * @since 2.0.0
 * @category getters
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
 * @since 2.0.0
 */
export const add: {
  <A>(value: A): (self: HashSet<A>) => HashSet<A>
  <A>(self: HashSet<A>, value: A): HashSet<A>
} = HS.add

/**
 * Removes a value from the `HashSet`.
 *
 * @since 2.0.0
 */
export const remove: {
  <A>(value: A): (self: HashSet<A>) => HashSet<A>
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
 * @since 2.0.0
 */
export const toggle: {
  <A>(value: A): (self: HashSet<A>) => HashSet<A>
  <A>(self: HashSet<A>, value: A): HashSet<A>
} = HS.toggle

/**
 * Maps over the values of the `HashSet` using the specified function.
 *
 * @since 2.0.0
 * @category mapping
 */
export const map: {
  <A, B>(f: (a: A) => B): (self: HashSet<A>) => HashSet<B>
  <A, B>(self: HashSet<A>, f: (a: A) => B): HashSet<B>
} = HS.map

/**
 * Chains over the values of the `HashSet` using the specified function.
 *
 * @since 2.0.0
 * @category sequencing
 */
export const flatMap: {
  <A, B>(f: (a: A) => Iterable<B>): (self: HashSet<A>) => HashSet<B>
  <A, B>(self: HashSet<A>, f: (a: A) => Iterable<B>): HashSet<B>
} = HS.flatMap

/**
 * Applies the specified function to the values of the `HashSet`.
 *
 * @since 2.0.0
 * @category traversing
 */
export const forEach: {
  <A>(f: (value: A) => void): (self: HashSet<A>) => void
  <A>(self: HashSet<A>, f: (value: A) => void): void
} = HS.forEach

/**
 * Reduces the specified state over the values of the `HashSet`.
 *
 * @since 2.0.0
 * @category folding
 */
export const reduce: {
  <A, Z>(zero: Z, f: (accumulator: Z, value: A) => Z): (self: HashSet<A>) => Z
  <A, Z>(self: HashSet<A>, zero: Z, f: (accumulator: Z, value: A) => Z): Z
} = HS.reduce

/**
 * Filters values out of a `HashSet` using the specified predicate.
 *
 * @since 2.0.0
 * @category filtering
 */
export const filter: {
  <A, B extends A>(refinement: Refinement<NoInfer<A>, B>): (self: HashSet<A>) => HashSet<B>
  <A>(predicate: Predicate<NoInfer<A>>): (self: HashSet<A>) => HashSet<A>
  <A, B extends A>(self: HashSet<A>, refinement: Refinement<A, B>): HashSet<B>
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
