import { QueryClient } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// The phone menu is the only way to reach the sections on a narrow screen, so the
// toggle's own contract — expanded state, panel target, Escape to close — is what
// keeps the site usable there. The nav is rendered by the root route, so the app
// itself is mounted rather than the nav in isolation.
async function renderApp() {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("Site nav phone menu", () => {
  it("opens and closes the menu, and Escape closes it", async () => {
    await renderApp();

    const button = await screen.findByRole("button", { name: /menu/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "site-nav-menu");
    expect(document.getElementById("site-nav-menu")).not.toBeNull();

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
