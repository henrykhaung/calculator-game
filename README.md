# Calculators

- implementation of calculator with keyboard support
- a receipt calculator to determine how much you owe

## Motivation

### Calculator

- Made to practice my HTML/CSS/JS skills and what I have learned so far.
- Used iPhone calculator to design the appearance. Was able to practice grid and flexbox this way.
- In order to make it a bit harder, I decided to not use `eval` function and came up with the logic myself using an array and switch statements. The code should be refactored later since it is a bit more messier than I would like it to be.
- Has two modes: one is a visual mode where you can click buttons to do operations and the other is where you type in an expression
- For the first mode, I did not use `eval` but for the latter, I used it. However, I was able to learn about the Shunting Yard algorithm since I was not able to efficiently evaluate expressions using just a stack.

### Receipt Calculator

- I love going out to go eat with my friends. Since we always have one of us front the check, we always have to do some math and pay back the correct amount. Sometimes, the math is a little annoying since not all of us get the same dish/food. This is where this calculator comes in.
- With this calculator, I learned how to manipulate the DOM, how to use event listeners, and how to use form inputs.
- DOM manipulation was handy when I wanted to grab an element and change its style and content. This was useful when validating user input of a number ie the subtotal from the receipt.
- Event listeners were mostly used on the input element so that I can grab the value of what the user inputted as well as validate the input.