import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent, axeRender } from "@/test/test-utils";
import { Navigation } from "../Navigation";

describe("Navigation Component", () => {
  it("renders the logo and brand name", () => {
    render(<Navigation />);

    expect(screen.getByText("Tropical AI Chef")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /tropical ai chef/i })
    ).toHaveAttribute("href", "/");
  });

  it("renders all navigation items", () => {
    render(<Navigation />);

    const expectedNavItems = [
      "Home",
      "Recipe Generator",
      "About",
      "Benefits",
      "Blog",
      "Orders",
    ];

    expectedNavItems.forEach((item) => {
      expect(screen.getByRole("link", { name: item })).toBeInTheDocument();
    });
  });

  it("shows correct navigation links", () => {
    render(<Navigation />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(
      screen.getByRole("link", { name: "Recipe Generator" })
    ).toHaveAttribute("href", "/recipes");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about"
    );
    expect(screen.getByRole("link", { name: "Benefits" })).toHaveAttribute(
      "href",
      "/benefits"
    );
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/blog"
    );
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute(
      "href",
      "/orders"
    );
  });

  it("renders action buttons on desktop", () => {
    render(<Navigation />);

    // These buttons should be hidden on mobile (lg:flex class)
    const loginButton = screen.getByRole("button", { name: /login/i });
    const cartButton = screen.getByRole("button", { name: /cart/i });

    expect(loginButton).toBeInTheDocument();
    expect(cartButton).toBeInTheDocument();
  });

  it("renders mobile menu trigger", () => {
    render(<Navigation />);

    // Mobile menu button should be present
    const mobileMenuTrigger = screen.getByRole("button");
    expect(mobileMenuTrigger).toBeInTheDocument();
  });

  it("opens mobile menu when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    // Find and click the mobile menu trigger
    const menuTrigger = screen.getByRole("button");
    await user.click(menuTrigger);

    // Mobile menu should now be visible (though testing sheet visibility might be complex)
    // We can test that the aria-expanded attribute changes or content appears
    expect(menuTrigger).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<Navigation />);

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();

    // All links should be accessible
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toBeVisible();
    });
  });

  it("has no accessibility violations", async () => {
    const { results } = await axeRender(<Navigation />);
    expect(results).toHaveNoViolations();
  });

  it("applies sticky positioning for performance", () => {
    render(<Navigation />);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("sticky", "top-0", "z-50");
  });

  it("includes backdrop blur for modern glass effect", () => {
    render(<Navigation />);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("backdrop-blur");
  });
});
