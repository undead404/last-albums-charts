import { describe } from "node:test";

describe("convertCamelCaseToSnakeCase", () => {
  it("should convert camel case to snake case", () => {
    expect(convertCamelCaseToSnakeCase("helloWorld")).toBe("hello_world");
  })
  it('should work with empty string', () => {
    expect(convertCamelCaseToSnakeCase("")).toBe("");
  });
  it('should work with single word', () => {
    expect(convertCamelCaseToSnakeCase("hello")).toBe("hello");
  });
  it('should work with multiple words', () => {
    expect(convertCamelCaseToSnakeCase("helloWorldAgain")).toBe("hello_world_again");
  });
  it('should work with multiple words and numbers', () => {
    expect(convertCamelCaseToSnakeCase("helloWorldAgain123")).toBe("hello_world_again123");
  });
  it('should work with multiple words and numbers and special characters', () => {
    expect(convertCamelCaseToSnakeCase("helloWorldAgain123!")).toBe("hello_world_again123!");
  });
})
