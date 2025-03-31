/**
 * Mutable sibling of {@link module:HashSet}
 *
 * @module MutableHashSet
 * @since 2.0.0
 * @since 2.0.0
 */
import * as Dual from "./Function.js"
import { format, type Inspectable, NodeInspectSymbol, toJSON } from "./Inspectable.js"
import * as MutableHashMap from "./MutableHashMap.js"
import type { Pipeable } from "./Pipeable.js"
import { pipeArguments } from "./Pipeable.js"

const TypeId: unique symbol = Symbol.for("effect/MutableHashSet") as TypeId

/**
 * @since 2.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 2.0.0
 * @category models
 */
export interface MutableHashSet<out V> extends Iterable<V>, Pipeable, Inspectable {
  readonly [TypeId]: TypeId

  /** @internal */
  readonly keyMap: MutableHashMap.MutableHashMap<V, boolean>
}

const MutableHashSetProto: Omit<MutableHashSet<unknown>, "keyMap"> = {
  [TypeId]: TypeId,
  [Symbol.iterator](this: MutableHashSet<unknown>): Iterator<unknown> {
    return Array.from(this.keyMap).map(([_]) => _)[Symbol.iterator]()
  },
  toString() {
    return format(this.toJSON())
  },
  toJSON() {
    return {
      _id: "MutableHashSet",
      values: Array.from(this).map(toJSON)
    }
  },
  [NodeInspectSymbol]() {
    return this.toJSON()
  },
  pipe() {
    return pipeArguments(this, arguments)
  }
}

const fromHashMap = <V>(keyMap: MutableHashMap.MutableHashMap<V, boolean>): MutableHashSet<V> => {
  const set = Object.create(MutableHashSetProto)
  set.keyMap = keyMap
  return set
}

/**
 * @memberof MutableHashSet
 * @since 2.0.0
 * @category constructors
 * @example
 *
 * ```ts
 * import { MutableHashSet } from "effect"
 *
 * type T = unknown // replace with your type
 *
 * // in places where the type cant be inferred, replace with your type
 * const set: MutableHashSet.MutableHashSet<T> = MutableHashSet.empty<T>()
 * ```
 *
 * See also: Other `MutableHashSet` constructors are
 * {@link module:MutableHashSet.make} {@link module:MutableHashSet.fromIterable}
 */
export const empty = <K = never>(): MutableHashSet<K> => fromHashMap(MutableHashMap.empty())

/**
 * Creates a new `MutableHashSet` from an iterable collection of values.
 *
 * Time complexity: **`O(n)`** where n is the number of elements in the iterable
 *
 * Creating a MutableHashSet from an `Array`
 *
 * ```ts
 * import { MutableHashSet, pipe } from "effect"
 *
 * console.log(
 *   pipe(
 *     [1, 2, 3, 4, 5, 1, 2, 3], // Array<number> is an Iterable<number>;  Note the duplicates.
 *     MutableHashSet.fromIterable,
 *     MutableHashSet.toValues
 *   )
 * ) // Output: [1, 2, 3, 4, 5]
 * ```
 *
 * Creating a MutableHashSet from a `Set`
 *
 * ```ts
 * import { MutableHashSet, pipe } from "effect"
 *
 * console.log(
 *   pipe(
 *     new Set(["apple", "banana", "orange", "apple"]), // Set<string> is an Iterable<string>
 *     MutableHashSet.fromIterable,
 *     MutableHashSet.toValues
 *   )
 * ) // Output: ["apple", "banana", "orange"]
 * ```
 *
 * Creating a MutableHashSet from a `Generator`
 *
 * ```ts
 * import { MutableHashSet } from "effect"
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
 * // Create a MutableHashSet from the first 10 Fibonacci numbers
 * const fibonacciSet = MutableHashSet.fromIterable(fibonacci(10))
 *
 * console.log(MutableHashSet.toValues(fibonacciSet))
 * // Outputs: [0, 1, 2, 3, 5, 8, 13, 21, 34] but in unsorted order
 * ```
 *
 * Creating a MutableHashSet from another `MutableHashSet`
 *
 * ```ts
 * import { MutableHashSet, pipe } from "effect"
 *
 * console.log(
 *   pipe(
 *     // since MutableHashSet implements the Iterable interface, we can use it to create a new MutableHashSet
 *     MutableHashSet.make(1, 2, 3, 4),
 *     MutableHashSet.fromIterable,
 *     MutableHashSet.toValues // turns the HashSet back into an array
 *   )
 * ) // Output: [1, 2, 3, 4]
 * ```
 *
 * Creating a MutableHashSet from other Effect's data structures like `Chunk`
 *
 * ```ts
 * import { Chunk, MutableHashSet, pipe } from "effect"
 *
 * console.log(
 *   pipe(
 *     Chunk.make(1, 2, 3, 4), // Iterable<number>
 *     MutableHashSet.fromIterable,
 *     MutableHashSet.toValues // turns the MutableHashSet back into an array
 *   )
 * ) // Outputs: [1, 2, 3, 4]
 * ```
 *
 * @memberof MutableHashSet
 * @since 2.0.0
 * @category constructors
 * @see Other `MutableHashSet` constructors are {@link module:MutableHashSet.empty} {@link module:MutableHashSet.make}
 */
