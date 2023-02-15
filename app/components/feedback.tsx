import type { LottieRefCurrentProps } from "lottie-react";
import { useRef } from "react";
import { useState } from "react";
import clsx from "clsx";
import Svg from "~/components/svg";
import Lottie from "lottie-react";

type Props = {
  value?: boolean;
  onClick?: () => void;
};
function Like(props: Props) {
  const ref = useRef<LottieRefCurrentProps>(null);
  function onClick() {
    !props.value ? ref.current?.play() : ref.current?.goToAndStop(0);
    props.onClick?.();
  }
  return (
    <button
      className={clsx(
        "relative flex items-center justify-center",
        props.value && "text-green-500 transition-colors delay-100"
      )}
      type="button"
      onClick={onClick}
    >
      <Lottie
        className="absolute w-20"
        autoplay={false}
        loop={false}
        lottieRef={ref}
        initialSegment={[24, 100]}
        animationData={require("~/assets/like.json")}
      />
      <Svg src={require("~/assets/like.svg")} className="relative w-6" />
    </button>
  );
}

function Dislike(props: Props) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={clsx(props.value && "text-red-500")}
    >
      <Svg className="w-6" src={require("~/assets/dislike.svg")} />
    </button>
  );
}

function Feedback() {
  const [like, setLike] = useState<"like" | "dislike" | undefined>();

  function set(value: "like" | "dislike") {
    return () => (like === value ? setLike(undefined) : setLike(value));
  }

  return (
    <>
      <span>Is this helpful?</span>
      <Like value={like === "like"} onClick={set("like")} />
      <Dislike value={like === "dislike"} onClick={set("dislike")} />
    </>
  );
}

export default Feedback;
