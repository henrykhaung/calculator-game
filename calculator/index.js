let mode = 0;

function switchModes() {
    switch (mode) {
        case mode === 0:
            break;
        case mode === 1:
            break;
        case mode === 2:
            break;
        default:
            mode = 0;
    }
}

function evalExpression(expression) {
    function isDigit(char) {
        return char >= "0" && char <= "9";
    }

    function isOperator(char) {
        return char === "+" || char === "-" || char === "*" || char === "/";
    }

    function hasMatchingParentheses(expression) {
        let balance = 0;
        for (let char of expression) {
            if (char === "(") balance++;
            if (char === ")") balance--;
            if (balance < 0) return false;
        }
        return balance === 0;
    }

    function shuntingYard(expression) {
        let outputQueue = [];
        let operatorStack = [];
        const operators = {
            "+": { precedence: 1 },
            "-": { precedence: 1 },
            "*": { precedence: 2 },
            "/": { precedence: 2 },
        };

        let i = 0;
        while (i < expression.length) {
            let char = expression[i];
            if (char === " ") {
                i++;
                continue;
            }

            if (isDigit(char)) {
                // if number, make sure you grab the whole number ie 3.14
                let num = "";
                while (i < expression.length && (isDigit(expression[i]) || expression[i] === ".")) {
                    num += expression[i];
                    i++;
                }
                outputQueue.push(num);
                continue;
            }

            if (isOperator(char)) {
                while (
                    operatorStack.length &&
                    isOperator(operatorStack[operatorStack.length - 1]) &&
                    operators[char].precedence <= operators[operatorStack[operatorStack.length - 1]].precedence
                ) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(char);
            } else if (char === "(") {
                operatorStack.push(char);
            } else if (char === ")") {
                while (operatorStack.length && operatorStack[operatorStack.length - 1] !== "(") {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop();
            } else {
                throw new Error(`Invalid token: ${char}`);
            }
            i++;
        }

        while (operatorStack.length) {
            const op = operatorStack.pop();
            if (op === "(" || op === ")") {
                throw new Error("Mismatched parentheses");
            }
            outputQueue.push(op);
        }

        return outputQueue.join(" ");
    }

    if (!expression) {
        return;
    }
    expression = expression.trim(); // trim white spaces
    if (!hasMatchingParentheses) {
        return;
    }

    // convert infix expression to postfix expression using Shunting Yard algorithm
    let postfixexp = shuntingYard(expression);
    postfixexp = postfixexp.split(" ");
    let stack = [];
    for (let char of postfixexp) {
        if (isOperator(char)) {
            let val1 = stack.pop();
            let val2 = stack.pop();
            switch (char) {
                case "+":
                    stack.push(val2 + val1);
                    break;
                case "-":
                    stack.push(val2 - val1);
                    break;
                case "/":
                    stack.push(val2 / val1);
                    break;
                case "*":
                    stack.push(val2 * val1);
                    break;
                default:
                    throw new Error(`Unknown operator: ${char}`);
            }
        } else {
            stack.push(parseFloat(char));
        }
    }

    if (stack.length !== 1) {
        throw new Error("Invalid postfix expression");
    }
    return stack.pop();
}

const evaluateButton = document.getElementById("evaluate-btn");
evaluateButton.addEventListener("click", function (event) {
    event.preventDefault(); // prevent form submission to prevent refreshing page
    const userExpression = document.getElementById("calculator-input").value;
    const result = evalExpression(userExpression);
});

// visual calculator logic

// operator logic
function clear() {
    return "0";
}

function makeNumNegative(current_value) {
    let num = parseFloat(current_value);
    num = num * -1;
    return num.toString();
}

function modulo(current_value) {
    let num = parseFloat(current_value);
    num /= 100;
    let numStr = num.toFixed(4);
    numStr = numStr.replace(/\.?0+$/, ""); // Remove trailing zeros
    return numStr;
}

function doMath(stack) {
    let leftover_operator = stack.pop();
    let operand2 = stack.pop();
    let operator = stack.pop();
    let operand1 = stack.pop();
    let result;

    switch (operator) {
        case "+":
            result = operand1 + operand2;
            break;
        case "−":
            result = operand1 - operand2;
            break;
        case "×":
            result = operand1 * operand2;
            break;
        case "÷":
            if (operand2 === 0) {
                displayErrorMessage(true, "Cannot divide by zero!");
                stack.splice(0, stack.length);
                return "0";
            }
            result = operand1 / operand2;
            break;
    }

    stack.push(result);

    if (leftover_operator !== "=") {
        stack.push(leftover_operator);
    } else {
        stack.push(operator);
    }

    return result.toString();
}

function addNumberToCurrentString(current_value, value) {
    if (current_value.length === 9) {
        displayErrorMessage(true, "Number exceeds more than 9 characters!");
        return current_value;
    } else if (current_value === "0") {
        return "".concat(value);
    }
    return current_value.concat(value);
}

function display(current_value) {
    if (current_value.length > 10) {
        displayErrorMessage(true, "Value is too big! Does not fit in display.");
        return;
    }
    const resultDiv = document.querySelector(".result");
    resultDiv.textContent = current_value;
}

function displayErrorMessage(show, message) {
    let error_message = document.querySelector(".error-message");
    if (show) {
        if (!error_message) {
            error_message = document.createElement("div");
            error_message.classList.add("error-message");
            error_message.style["max-width"] = "400px";
            error_message.style["margin-top"] = "20px";
            error_message.style["text-align"] = "center";
            let bodyChildren = document.body.children;
            document.body.insertBefore(error_message, bodyChildren[bodyChildren.length - 2]);
        }
        error_message.textContent = message;
    } else if (error_message) {
        error_message.remove();
    }
}

let stack = [];
let current_value = "0"; // what we return or show in `result`
let math_operator = null; // for actual math operators
let currentOperatorElement = null; // To track the currently selected +-/* operator for background color

const cols = document.querySelectorAll(".col");
cols.forEach((col) => {
    col.addEventListener("click", () => {
        displayErrorMessage(false);

        if (col.classList.contains("operator")) {
            let operator = col.textContent;

            switch (operator) {
                case "AC":
                    current_value = clear();
                    stack.splice(0, stack.length);
                    current_value = "0";
                    break;
                case "C":
                    current_value = clear();
                    col.textContent = "AC";
                    stack.splice(0, stack.length);
                    current_value = "0";
                    break;
                case "+/-":
                    current_value = makeNumNegative(current_value);
                    break;
                case "%":
                    current_value = modulo(current_value);
                    break;
                case ".":
                    if (!current_value.includes(".")) {
                        current_value = current_value.concat(".");
                    }
                    break;
                case "=":
                    stack.push(parseFloat(current_value));
                    stack.push(operator);
                    current_value = doMath(stack);
                    break;
                default:
                    if (currentOperatorElement && currentOperatorElement !== col) {
                        currentOperatorElement.style["background-color"] = "#f5902a"; // Reset to original color
                    }
                    col.style["background-color"] = "#bf6e1d"; // Darker shade
                    currentOperatorElement = col;

                    // handle operators
                    if (math_operator !== null && math_operator !== operator) {
                        if (math_operator !== operator) {
                            stack.pop();
                            stack.pop();
                        }
                    }
                    math_operator = operator;
                    stack.push(parseFloat(current_value));
                    stack.push(math_operator);
                    break;
            }
        } else {
            if (math_operator) {
                current_value = "0";
                math_operator = null;
            }
            let operand = col.textContent;
            current_value = addNumberToCurrentString(current_value, operand);
        }

        // AC button should change to C when number is inputted
        if (current_value !== "0") {
            let div_AC = document.querySelector(".AC");
            div_AC.textContent = "C";
        }

        if (stack.length === 4) {
            current_value = doMath(stack);
        }

        display(current_value);
        console.log("CURRENT STACK:", stack);
    });
});
