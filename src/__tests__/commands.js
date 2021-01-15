const Executor = require("../classes/Executor");
const executor = new Executor();
const { LINE_FEED } = require("../config/constants");
const { STORED, EXISTS, NOT_STORED, NOT_FOUND, END } = require("../config/serverMessages");

describe("Testing storage commands", () => {
  test("Set command stores data with exptime = 0", () => {
    const setCommand = "set a 1 0 3";
    const value = "foo";
    const command = setCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(STORED);
  });
  test("Set command stores data with negative exptime", () => {
    const setCommand = "set b 1 -1 3";
    const value = "bar";
    const command = setCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(STORED);
  });
  test("Set command stores data with positive exptime", () => {
    const setCommand = "set c 1 1 6";
    const value = "foobar";
    const command = setCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(STORED);
  });
  test("Set command doesn´t store data", () => {
    const setCommand = "set a 1 1 3";
    const value = "baz";
    const command = setCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(EXISTS);
  });
  test("Add command stores data", () => {
    const addCommand = "add d 1 0 3";
    const value = "qux";
    const command = addCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(STORED);
  });
  test("Add command doesn´t store data", () => {
    const addCommand = "add d 1 0 4";
    const value = "quux";
    const command = addCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(NOT_STORED);
  });
  test("Replace command stores data", () => {
    const replaceCommand = "replace d 1 0 4";
    const value = "quuz";
    const command = replaceCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(STORED);
  });
  test("Replace command doesn´t store data", () => {
    const replaceCommand = "replace e 1 0 5";
    const value = "corge";
    const command = replaceCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(NOT_STORED);
  });
  test("Cas command store data", () => {
    const casCommand = "cas a 1 0 6 1";
    const value = "grault";
    const command = casCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(STORED);
  });
  test("Cas command with existing data", () => {
    const casCommand = "cas a 1 0 6 2";
    const value = "garply";
    const command = casCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(EXISTS);
  });
  test("Cas command without existing data", () => {
    const casCommand = "cas b 1 0 5 2";
    const value = "waldo";
    const command = casCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(NOT_FOUND);
  });
  test("Append command update existing data", () => {
    const appendCommand = "append a 1 0 4";
    const value = "fred";
    const command = appendCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(STORED);
  });
  test("Append command without existing data", () => {
    const appendCommand = "append b 1 0 5";
    const value = "plugh";
    const command = appendCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(NOT_STORED);
  });
  test("Prepend command update existing data", () => {
    const appendCommand = "prepend a 1 0 5";
    const value = "xyzzy";
    const command = appendCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(STORED);
  });
  test("Prepend command without existing data", () => {
    const prependCommand = "prepend b 1 0 4";
    const value = "thud";
    const command = prependCommand.split(" ");
    const result = executor.execute(command, value);
    expect(result).toBe(NOT_STORED);
  });
  test("Get command with one parameter", () => {
    const prependCommand = "get a";
    const command = prependCommand.split(" ");
    const result = executor.execute(command);
    expect(result).toBe(`VALUE a 1 15${LINE_FEED}xyzzygraultfred${LINE_FEED}${END}`);
  });
  test("Get command with 2 or more parameters that may exist or not", () => {
    const prependCommand = "get a b d";
    const command = prependCommand.split(" ");
    const result = executor.execute(command);
    expect(result).toBe(`VALUE a 1 15${LINE_FEED}xyzzygraultfred${LINE_FEED}VALUE d 1 4${LINE_FEED}quuz${LINE_FEED}${END}`);
  });
  test("Get command with a parameter that does not exist", () => {
    const prependCommand = "get b";
    const command = prependCommand.split(" ");
    const result = executor.execute(command);
    expect(result).toBe(`${END}`);
  });
  test("Gets command with one parameter", () => {
    const prependCommand = "gets a";
    const command = prependCommand.split(" ");
    const result = executor.execute(command);
    expect(result).toBe(`VALUE a 1 15 7${LINE_FEED}xyzzygraultfred${LINE_FEED}${END}`);
  });
  test("Gets command with 2 or more parameters that may exist or not", () => {
    const prependCommand = "gets a b d";
    const command = prependCommand.split(" ");
    const result = executor.execute(command);
    expect(result).toBe(`VALUE a 1 15 7${LINE_FEED}xyzzygraultfred${LINE_FEED}VALUE d 1 4 4${LINE_FEED}quuz${LINE_FEED}${END}`);
  });
});

