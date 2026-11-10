import { describe, expect, it } from "vitest";
import fil from "@/messages/fil.json";
import en from "@/messages/en.json";

type Tree = { [key: string]: string | Tree };

function keys(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === "string" ? [`${prefix}${k}`] : keys(v, `${prefix}${k}.`),
  );
}

function placeholders(s: string) {
  return [...s.matchAll(/\{(\w+)/g)].map((m) => m[1]).sort();
}

function get(tree: Tree, path: string): string {
  return path
    .split(".")
    .reduce<string | Tree>((t, k) => (t as Tree)[k], tree) as string;
}

describe("UI messages", () => {
  it("has the same keys in Filipino and English", () => {
    expect(keys(en).sort()).toEqual(keys(fil).sort());
  });

  it("has no empty strings", () => {
    for (const tree of [fil, en]) {
      for (const key of keys(tree)) {
        expect(get(tree, key).trim(), key).not.toBe("");
      }
    }
  });

  it("uses the same {placeholders} in both languages", () => {
    for (const key of keys(fil)) {
      expect(placeholders(get(en, key)), key).toEqual(
        placeholders(get(fil, key)),
      );
    }
  });
});
