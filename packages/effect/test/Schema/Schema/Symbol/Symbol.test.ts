import * as S from "effect/Schema"
import * as Util from "effect/test/Schema/TestUtils"
import { describe, it } from "vitest"

describe("Symbol", () => {
  const schema = S.Symbol

  it("property tests", () => {
    Util.roundtrip(schema)
  })

  it("decoding", async () => {
    await Util.expectDecodeUnknownSuccess(schema, "a", Symbol.for("a"))
    await Util.expectDecodeUnknownFailure(
      schema,
      null,
      `Symbol
└─ Encoded side transformation failure
   └─ Expected string, actual null`
    )
  })

  it("encoding", async () => {
    await Util.expectEncodeSuccess(schema, Symbol.for("a"), "a")
    await Util.expectEncodeFailure(
      schema,
      Symbol(),
      `Symbol
└─ Transformation process failure
   └─ Unable to encode a unique symbol Symbol() into a string`
    )
  })
})
