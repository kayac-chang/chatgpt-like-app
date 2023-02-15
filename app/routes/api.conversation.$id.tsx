import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import z from "zod";
import { decodeForm } from "~/utils/form.server";
import { getUserSession, logout } from "~/session.server";
import { redirect } from "react-router";
import { created } from "remix-utils";
import db from "~/db.server";
import invariant from "tiny-invariant";
import { faker } from "@faker-js/faker";
import { delay } from "~/utils/common";
import { times } from "ramda";

export async function loader(props: LoaderArgs) {
  const params = await schema.params.parseAsync(props.params);

  await delay(1_000);

  const createCase = times(() => ({
    id: faker.datatype.uuid(),
    title: faker.lorem.lines(1),
    url: faker.internet.url(),
    snippet: faker.lorem.paragraph(),
  }));

  const [, conversation] = await db.$transaction([
    db.message.create({
      data: {
        userId: "gpt",
        conversationId: params.id,
        message: faker.lorem.paragraphs(),
        cases: {
          create: createCase(3),
        },
      },
    }),
    db.conversation.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        messages: {
          select: {
            id: true,
            userId: true,
            user: true,
            message: true,
            cases: true,
          },
        },
      },
    }),
  ]);

  return json(conversation);
}

const schema = {
  params: z.object({
    id: z.string(),
  }),

  body: z.object({
    message: z.string().min(1),
  }),
};
export async function action(props: ActionArgs) {
  const userId = await getUserSession(props.request);
  if (!userId) {
    throw redirect("/", {
      headers: {
        "Set-Cookie": await logout(props.request),
      },
    });
  }

  const params = await schema.params.parseAsync(props.params);
  const conversationId = params.id;

  const body = await schema.body.parseAsync(await decodeForm(props.request));
  const message = body.message;

  const [, conversation] = await db.$transaction([
    db.message.create({ data: { conversationId, userId, message } }),
    db.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, messages: true },
    }),
  ]);

  invariant(conversation, "conversation should not be empty");

  const messages = [
    ...conversation.messages,
    {
      id: faker.datatype.uuid(),
      userId: "gpt",
      isLoading: true,
    } as const,
  ];

  return created({ ...conversation, messages });
}
