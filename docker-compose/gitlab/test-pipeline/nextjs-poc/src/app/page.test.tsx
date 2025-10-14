import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Page component", () => {
    it("renders hello text", () => {
        render(<Page />);
        expect(screen.getByText("Hello Next.js 🚀")).toBeInTheDocument();
    });
});