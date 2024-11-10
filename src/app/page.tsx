"use client";

import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery, useMutation} from "convex/react";
import {api} from "../../convex/_generated/api";
import {SignInButton} from "@clerk/nextjs";

export default function Home(){
  // const [messages, setMessages] = useState<Message[]>([
  //   { sender: "Alice", content: "Hello, world" },
  //   { sender: "Bob", content: "hi, Alice" },
  // ]);
  const messages = useQuery(api.functions.message.list);
  const createMessage = useMutation(api.functions.message.create)
  const [input, setInput] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createMessage({ sender: "Alice", content: input });
    setInput("");
  }

  return (
    <>
    <Authenticated>
    <div>
      {messages?.map((message, index) => (
        <div key={index}>
          <strong>{message.sender}</strong>: {message.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" id="message" value={input}  
          onChange={(e) => setInput(e.target.value)}/>
        <button type="submit">Send</button>
      </form>
      
    </div>
    </Authenticated>
    <Unauthenticated>
      <SignInButton />
    </Unauthenticated>    
    <time suppressHydrationWarning />
    </>
  );
}
