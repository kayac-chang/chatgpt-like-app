import { useState } from "react";

type TruncateProps = {
  limit: number;
  children: string;
};
function Truncate(props: TruncateProps) {
  const [show, setState] = useState(false);

  const toggle = () => setState(!show);

  return (
    <>
      {props.children.slice(0, !show ? props.limit : undefined)}

      {!show && props.children.length > props.limit && (
        <>
          <span>..... </span>
          <button type="button" className="inline underline" onClick={toggle}>
            show more
          </button>
        </>
      )}
    </>
  );
}
export default Truncate;
