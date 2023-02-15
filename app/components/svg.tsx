import type { ComponentProps } from "react";
import { memoizeWith } from "ramda";
import { assert } from "@sindresorhus/is";

const memoFetch = memoizeWith(String, (src: string) =>
  fetch(src).then((res) => res.text())
);

type Props = ComponentProps<"div"> & {
  src: string;
};
function Svg(props: Props) {
  const ref = (el: HTMLDivElement | null) =>
    memoFetch(props.src).then((source) => {
      if (!el) return;

      const parser = new DOMParser();
      const dom = parser.parseFromString(source, "text/html");

      assert.directInstanceOf(dom.body.firstChild, SVGSVGElement);

      props.className &&
        dom.body.firstChild.classList.add(...props.className.split(" "));
      el.replaceWith(dom.body.firstChild);
    });

  return <div className={props.className} ref={ref} />;
}
export default Svg;
