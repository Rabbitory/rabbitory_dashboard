import Home from "./page";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

it("renders layout", () => {
  render(<Home />);
  expect(screen.getByText("Instances")).toBeInTheDocument();
});
