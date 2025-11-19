import {gemini, createAgent } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { inngest } from "./client";
import { getSandbox } from "./util";

export const helloWorld = inngest.createFunction(
  { id: "hello-world2" },
  { event: "test/hello.world" },
  
  async ({ event, step}) => {
    const sandboxId = await step.run("get-sandbox_id", async()=>{
      const sandbox = await Sandbox.create("vibe-nextjs-dinotest");
      return sandbox.sandboxId;
    })

    // Create a new agent with a system prompt (you can add optional tools, too)
    const codeAgent = createAgent({
      name: "code_agent",
      system: "You are an expert next.js developer. you write readable, maintainable code. You write simple Next.js & React snippets.",
      model: gemini({ model: "gemini-2.5-flash"}),
    });

    const { output } = await codeAgent.run(
    `Write the following snippet: ${event.data.value}`,
    ); 
    console.log(output);

    const sandboxUrl = await step.run("get-sandbox-url", async ()=>{
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000); 
      return `https://${host}`;
    })

    return { output , sandboxUrl};
  },
);