const Executor = require("../classes/Executor");
const executor = new Executor();

const { STORED } = require("../config/serverMessages");

describe("Testing storage commands", () => {
  test("Set command stores data with exptime = 0", () => {
    const SetCommand = "set a 1 0 3";
    const value = "foo";
    const command = SetCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(STORED);
  });
  test("Set command stores data with negative exptime", () => {
    const SetCommand = "set b 1 -1 3";
    const value = "foo";
    const command = SetCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(STORED);
  });
  test("Set command stores data with positive exptime", () => {
    const SetCommand = "set c 1 1 3";
    const value = "foo";
    const command = SetCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(STORED);
  });
});

// function sum(a, b) {
//     return a + b;
//   }
//   test('adds 1 + 2 to equal 3', () => {
//     expect(sum(1, 2)).toBe(3);
//   });
