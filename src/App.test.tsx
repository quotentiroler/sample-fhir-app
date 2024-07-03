import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import fetch from "jest-fetch-mock";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

test("displays patients after successful fetch", async () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      entry: [
        { resource: { id: "1", name: [{ given: ["John"], family: "Doe" }] } },
        { resource: { id: "2", name: [{ given: ["Jane"], family: "Doe" }] } },
      ],
    })
  );

  render(<App />);

  expect(await screen.findByText("Patients")).toBeInTheDocument();
  expect(await screen.findByText("John Doe")).toBeInTheDocument();
  expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
});
