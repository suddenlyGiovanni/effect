import { describe, it } from "@effect/vitest"
import { Either, Int, Number as _Number, Option, pipe } from "effect"
import {
  assertEquals,
  assertFalse,
  assertNone,
  assertRight,
  assertSome,
  assertTrue,
  notDeepStrictEqual,
  strictEqual,
  throws
} from "effect/test/util"

describe("Int", () => {
  it("of", () => {
    const float = 1.5
    const zero = 0

    strictEqual(Int.of(zero), zero)
    throws(() => Int.of(float))
    throws(() => Int.of(Number.NaN))
  })

  it("option", () => {
    assertSome(Int.option(0), Int.of(0))
    assertSome(Int.option(Int.empty), Int.empty)
    assertSome(Int.option(-1), Int.of(-1))

    assertNone(Int.option(-1.5))
    assertNone(Int.option(Number.NaN))
  })

  it("either", () => {
    // Valid integers return Right<Int>
    assertRight(Int.either(0), Int.of(0))
    assertRight(Int.either(Int.empty), Int.empty)
    assertRight(Int.either(-1), Int.of(-1))
    assertRight(
      Int.either(Number.MAX_SAFE_INTEGER),
      Int.of(Number.MAX_SAFE_INTEGER)
    )
    assertRight(
      Int.either(Number.MIN_SAFE_INTEGER),
      Int.of(Number.MIN_SAFE_INTEGER)
    )

    // Non-integers return Left<BrandErrors>
    assertTrue(Either.isLeft(Int.either(3.14)))
    assertTrue(Either.isLeft(Int.either(-2.5)))
    assertTrue(Either.isLeft(Int.either(Number.NaN)))
    assertTrue(Either.isLeft(Int.either(Number.POSITIVE_INFINITY)))
    assertTrue(Either.isLeft(Int.either(Number.NEGATIVE_INFINITY)))

    // Error messages detail the validation failure
    const Pi = 3.14
    const floatResult = Int.either(Pi)
    if (Either.isLeft(floatResult)) {
      pipe(
        Either.getLeft(floatResult),
        Option.match({
          onNone: () => assertFalse(true, "Should have error message"),
          onSome: ([{ message }]) => {
            strictEqual(message, `Expected ${Pi} to be an integer`)
          }
        })
      )
    }
  })

  it("empty", () => {
    strictEqual(Int.empty, 0)
  })

  it("isInt", () => {
    assertTrue(Int.isInt(1))
    assertFalse(Int.isInt(1.5))
    assertFalse(Int.isInt("a"))
    assertFalse(Int.isInt(true))
  })

  it("sum", () => {
    strictEqual(pipe(Int.of(100), Int.sum(Int.of(-50))), Int.of(50))
    strictEqual(Int.sum(Int.of(-50), Int.of(100)), Int.of(50))

    strictEqual(
      pipe(Int.of(100), Int.sum(Int.of(-50))),
      pipe(Int.of(-50), Int.sum(Int.of(100))),
      "addition under Int is `commutative`" // Doha !
    )

    strictEqual(
      pipe(Int.of(100), Int.sum(Int.of(-50)), Int.sum(Int.of(-50))),
      pipe(Int.of(-50), Int.sum(Int.of(100)), Int.sum(Int.of(-50))),
      "addition under Int is `associative`" // Doha !
    )

    strictEqual(
      pipe(Int.empty, Int.sum(Int.of(100))),
      Int.of(100),
      "'zeo' is the identity element for addition"
    ) // Doha !

    throws(
      // @ts-expect-error - can't pass a float
      () => Int.sum(Int.of(2), 1.5)
    )
  })

  it("subtract", () => {
    const three = Int.of(3)
    const two = Int.of(2)

    strictEqual(pipe(three, Int.subtract(Int.unit)), two)
    strictEqual(pipe(Int.unit, Int.subtract(three)), -2)

    strictEqual(Int.subtract(three, Int.unit), two)
    strictEqual(Int.subtract(Int.unit, three), -2)

    strictEqual(
      pipe(three, Int.subtract(two)),
      -pipe(two, Int.subtract(three)),
      "subtraction under Int is anticommutative" // Doha !
    )

    notDeepStrictEqual(
      pipe(three, Int.subtract(two), Int.subtract(Int.unit)),
      pipe(two, Int.subtract(three), Int.subtract(Int.unit)),
      "subtraction under Int is not associative" // Doha !
    )

    strictEqual(
      pipe(Int.empty, Int.subtract(three)),
      -three,
      "zero is the identity element under subtraction"
    )
  })

  it("multiply", () => {
    strictEqual(pipe(Int.of(2), Int.multiply(Int.of(3))), 6)
    strictEqual(Int.multiply(Int.of(2), Int.of(3)), 6)

    strictEqual(Int.multiply(Int.of(10), Int.of(-10)), -100)

    strictEqual(
      pipe(Int.of(2), Int.multiply(Int.of(3))),
      pipe(Int.of(3), Int.multiply(Int.of(2))),
      "multiplication under Int is commutative" // Doha !
    )

    strictEqual(
      pipe(Int.of(2), Int.multiply(Int.of(3)), Int.multiply(Int.of(4))),
      pipe(Int.of(2), Int.multiply(Int.of(4)), Int.multiply(Int.of(3))),
      "multiplication under Int is associative" // Doha !
    )

    strictEqual(
      Int.multiply(Int.of(2), Int.unit),
      Int.of(2),
      "`1` is the identity element under multiplication" /* Doha ! */
    )

    strictEqual(
      Int.multiply(Int.of(2), Int.empty),
      Int.empty,
      "multiplication by zero" /* Doha ! */
    )
  })

  it("divide", () => {
    assertSome(pipe(Int.of(6), Int.divide(Int.of(2))), 3)

    notDeepStrictEqual(
      pipe(Int.of(6), Int.divide(Int.of(2))),
      pipe(Int.of(2), Int.divide(Int.of(6))),
      "division under Int is not commutative" // Doha !
    )

    notDeepStrictEqual(
      pipe(
        Int.divide(Int.of(24), Int.of(6)), //
        Option.flatMap((n: number) => _Number.divide(n, Int.of(2)))
      ),
      pipe(
        Int.divide(Int.of(6), Int.of(2)),
        Option.flatMap(_Number.divide(Int.of(24)))
      ),
      "division under Int is not associative" // Doha !
    )

    assertNone(pipe(Int.of(6), Int.divide(Int.of(0))))
  })

  it("unsafeDivide", () => {
    const six = Int.of(6)
    const two = Int.of(2)

    strictEqual(pipe(six, Int.unsafeDivide(two)), Int.unsafeDivide(six, two))

    strictEqual(pipe(six, Int.unsafeDivide(two)), 3)
    strictEqual(pipe(six, Int.unsafeDivide(two)), 3)

    strictEqual(Int.unsafeDivide(Int.empty, six), 0)
    throws(
      () => Int.unsafeDivide(six, Int.empty),
      Int.IntegerDivisionError.divisionByZero(six)
    )
    throws(
      () => Int.unsafeDivide(Int.empty, Int.empty),
      Int.IntegerDivisionError.indeterminateForm()
    )
  })

  it("increment", () => {
    strictEqual(Int.increment(Int.of(1)), Int.of(2))

    strictEqual(Int.increment(Int.of(-99)), Int.of(-98))

    strictEqual(
      pipe(
        Int.of(1),
        Int.increment,
        Int.increment,
        Int.increment,
        Int.increment
      ),
      Int.of(5)
    )
  })

  it("decrement", () => {
    strictEqual(Int.decrement(Int.of(2)), Int.of(1))

    strictEqual(Int.decrement(Int.of(-100)), Int.of(-101))

    strictEqual(
      pipe(
        Int.of(100),
        Int.decrement,
        Int.decrement,
        Int.decrement,
        Int.decrement
      ),
      Int.of(96)
    )
  })

  it("Equivalence", () => {
    assertTrue(Int.Equivalence(Int.of(1), Int.of(1)))
    assertFalse(Int.Equivalence(Int.of(1), Int.of(2)))
  })

  it("Order", () => {
    strictEqual(Int.Order(Int.of(1), Int.of(2)), -1)

    strictEqual(Int.Order(Int.of(-1), Int.of(2)), -1)

    strictEqual(Int.Order(Int.of(-2), Int.of(-1)), -1)

    strictEqual(Int.Order(Int.of(2), Int.of(1)), 1)

    strictEqual(Int.Order(Int.of(2), Int.of(-1)), 1)

    strictEqual(Int.Order(Int.of(-1), Int.of(-2)), 1)

    strictEqual(Int.Order(Int.of(2), Int.of(2)), 0)

    strictEqual(Int.Order(Int.of(-2), Int.of(-2)), 0)
  })

  it("lessThan", () => {
    assertTrue(Int.lessThan(Int.of(2), Int.of(3)))

    assertFalse(
      pipe(
        Int.of(3), //
        Int.lessThan(Int.of(3))
      )
    )

    assertFalse(
      pipe(
        Int.of(4), //
        Int.lessThan(Int.of(3))
      )
    )
  })

  it("lessThanOrEqualTo", () => {
    const negativeTwo = Int.of(-2)
    const three = Int.of(3)
    const four = Int.of(4)

    const isNegativeTwoLessThenOrEqualToThree = Int.lessThanOrEqualTo(
      negativeTwo,
      three
    )

    assertTrue(isNegativeTwoLessThenOrEqualToThree)

    assertEquals(
      isNegativeTwoLessThenOrEqualToThree,
      pipe(
        negativeTwo, //
        Int.lessThanOrEqualTo(three)
      )
    )

    const isThreeLessThenOrEqualToThree = Int.lessThanOrEqualTo(three, three)

    assertTrue(isThreeLessThenOrEqualToThree)

    assertEquals(
      isThreeLessThenOrEqualToThree,
      pipe(
        three, //
        Int.lessThanOrEqualTo(three)
      )
    )

    const isFourLessThanOrEqualThree = Int.lessThanOrEqualTo(four, three)
    assertFalse(isFourLessThanOrEqualThree)

    assertEquals(
      isFourLessThanOrEqualThree,
      pipe(
        four, //
        Int.lessThanOrEqualTo(three)
      )
    )
  })

  it("greaterThan", () => {
    const negativeTwo = Int.of(-2)
    const three = Int.of(3)
    const four = Int.of(4)

    const isNegativeTwoGreaterThree = Int.greaterThan(negativeTwo, three)
    assertFalse(isNegativeTwoGreaterThree)
    assertEquals(
      isNegativeTwoGreaterThree,
      pipe(
        negativeTwo, //
        Int.greaterThan(three)
      )
    )

    assertFalse(Int.greaterThan(Int.empty, Int.empty))

    const isNegativeTwoGreaterThanNegativeTwo = Int.greaterThan(
      negativeTwo,
      negativeTwo
    )
    assertFalse(isNegativeTwoGreaterThanNegativeTwo)
    assertEquals(
      isNegativeTwoGreaterThanNegativeTwo,
      pipe(
        negativeTwo, //
        Int.greaterThan(negativeTwo)
      )
    )

    const isFourGreaterThanNegativeTwo = Int.greaterThan(four, negativeTwo)
    assertTrue(isFourGreaterThanNegativeTwo)
    assertEquals(
      isFourGreaterThanNegativeTwo,
      pipe(
        four, //
        Int.greaterThan(negativeTwo)
      )
    )
  })

  it.skip("greaterThanOrEqualTo", () => {
    const negativeTwo = Int.of(-2)
    const three = Int.of(3)
    const four = Int.of(4)

    assertFalse(Int.greaterThanOrEqualTo(negativeTwo, three))

    assertTrue(Int.greaterThanOrEqualTo(three, three))

    assertTrue(Int.greaterThanOrEqualTo(four, negativeTwo))
  })

  it.skip("between", () => {
    assertTrue(
      pipe(
        Int.of(3),
        Int.between({ minimum: Int.of(0), maximum: Int.of(5) })
      )
    )

    assertFalse(
      pipe(
        Int.of(-1),
        Int.between({ minimum: Int.of(0), maximum: Int.of(5) })
      )
    )

    assertFalse(
      pipe(
        Int.of(6),
        Int.between({ minimum: Int.of(0), maximum: Int.of(5) })
      )
    )

    assertTrue(
      Int.between(Int.of(3), { minimum: Int.of(0), maximum: Int.of(5) })
    )
  })

  it.skip("clamp", () => {
    strictEqual(
      pipe(
        Int.of(3), //
        Int.clamp({ minimum: Int.of(0), maximum: Int.of(5) })
      ),
      3
    )

    strictEqual(
      pipe(
        Int.of(-1), //
        Int.clamp({ minimum: Int.of(0), maximum: Int.of(5) })
      ),
      0
    )

    strictEqual(
      pipe(
        Int.of(6), //
        Int.clamp({ minimum: Int.of(0), maximum: Int.of(5) })
      ),
      5
    )
  })

  it.skip("min", () => {
    strictEqual(Int.min(Int.of(2), Int.of(3)), 2)
  })

  it.skip("max", () => {
    strictEqual(Int.max(Int.of(2), Int.of(3)), 3)
  })

  it.skip("sumAll", () => {
    strictEqual(Int.sumAll([Int.of(2), Int.of(3), Int.of(4)]), 9)
  })

  it.skip("multiplyAll", () => {
    strictEqual(Int.multiplyAll([Int.of(2), Int.empty, Int.of(4)]), 0)

    strictEqual(Int.multiplyAll([Int.of(2), Int.of(3), Int.of(4)]), 24)
  })

  it.skip("scratchpad", () => {})
})
