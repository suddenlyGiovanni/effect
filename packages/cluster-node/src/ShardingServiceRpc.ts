/**
 * @since 1.0.0
 */
import * as Sharding from "@effect/cluster/Sharding"
import * as Rpc from "@effect/rpc/Rpc"
import * as RpcRouter from "@effect/rpc/RpcRouter"
import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"
import * as ShardingProtocol from "./ShardingProtocol.js"

/**
 * @since 1.0.0
 * @category rpc
 */
export const router = RpcRouter.make(
  Rpc.effect(ShardingProtocol.AssignShards, (request) =>
    pipe(
      Sharding.Tag,
      Effect.flatMap((sharding) => sharding.assign(request.shards))
    )),
  Rpc.effect(ShardingProtocol.UnassignShards, (request) =>
    pipe(
      Sharding.Tag,
      Effect.flatMap((sharding) => sharding.unassign(request.shards))
    )),
  Rpc.effect(ShardingProtocol.PingShard, () => Effect.succeed(true)),
  Rpc.effect(ShardingProtocol.Send, (request) =>
    pipe(
      Sharding.Tag,
      Effect.flatMap((sharding) => sharding.sendMessageToLocalEntityManagerWithoutRetries(request.envelope))
    ))
)

/**
 * @since 1.0.0
 * @category models
 */
export type ShardingServiceRpc = typeof router

/**
 * @since 1.0.0
 * @category models
 */
export type ShardingServiceRpcRequest = RpcRouter.RpcRouter.Request<typeof router>
