import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, afterAll, beforeAll, vi } from "vitest";
import React from "react";
import { server } from "./mocks/server";

// ─── Polyfill ResizeObserver (required by Radix UI) ─────────────
// jsdom does not implement ResizeObserver. Radix UI primitives
// (used by shadcn/ui Checkbox, Input, etc.) require it.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof globalThis.ResizeObserver;
}

// ─── Polyfill IntersectionObserver (required by framer-motion) ───
// jsdom does not implement IntersectionObserver. framer-motion's
// whileInView prop relies on it for viewport-enter animations.
if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = "0px";
    readonly thresholds: ReadonlyArray<number> = [0];
    constructor(
      private callback: IntersectionObserverCallback,
      _options?: IntersectionObserverInit,
    ) {}
    observe(target: Element) {
      // Immediately report the target as fully intersecting so that
      // whileInView animations fire during tests.
      const entry: IntersectionObserverEntry = {
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRatio: 1,
        intersectionRect: target.getBoundingClientRect(),
        isIntersecting: true,
        rootBounds: null,
        target,
        time: Date.now(),
      };
      this.callback([entry], this as unknown as IntersectionObserver);
    }
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof globalThis.IntersectionObserver;
}

// ─── Mock next/image ────────────────────────────────────────────
// Next.js Image requires width/height for static imports which fails
// in test environments. Replace with a simple <img> element.
vi.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage(props: Record<string, unknown>) {
    const {
      fill,
      priority,
      quality,
      placeholder,
      blurDataURL,
      loader,
      sizes,
      ...imgProps
    } = props;

    // Handle static imports (objects with src property)
    if (typeof imgProps.src === "object" && imgProps.src !== null) {
      imgProps.src = (imgProps.src as { src: string }).src ?? "/mock-image.png";
    }

    return React.createElement("img", imgProps);
  },
}));

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

// Reset handlers after each test (important for test isolation)
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => server.close());
