import { ComponentProps, useState } from "react";
import clsx from "clsx";
import { assert } from "@sindresorhus/is";
import { useRef } from "react";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  const [key, rerender] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <div
      key={key}
      className={clsx(
        "grid",
        `after:content-[attr(data-replicated-value)]`,
        "after:whitespace-pre-wrap",
        "after:[grid-area:1/1/2/2]",
        "after:invisible",
        className
      )}
      onInputCapture={(event) => {
        assert.directInstanceOf(event.currentTarget, HTMLDivElement);
        assert.directInstanceOf(event.target, HTMLTextAreaElement);
        event.currentTarget.dataset.replicatedValue = event.target.value + " ";
      }}
      onKeyDownCapture={({ nativeEvent: event }) => {
        assert.directInstanceOf(event.target, HTMLTextAreaElement);

        if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
          event.preventDefault();
          buttonRef.current?.click();
          rerender(key + 1);
        }
      }}
    >
      <textarea
        className={clsx(
          "resize-none overflow-hidden",
          "[grid-area:1/1/2/2]",
          "bg-transparent text-current"
        )}
        rows={1}
        {...props}
      />

      <button hidden type="submit" ref={buttonRef} />
    </div>
  );
}
export default Textarea;