export const fromIterable = <K = never>(keys: Iterable<K>): MutableHashSet<K> =>
  fromHashMap(MutableHashMap.fromIterable(Array.from(keys).map((k) => [k, true])))

/**
 * Construct a new `MutableHashSet` from a variable number of values.
 *
 * Time complexity: **`O(n)`** where n is the number of elements
 *
 * @memberof MutableHashSet
 * @since 2.0.0
 * @category constructors
 * @example
 *
 * ```ts
 * import { Equal, Hash, MutableHashSet, pipe } from "effect"
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
 *     return Hash.hash(this.name + this.trait)
 *   }
 *
 *   static readonly of = (name: string, trait: string): Character => {
 *     return new Character(name, trait)
 *   }
 * }
 *
 * assert.strictEqual(
 *   Equal.equals(
 *     MutableHashSet.make(
 *       Character.of("Alice", "Curious"),
 *       Character.of("Alice", "Curious"),
 *       Character.of("White Rabbit", "Always late"),
 *       Character.of("Mad Hatter", "Tea enthusiast")
 *     ),
 *     // Is the same as adding each character to an empty set
 *     pipe(
 *       MutableHashSet.empty(),
 *       MutableHashSet.add(Character.of("Alice", "Curious")),
 *       MutableHashSet.add(Character.of("Alice", "Curious")), // Alice tried to attend twice!
 *       MutableHashSet.add(Character.of("White Rabbit", "Always late")),
 *       MutableHashSet.add(Character.of("Mad Hatter", "Tea enthusiast"))
 *     )
 *   ),
 *   true,
 *   "`MutableHashSet.make` and `MutableHashSet.empty() + MutableHashSet.add()` should be equal"
 * )
 *
 * assert.strictEqual(
 *   Equal.equals(
 *     MutableHashSet.make(
 *       Character.of("Alice", "Curious"),
 *       Character.of("Alice", "Curious"),
 *       Character.of("White Rabbit", "Always late"),
 *       Character.of("Mad Hatter", "Tea enthusiast")
 *     ),
 *     MutableHashSet.fromIterable([
 *       Character.of("Alice", "Curious"),
 *       Character.of("Alice", "Curious"),
 *       Character.of("White Rabbit", "Always late"),
 *       Character.of("Mad Hatter", "Tea enthusiast")
 *     ])
 *   ),
 *   true,
 *   "`MutableHashSet.make` and `MutableHashSet.fromIterable` should be equal"
 * )
 * ```
 *
 * @see Other `MutableHashSet` constructors are {@link module:MutableHashSet.fromIterable} {@link module:MutableHashSet.empty}
 */
export const make = <Keys extends ReadonlyArray<unknown>>(
  ...keys: Keys
): MutableHashSet<Keys[number]> => fromIterable(keys)

/**
 * **Checks** whether the `MutableHashSet` contains the given element, and
 * **add** it if not.
 *
 * Time complexity: **`O(1)`** average
 *
 * **Syntax**
 *
 * ```ts
 * import { MutableHashSet, pipe } from "effect"
 *
 * // with data-last, a.k.a. pipeable API
 * pipe(
 *   MutableHashSet.empty(),
 *   MutableHashSet.add(0),
 *   MutableHashSet.add(0)
 * )
 *
 * // or piped with the pipe function
 * MutableHashSet.empty().pipe(MutableHashSet.add(0))
 *
 * // or with data-first API
 * MutableHashSet.add(MutableHashSet.empty(), 0)
 * ```
 *
 * @memberof MutableHashSet
 * @since 2.0.0
 * @category elements
 * @see Other `MutableHashSet` elements are {@link module:MutableHashSet.remove} {@link module:MutableHashSet.size} {@link module:MutableHashSet.clear} {@link module:MutableHashSet.has}
 */
