import { say } from "cowsay";
import { bgBlack, yellow } from "@std/fmt/colors";
import poem from "./poem.json" with { type: 'json' };

const msg = prompt("Please provide the message:");

console.log(say({
  text: msg,
}));

console.log("\n\nHere is a poem for you:\n");
console.log(bgBlack(yellow(poem.verses.join("\n"))));
