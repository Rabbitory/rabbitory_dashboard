import {
  uniqueNamesGenerator,
  animals,
  colors,
  adjectives,
} from "unique-names-generator";

export default function generateName() {
  return uniqueNamesGenerator({
    dictionaries: [colors, adjectives, animals],
    length: 3,
    separator: "-",
    style: "lowerCase",
  });
}
