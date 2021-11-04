# Getting Started with Create React App

## Future features
* Exporting and importing project
* Drag from edge to create constraint, maybe a circle?
* Export to REACT
* Collision detection på elements i canvas i tillegg til kanter
* Visualize constraint flow in HTML run mode
* Legge til variable references i hotdrink to json?
* Hide/show constraints
* Endre react render plugin til å virke med hooks?

## Meeting notes

### Nov.2
Labels to compoents in visual view, Input Textfield1, Output Textfield2

Button med "binary" operation som kan generere dsl for en spesifikk operasjon (inp "+") out dsl

Han skal hjelpe å lage DSL generator, så jeg lager først et API som kan generere Rete komponenter på en slags måte.

### Number operators: 
+, -, *, /, %, <, >, <=, >=, ==, !=, isPos, isNeg, isZero, isOdd, isEven, max, min, abs, round, ceil, floor
### String operators: 
length, contains, startsWith, endsWith, indexOf, lastIndexOf, substring, toLowerCase, toUpperCase, trim, replace, split, join
### Date operators: 
isBefore, isBetween, isAfter, isSameDay, isSameMonth, isSameYear, isSameHour, isSameMinute, isSameSecond, isSameMillisecond
### Boolean operators: 
and, or, not, isTrue, isFalse