import Rete from "rete";

export const boolSocket = new Rete.Socket("Boolean value");
export const numSocket = new Rete.Socket("Number value");
export const stringSocket = new Rete.Socket("String value");
export const anySocket = new Rete.Socket("Any value");
boolSocket.combineWith(anySocket);
numSocket.combineWith(anySocket);
stringSocket.combineWith(anySocket);
