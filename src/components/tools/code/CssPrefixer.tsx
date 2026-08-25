"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";

// Simple vendor-prefix insertion using regex
function addPrefixes(css: string): string {
  const PROPS: Record<string,string[]> = {
    "transform":          ["-webkit-transform","-ms-transform"],
    "transition":         ["-webkit-transition"],
    "animation":          ["-webkit-animation"],
    "animation-name":     ["-webkit-animation-name"],
    "animation-duration": ["-webkit-animation-duration"],
    "flex":               ["-webkit-flex"],
    "display: flex":      ["display: -webkit-flex","display: -ms-flexbox"],
    "user-select":        ["-webkit-user-select","-moz-user-select","-ms-user-select"],
    "appearance":         ["-webkit-appearance","-moz-appearance"],
    "backface-visibility":["-webkit-backface-visibility"],
    "perspective":        ["-webkit-perspective"],
    "column-count":       ["-webkit-column-count","-moz-column-count"],
    "column-gap":         ["-webkit-column-gap","-moz-column-gap"],
  };
  let result = css;
  for (const [prop, prefixes] of Object.entries(PROPS)) {
    const re = new RegExp(`(\\s*)(${prop}\\s*:[^;]+;)`, "gi");
    result = result.replace(re, (_, ws, decl) => {
      const prefixed = prefixes.map(p => `${ws}${decl.replace(new RegExp(prop,"i"), p)}`).join("\n");
      return `\n${prefixed}\n${ws}${decl}`;
    });
  }
  return result.replace(/\n{3,}/g,"\n\n").trim();
}

export default function CssPrefixer() {
  return (
    <CodeEditorShell
      transform={addPrefixes}
      inputPlaceholder=".box { display: flex; transform: rotate(45deg); }"
      downloadFileName="prefixed.css"
      sideBySide
    />
  );
}
