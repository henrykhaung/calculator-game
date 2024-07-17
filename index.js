document.querySelector(".menu li").addEventListener("mouseover", function () {
    document.getElementById("menu").textContent = "Close";
});

document.querySelector(".menu li").addEventListener("mouseout", function () {
    document.getElementById("menu").textContent = "Menu";
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
    if (current_value === "0") {
        return "".concat(value);
    }
    return current_value.concat(value);
}

function display(current_value) {
    if (current_value.length > 10) {
        current_value = Number(current_value);
        current_value = current_value.toPrecision(9);
    }
    // Remove unnecessary trailing zeros and potential trailing decimal point
    if (current_value.includes('.')) {
        current_value = parseFloat(current_value).toString();
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
                default:
                    if (currentOperatorElement && currentOperatorElement !== col) {
                        currentOperatorElement.style["background-color"] = "#f5902a"; // Reset to original color
                    }
                    col.style["background-color"] = "#bf6e1d"; // Darker shade
                    currentOperatorElement = col;

                    if (!math_operator) {
                        math_operator = operator;
                    } else if (math_operator !== operator) {
                        stack[stack.length - 1] = operator;
                        math_operator = operator;
                        break;
                    }

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

// keyboard support
document.addEventListener('keydown', function(event) {
    const resultDiv = document.querySelector(".result");
    
    if (math_operator) {
        current_value = "0";
        math_operator = null;
    }

    // Allow numbers and basic operations
    if ((event.key >= "0" && event.key <= "9") || event.key === '.') {
        if (current_value === "0") {
            current_value = event.key;
        } else {
            current_value += event.key;
        }
    } else if (event.key === 'Backspace') {
        current_value = current_value.slice(0, -1) || "0";
    } else if (event.key === 'Enter') {
        if (stack.length === 0 || stack.length === 1) {
            return;
        }
        let temp1 = stack[0].toString();
        let temp2 = current_value === "0" ? temp1 : current_value;
        let operator = stack[1]; 
        if (stack[1] === "−") {
            operator = "-";
        } else if (stack[1] === "×") {
            operator = "*";
        } else if (stack[1] === "÷") {
            operator = "/"
        } 
        temp1 = temp1.concat(operator);
        temp1 = temp1.concat(temp2);
        temp1 = eval(temp1);
        stack[0] = temp1; 
        current_value = temp1.toString();

        math_operator = "=";

        const cols = document.querySelectorAll(".col.operator.op");
        cols.forEach((col) => {
            if (col.textContent === "=") {
                currentOperatorElement = col;
                col.style["background-color"] = "#bf6e1d"; // Darker shade
                currentOperatorElement = col;
            } else {
                col.style["background-color"] = "#f5902a"; // Reset to original color
            }
        });
    }

    display(current_value);
});
