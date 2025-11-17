import {gemini, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world2" },
  { event: "test/hello.world" },
  async ({ event}) => {
    // Create a new agent with a system prompt (you can add optional tools, too)
    const summarizer = createAgent({
      name: "code_agent",
      system: "You are an expert next.js developer. you write readable, maintainable code. You write simple Next.js & React snippets.",
      model: gemini({ model: "gemini-2.5-flash"}),
    });

    const { output } = await summarizer.run(
    `Write the following snippet: ${event.data.value}`,
    );
    console.log(output);


    return { output};
  },
);