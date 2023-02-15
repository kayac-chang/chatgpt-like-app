import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import z from "zod";
import { decodeForm } from "~/utils/form.server";
import { createUserSession } from "~/session.server";
import db from "~/db.server";
import { faker } from "@faker-js/faker";

const schema = z.object({
  message: z.string().min(1),
});
export async function action(props: ActionArgs) {
  const res = await schema.parseAsync(await decodeForm(props.request));

  const message = res.message;

  // create new user
  const user = await db.user.create({ data: {} });

  // create new conversation
  const conversation = await db.conversation.create({
    data: {
      userId: user.id,
      messages: {
        create: [
          {
            userId: user.id,
            message,
          },
        ],
      },
    },
    select: { id: true, messages: true },
  });

  const messages = [
    ...conversation.messages,
    {
      id: faker.datatype.uuid(),
      userId: "gpt",
      isLoading: true,
    } as const,
  ];

  return json(
    { ...conversation, messages },
    {
      headers: {
        "Set-Cookie": await createUserSession(props.request, user.id),
      },
    }
  );
}
