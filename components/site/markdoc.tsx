import React from "react";
import Markdoc from "@markdoc/markdoc";

/** Renders staff-written Markdoc (advisory and news bodies). */
export function MarkdocContent({ source }: { source: string }) {
  const tree = Markdoc.transform(Markdoc.parse(source));
  return <div className="prose">{Markdoc.renderers.react(tree, React)}</div>;
}
