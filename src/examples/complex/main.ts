import { say } from "cowsay";
import { bgBlack, yellow } from "@std/fmt/colors";

const msg = prompt("Please provide the message:");

console.log(say({
  text: msg,
}));

console.log("\n\nHere is a poem for you:\n");

const poem = Deno.readTextFileSync("./poem.txt");
console.log(bgBlack(yellow(poem)));
