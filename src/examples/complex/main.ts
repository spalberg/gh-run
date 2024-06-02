import { say } from "cowsay";
import { bgBlack, yellow } from "@std/fmt/colors";
import { dirname, normalize } from "@std/url";

const msg = prompt("Please provide the message:");

console.log(say({
  text: msg,
}));

console.log("\n\nHere is a poem for you:\n");
const poem = await fetch(normalize(dirname(import.meta.url) + "/poem.txt"))
  .then((res) => res.text());
console.log(bgBlack(yellow(poem)));
