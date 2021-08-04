import { renderHook } from "@testing-library/react-hooks";
import { useDefaultTranslations } from "./translations-hook";

const globalAny: any = global;
describe("translation hook", () => {
  beforeAll(() => {
    jest.spyOn(globalAny, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            welcome: "Hello World",
          }),
      }),
    );
  });
  afterEach(() => {
    globalAny.fetch.mockClear();
  });

  afterAll(() => {
    globalAny.fetch.mockRestore();
  });

  it("should make the api call to fetch the default value and set it in the state", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useDefaultTranslations());
    await waitForNextUpdate();
    expect(fetch).toHaveBeenCalled();
    expect(result?.current?.welcome).toEqual("Hello World");
  });

  //TODO use https://www.npmjs.com/package/jest-fetch-mock to mock fetch
});
