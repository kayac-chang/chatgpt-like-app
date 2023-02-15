import type { action as CreateAction } from "~/routes/api.conversation";
import type { action as MessageAction } from "~/routes/api.conversation";
import type { ReactNode } from "react";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";
import Svg from "~/components/svg";
import Textarea from "~/components/textarea";
import { match, P } from "ts-pattern";
import { useCallback } from "react";
import Feedback from "~/components/feedback";
import Truncate from "~/components/truncate";
import * as Dialog from "@radix-ui/react-dialog";

type MessageProps = {
  id: string;
  userId: string;
  children?: ReactNode;
};
function Message(props: MessageProps) {
  return (
    <div
      className={clsx(
        "flex items-start gap-8",
        "py-4",
        props.userId === "gpt" && "flex-row-reverse"
      )}
    >
      {/* avatar */}
      <div className="aspect-square w-8">
        {match(props.userId)
          .with("gpt", () => (
            <Svg
              className="text-primary-light"
              src={require("~/assets/avatar-chatgpt.svg")}
            />
          ))
          .with(P.string, () => (
            <Svg
              className="text-primary-dark"
              src={require("~/assets/avatar-user.svg")}
            />
          ))
          .exhaustive()}
      </div>

      {/* message */}
      <div className="w-full max-w-4xl space-y-6 leading-8">
        {props.children}
      </div>
    </div>
  );
}

type Action = typeof CreateAction | typeof MessageAction;

export default function Index() {
  const { Form, data, load } = useFetcher<Action>();

  const ref = useCallback(
    (el: HTMLDivElement | null) =>
      data && el && load(`/api/conversation/${data.id}`),
    [load, data]
  );

  return (
    <Form
      action={match(data)
        .with({ id: P.select() }, (id) => `/api/conversation/${id}`)
        .otherwise(() => `/api/conversation`)}
      method="post"
      className="flex flex-col"
    >
      {/* conversation */}
      <div className="mx-auto w-full max-w-screen-lg space-y-4 pb-64">
        {data?.messages.map((message) =>
          match(message)
            // loading
            .with({ userId: "gpt", isLoading: true }, (_, props) => (
              <Message key={props.id} {...props}>
                <span ref={ref} className="typewriter" />
              </Message>
            ))
            // answer with cases
            .with(
              {
                userId: "gpt",
                cases: P.array({
                  id: P.string,
                  title: P.string,
                  url: P.string,
                  snippet: P.string,
                }),
              },
              (_, props) => (
                <Message key={props.id} {...props}>
                  <p>Here are 3 cases that best match your description.</p>

                  <ul className="space-y-6">
                    {props.cases.map((item) => (
                      <li key={item.id}>
                        <div className="space-y-2">
                          {/* link */}
                          <a
                            href={item.url}
                            className="inline-flex items-center gap-2"
                          >
                            <span className="underline">{item.title}</span>

                            <Svg
                              className="w-4"
                              src={require("~/assets/enlarge.svg")}
                            />
                          </a>

                          {/* snippet */}
                          <div className="min-h-[8rem] space-y-4 rounded border-2 p-4">
                            <p>
                              <Truncate limit={100}>{item.snippet}</Truncate>
                            </p>

                            <div className="flex justify-end gap-6">
                              <Feedback />
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <button
                        type="button"
                        className={clsx(
                          "rounded px-4 py-2 font-semibold",
                          "bg-primary-dark text-text-invert"
                        )}
                      >
                        Connect me to a professional
                      </button>
                    </Dialog.Trigger>

                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-background/90" />
                      <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-screen max-w-screen-sm">
                          <h2 className="text-center text-2xl">
                            We’ll be sending your chat thread and enquiry to our
                            partnered professionals who are best suited to serve
                            you.
                          </h2>

                          <div className="mt-8 space-y-6">
                            <div className="space-y-2">
                              <label htmlFor="name">Name</label>
                              <div className="rounded-md border-4 border-current py-3 px-4">
                                <input id="name" name="name" type="text" />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label htmlFor="email">Email</label>
                              <div className="rounded-md border-4 border-current py-3 px-4">
                                <input id="email" name="email" type="email" />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label htmlFor="description">
                                Short description of your enquiry
                              </label>
                              <div className="rounded-md border-4 border-current py-3 px-4">
                                <textarea
                                  className="h-24 resize-none"
                                  id="description"
                                  name="description"
                                />
                              </div>
                            </div>

                            <div className="flex justify-center">
                              <button
                                type="submit"
                                className="rounded-md bg-primary-dark px-4 py-2 text-background"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                </Message>
              )
            )
            // answer
            .with({ userId: "gpt" }, (_, props) => (
              <Message key={props.id} {...props}>
                <div className="prose">
                  <blockquote>
                    <Truncate limit={500}>{props.message}</Truncate>
                  </blockquote>
                </div>

                <div className="flex gap-6">
                  <Feedback />
                </div>

                <div>
                  <button
                    type="button"
                    className={clsx(
                      "rounded px-4 py-2 font-semibold",
                      "bg-primary-dark text-text-invert"
                    )}
                  >
                    Connect me to a professional
                  </button>
                </div>
              </Message>
            ))
            // question
            .otherwise((props) => (
              <Message key={props.id} {...props}>
                <div className="prose">
                  <p>{props.message}</p>
                </div>
              </Message>
            ))
        )}
      </div>

      {/* bottom control */}
      <div
        className={clsx(
          "fixed left-0 bottom-0",
          "w-full pt-20",
          "flex flex-col",
          "bg-transparent bg-gradient-to-t",
          "from-background via-background to-transparent",
          "pointer-events-none"
        )}
      >
        <div
          className={clsx(
            "mt-auto space-y-2",
            "mx-auto w-full max-w-screen-lg",
            "p-4"
          )}
        >
          {/* user input */}
          <div
            className={clsx(
              "rounded-md",
              "py-3 px-4",
              "flex items-start gap-2",
              "pointer-events-auto",
              "border-4 border-current",
              "bg-background"
            )}
          >
            <label htmlFor="message" className="sr-only">
              user input
            </label>
            <Textarea
              id="message"
              name="message"
              className="h-full max-h-80 w-full overflow-auto"
              required
            />

            <button type="submit" className="h-6 w-6 p-1" aria-label="send">
              <Svg
                className="h-full w-full rotate-90"
                src={require("~/assets/send.svg")}
              />
            </button>
          </div>

          <small className="block text-center">
            GPT prototype preview: the information provided in this prototype
            does not, and is not intended to, convey or constitute legal advice.
          </small>
        </div>
      </div>
    </Form>
  );
}
