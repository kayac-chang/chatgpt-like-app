import clsx from "clsx";
import Svg from "~/components/svg";

function toggleTheme() {
  document.body.classList.toggle(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark"
  );
}

function Header() {
  return (
    <header
      className={clsx(
        "fixed top-0 w-full [&+*]:mt-32",
        "bg-transparent bg-gradient-to-b",
        "from-background via-background to-transparent",
        "pb-6",
        "pointer-events-none"
      )}
    >
      <div
        className={clsx(
          "mx-auto w-full max-w-screen-xl",
          "flex items-center justify-between",
          "py-8 px-8"
        )}
      >
        <span className="invisible" />

        {/* logo */}
        <h1 className="flex items-center gap-6">
          <span className="text-4xl font-extrabold">Ask FinReg by</span>
          <Svg className="w-72" src={require("~/assets/logo.svg")} />
        </h1>

        {/* dark mode */}
        <button
          type="button"
          data-theme="dark"
          className="pointer-events-auto"
          onClick={toggleTheme}
        >
          <span className="text-xl">Dark Mode</span>
          <Svg
            className="aspect-square w-8"
            src={require("~/assets/dark.svg")}
          />
        </button>

        {/* light mode */}
        <button
          type="button"
          data-theme="light"
          className="pointer-events-auto"
          onClick={toggleTheme}
        >
          <span className="text-xl">Light Mode</span>
          <Svg
            className="aspect-square w-8"
            src={require("~/assets/light.svg")}
          />
        </button>
      </div>
    </header>
  );
}

export default Header;
