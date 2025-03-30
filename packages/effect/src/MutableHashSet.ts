/**
 * Mutable sibling of {@link module:HashSet}
 *
 * @since 2.0.0
 * @module MutableHashSet
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
 * @since 2.0.0
 * @category constructors
 * @memberOf MutableHashSet
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
 */
export const empty = <K = never>(): MutableHashSet<K> => fromHashMap(MutableHashMap.empty())

/**
 * Creates a new `MutableHashSet` from an iterable collection of values.
 *
 * @since 2.0.0
 * @category constructors
 */
export const fromIterable = <K = never>(keys: Iterable<K>): MutableHashSet<K> =>
  fromHashMap(MutableHashMap.fromIterable(Array.from(keys).map((k) => [k, true])))

/**
 * @since 2.0.0
 * @category constructors
 */
export const make = <Keys extends ReadonlyArray<unknown>>(
  ...keys: Keys
): MutableHashSet<Keys[number]> => fromIterable(keys)

/**
 * @since 2.0.0
 * @category elements
 */
export const add: {
  <V>(key: V): (self: MutableHashSet<V>) => MutableHashSet<V>
  <V>(self: MutableHashSet<V>, key: V): MutableHashSet<V>
} = Dual.dual<
  <V>(key: V) => (self: MutableHashSet<V>) => MutableHashSet<V>,
  <V>(self: MutableHashSet<V>, key: V) => MutableHashSet<V>
>(2, (self, key) => (MutableHashMap.set(self.keyMap, key, true), self))

/**
 * @since 2.0.0
 * @category elements
 */
export const has: {
  <V>(key: V): (self: MutableHashSet<V>) => boolean
  <V>(self: MutableHashSet<V>, key: V): boolean
} = Dual.dual<
  <V>(key: V) => (self: MutableHashSet<V>) => boolean,
  <V>(self: MutableHashSet<V>, key: V) => boolean
>(2, (self, key) => MutableHashMap.has(self.keyMap, key))

/**
 * @since 2.0.0
 * @category elements
 */
export const remove: {
  <V>(key: V): (self: MutableHashSet<V>) => MutableHashSet<V>
  <V>(self: MutableHashSet<V>, key: V): MutableHashSet<V>
} = Dual.dual<
  <V>(key: V) => (self: MutableHashSet<V>) => MutableHashSet<V>,
  <V>(self: MutableHashSet<V>, key: V) => MutableHashSet<V>
>(2, (self, key) => (MutableHashMap.remove(self.keyMap, key), self))

/**
 * @since 2.0.0
 * @category elements
 */
export const size = <V>(self: MutableHashSet<V>): number => MutableHashMap.size(self.keyMap)

/**
 * @since 2.0.0
 * @category elements
 */
export const clear = <V>(self: MutableHashSet<V>): MutableHashSet<V> => (MutableHashMap.clear(self.keyMap), self)