export const add: {
  /**
   * `data-last` a.k.a. `pipeable` API
   *
   * ```ts
   * import { MutableHashSet, pipe } from "effect"
   * import assert from "node:assert/strict"
   *
   * const mutableHashSet = pipe(
   *   MutableHashSet.empty<number>(), // MutableHashSet.MutableHashSet<number>
   *   MutableHashSet.add(0),
   *   MutableHashSet.add(1),
   *   MutableHashSet.add(1),
   *   MutableHashSet.add(2)
   * )
   *
   * assert.deepStrictEqual(
   *   Array.from(mutableHashSet), // remember that MutableHashSet is also an Iterable
   *   Array.of(0, 1, 2)
   * )
   * ```
   *
   * @typeParam V - The type of elements stored in the `MutableHashSet`.
   * @param key - The key to be added to the `MutableHashSet` if not already
   *   present.
   * @returns A function that accepts a `MutableHashSet` and returns the
   *   reference of the updated `MutableHashSet` including the key.
   */
  <V>(key: V): (self: MutableHashSet<V>) => MutableHashSet<V>

  /**
   * `data-first` API
   *
   * ```ts
   * import { MutableHashSet } from "effect"
   * import assert from "node:assert/strict"
   *
   * const empty = MutableHashSet.empty<number>()
   * const withZero = MutableHashSet.add(empty, 0)
   * const withOne = MutableHashSet.add(withZero, 1)
   * const withTwo = MutableHashSet.add(withOne, 2)
   * const withTwoTwo = MutableHashSet.add(withTwo, 2)
   *
   * assert(Object.is(withTwoTwo, empty)) // proof that it does mutate the original set
   *
   * assert.deepStrictEqual(
   *   Array.from(withTwoTwo), // remember that MutableHashSet is also an Iterable
   *   Array.of(0, 1, 2)
   * )
   * ```
   *
   * @typeParam V - The type of elements stored in the `MutableHashSet`.
   * @param self - The `MutableHashSet` instance from which the key should be
   *   added to.
   * @param key - The key to be added to the `MutableHashSet` if not already
   *   present.
   * @returns The reference of the updated `MutableHashSet` including the key.
   */
  <V>(self: MutableHashSet<V>, key: V): MutableHashSet<V>
} = Dual.dual<
  <V>(key: V) => (self: MutableHashSet<V>) => MutableHashSet<V>,
  <V>(self: MutableHashSet<V>, key: V) => MutableHashSet<V>
>(2, (self, key) => (MutableHashMap.set(self.keyMap, key, true), self))

/**
 * Checks if the specified value exists in the `MutableHashSet`.
 *
 * Time complexity: `O(1)` average
 *
 * **Syntax**
 *
 * ```ts
 * import { MutableHashSet, pipe } from "effect"
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(MutableHashSet.make(0, 1, 2), MutableHashSet.has(3)) // false
 *
 * // or piped with the pipe function
 * MutableHashSet.make(0, 1, 2).pipe(MutableHashSet.has(3)) // false
 *
 * // or with `data-first` API
 * MutableHashSet.has(MutableHashSet.make(0, 1, 2), 3) // false
 * ```
 *
 * @memberof MutableHashSet
 * @since 2.0.0
 * @category elements
 * @see Other `MutableHashSet` elements are {@link module:MutableHashSet.add} {@link module:MutableHashSet.remove} {@link module:MutableHashSet.size} {@link module:MutableHashSet.clear}
 */
export const has: {
  /**
   * `data-last` a.k.a. `pipeable` API
   *
   * ```ts
   * import * as assert from "node:assert/strict"
   * import { MutableHashSet, pipe } from "effect"
   *
   * const set = MutableHashSet.make(0, 1, 2)
   *
   * assert.equal(pipe(set, MutableHashSet.has(0)), true)
   * assert.equal(pipe(set, MutableHashSet.has(1)), true)
   * assert.equal(pipe(set, MutableHashSet.has(2)), true)
   * assert.equal(pipe(set, MutableHashSet.has(3)), false)
   * ```
   */
  <V>(key: V): (self: MutableHashSet<V>) => boolean

  /**
   * `data-first` API
   *
   * ```ts
   * import * as assert from "node:assert/strict"
   * import { MutableHashSet, pipe } from "effect"
   *
   * const set = MutableHashSet.make(0, 1, 2)
   *
   * assert.equal(MutableHashSet.has(set, 0), true)
   * assert.equal(MutableHashSet.has(set, 1), true)
   * assert.equal(MutableHashSet.has(set, 2), true)
   * assert.equal(MutableHashSet.has(set, 3), false)
   * ```
   */
  <V>(self: MutableHashSet<V>, key: V): boolean
} = Dual.dual<
  <V>(key: V) => (self: MutableHashSet<V>) => boolean,
  <V>(self: MutableHashSet<V>, key: V) => boolean
