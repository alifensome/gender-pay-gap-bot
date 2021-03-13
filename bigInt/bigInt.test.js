import BigInt from "./bigInt"

test('it should remove one when last number is not zero', () => {
    const b = new BigInt("123")
    b.minusOne()
    const result = b.toString()
    expect(result).toBe("122")
});


test('it should remove one when last number is zero', () => {
    const b = new BigInt("100")
    b.minusOne()
    const result = b.toString()
    expect(result).toBe("99")
});

test('it should return 0 from 1', () => {
    const b = new BigInt("1")
    b.minusOne()
    const result = b.toString()
    expect(result).toBe("0")
});