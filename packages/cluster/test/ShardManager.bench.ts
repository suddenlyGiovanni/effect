import {
  MessageStorage,
  Runner,
  RunnerAddress,
  RunnerHealth,
  Runners,
  ShardId,
  ShardingConfig,
  ShardManager,
  ShardStorage
} from "@effect/cluster"
import { decideAssignmentsForUnassignedShards, RunnerWithMetadata, State } from "@effect/cluster/internal/shardManager"
import { bench, describe, expect } from "@effect/vitest"
import { Array, Data, Effect, Layer, Logger, MutableHashMap, Option, TestClock, TestContext } from "effect"

describe("ShardManager", () => {
  const shards300 = Array.makeBy(
    300,
    (i) => [ShardId.make(i + 1), Option.none<RunnerAddress.RunnerAddress>()] as const
  )
  const state30 = new State(
    MutableHashMap.fromIterable(Array.makeBy(30, (i) => {
      const address = RunnerAddress.make(`${i}`, i)
      const meta = RunnerWithMetadata({
        runner: Runner.Runner.make({ address, version: 1 }),
        registeredAt: Date.now()
      })
      return [address, meta] as const
    })),
    new Map(shards300)
  )

  const shards1000 = Array.makeBy(
    1000,
    (i) => [ShardId.make(i + 1), Option.none<RunnerAddress.RunnerAddress>()] as const
  )
  const state100 = new State(
    MutableHashMap.fromIterable(Array.makeBy(100, (i) => {
      const address = RunnerAddress.make(`${i}`, i)
      const meta = RunnerWithMetadata({
        runner: Runner.make({ address, version: 1 }),
        registeredAt: Date.now()
      })
      return [address, meta] as const
    })),
    new Map(shards1000)
  )

  bench("decideAssignmentsForUnassignedShards - 30 runners 300 shards", () => {
    decideAssignmentsForUnassignedShards(state30)
  })

  bench("decideAssignmentsForUnassignedShards - 100 runners 1000 shards", () => {
    decideAssignmentsForUnassignedShards(state100)
  })

  const ShardManagerLive = ShardManager.layer.pipe(
    Layer.provide(ShardManager.layerConfig({
      rebalanceDebounce: 0
    }))
  )
  const RunnerHealthLive = RunnerHealth.layer.pipe(
    Layer.provideMerge(Runners.layerNoop)
  )
  const TestLive = ShardManagerLive.pipe(
    Layer.provideMerge(Layer.mergeAll(
      ShardStorage.layerNoop,
      RunnerHealthLive
    )),
    Layer.provide(ShardingConfig.layer()),
    Layer.provide(MessageStorage.layerNoop),
    Layer.provideMerge(TestContext.TestContext),
    Layer.provideMerge(Logger.remove(Logger.defaultLogger))
  )

  bench("ShardManager - 50 runners up & down", () =>
    Effect.gen(function*() {
      const manager = yield* ShardManager.ShardManager

      yield* simulate(Array.range(1, 50).map(registerRunner))
      yield* TestClock.adjust("20 seconds")

      const assignments = yield* manager.getAssignments
      const values = Array.fromIterable(assignments.values())
      const allRunnersAssigned = Array.every(values, Option.isSome)
      expect(allRunnersAssigned).toBe(true)

      yield* simulate(Array.range(1, 50).map(unregisterRunner))
      yield* TestClock.adjust("1 second")

      const assignments2 = yield* manager.getAssignments
      const values2 = Array.fromIterable(assignments2.values())
      const allRunnersUnassigned = Array.every(values2, Option.isNone)
      expect(allRunnersUnassigned).toBe(true)
    }).pipe(
      Effect.provide(TestLive),
      Effect.runPromise
    ))
})

function registerRunner(n: number) {
  const runner = Runner.make({
    address: RunnerAddress.make("server", n),
    version: 1
  })
  return SimulationEvent.RegisterRunner({ runner })
}
function unregisterRunner(n: number) {
  const address = RunnerAddress.make("server", n)
  return SimulationEvent.UnregisterRunner({ address })
}

type SimulationEvent = Data.TaggedEnum<{
  readonly RegisterRunner: { readonly runner: Runner.Runner }
  readonly UnregisterRunner: { readonly address: RunnerAddress.RunnerAddress }
}>
const SimulationEvent = Data.taggedEnum<SimulationEvent>()

const handleEvent = SimulationEvent.$match({
  RegisterRunner: ({ runner }) =>
    ShardManager.ShardManager.pipe(
      Effect.flatMap((manager) => manager.register(runner))
    ),
  UnregisterRunner: ({ address }) =>
    ShardManager.ShardManager.pipe(
      Effect.flatMap((manager) => manager.unregister(address))
    )
})

function simulate(events: ReadonlyArray<SimulationEvent>) {
  return Effect.forEach(events, handleEvent, { discard: true })
}