>(2, (self, key) => MutableHashMap.has(self.keyMap, key))

/**
 * Removes a value from the `MutableHashSet`.
 *
 * Time complexity: **`O(1)`** average
 *
 * **Syntax**
 *
 * ```ts
 * import { MutableHashSet, pipe } from "effect"
 *
 * // with `data-last`, a.k.a. `pipeable` API
 * pipe(MutableHashSet.make(0, 1, 2), MutableHashSet.remove(0))
 *
 * // or piped with the pipe function
 * MutableHashSet.make(0, 1, 2).pipe(MutableHashSet.remove(0))
 *
 * // or with `data-first` API
 * MutableHashSet.remove(MutableHashSet.make(0, 1, 2), 0)
 * ```
 *
 * @memberof MutableHashSet
 * @since 2.0.0
 * @category elements
 * @see Other `MutableHashSet` elements are {@link module:MutableHashSet.add} {@link module:MutableHashSet.has} {@link module:MutableHashSet.size} {@link module:MutableHashSet.clear}
 */
export const remove: {
  /**
   * `data-last` a.k.a. `pipeable` API
   *
   * ```ts
   * import { MutableHashSet, pipe } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * const set = MutableHashSet.make(0, 1, 2)
   * const result = pipe(set, MutableHashSet.remove(0))
   *
   * assert.equal(pipe(result, MutableHashSet.has(0)), false) // it has correctly removed 0
   * assert.equal(pipe(set, MutableHashSet.has(0)), true) // it does not mutate the original set
   * assert.equal(pipe(result, MutableHashSet.has(1)), true)
   * assert.equal(pipe(result, MutableHashSet.has(2)), true)
   * ```
   */
  <V>(key: V): (self: MutableHashSet<V>) => MutableHashSet<V>

  /**
   * `data-first` API
   *
   * ```ts
   * import { MutableHashSet, pipe } from "effect"
   * import * as assert from "node:assert/strict"
   *
   * const set = MutableHashSet.make(0, 1, 2)
   * const result = MutableHashSet.remove(set, 0)
   *
   * assert.equal(MutableHashSet.has(result, 0), false) // it has correctly removed 0
   * assert.equal(MutableHashSet.has(set, 0), true) // it does not mutate the original set
   * assert.equal(MutableHashSet.has(result, 1), true)
   * assert.equal(MutableHashSet.has(result, 2), true)
   * ```
   */
  <V>(self: MutableHashSet<V>, key: V): MutableHashSet<V>
} = Dual.dual<
  <V>(key: V) => (self: MutableHashSet<V>) => MutableHashSet<V>,
  <V>(self: MutableHashSet<V>, key: V) => MutableHashSet<V>
>(2, (self, key) => (MutableHashMap.remove(self.keyMap, key), self))

/**
 * Calculates the number of values in the `HashSet`.
 *
 * Time complexity: **`O(1)`**
 *
 * @memberof MutableHashSet
 * @since 2.0.0
 * @category elements
 * @example
 *
 * ```ts
 * import { MutableHashSet, pipe } from "effect"
 * import assert from "node:assert/strict"
 *
 * assert.deepStrictEqual(
 *   pipe(MutableHashSet.empty(), MutableHashSet.size),
 *   0
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(MutableHashSet.make(1, 2, 2, 3, 4, 3), MutableHashSet.size),
 *   4
 * )
 * ```
 *
 * @see Other `MutableHashSet` elements are {@link module:MutableHashSet.add} {@link module:MutableHashSet.has} {@link module:MutableHashSet.remove} {@link module:MutableHashSet.clear}
 */
export const size = <V>(self: MutableHashSet<V>): number => MutableHashMap.size(self.keyMap)

/**
 * Removes all values from the `MutableHashSet`.
 *
 * @memberof MutableHashSet
 * @since 2.0.0
 * @category elements
 * @example
 *
 * ```ts
 * import { MutableHashSet, pipe } from "effect"
 * import assert from "node:assert/strict"
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     MutableHashSet.make(1, 2, 3, 4),
 *     MutableHashSet.clear,
 *     MutableHashSet.size
 *   ),
 *   0
 * )
 * ```
 *
 * @see Other `MutableHashSet` elements are {@link module:MutableHashSet.add} {@link module:MutableHashSet.has} {@link module:MutableHashSet.remove} {@link module:MutableHashSet.size}
 */
export const clear = <V>(self: MutableHashSet<V>): MutableHashSet<V> => (MutableHashMap.clear(self.keyMap), self)
