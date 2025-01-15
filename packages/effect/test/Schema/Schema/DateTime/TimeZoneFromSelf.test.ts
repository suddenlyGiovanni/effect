import * as S from "effect/Schema"
import * as Util from "effect/test/Schema/TestUtils"
import { describe, it } from "vitest"

describe("TimeZoneFromSelf", () => {
  const schema = S.TimeZoneFromSelf

  it("property tests", () => {
    Util.roundtrip(schema)
  })
})