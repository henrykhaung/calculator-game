
// helper function
// getRandomInt copied from mdn web docs
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

// main function -> takes care of input validation and calculations
function inputRules(elementInput, regPattern) {
    // only accept regPattern in input
    elementInput.addEventListener('input', (event) => {
        const value = event.target.value;
        if (!regPattern.test(value) || value === '.' || value === '/') {   
            event.target.value = '';
        }
    });

    elementInput.addEventListener('blur', (event) => {
        let value = event.target.value;

        // add value to hashmap (tracks each input value)
        // evaluate if item-[number]
        // also show the total item cost in Result
        if (value) {
            if (elementInput.id.includes('item')) {
                let resEval = parseFloat(eval(value));
                let evalValue = resEval.toFixed(2);
                event.target.value = evalValue;
                value = evalValue;
                
                inputValueMap.set(elementInput.id, resEval); 
                
            }
        }

        // add $ after done inputting
        // add .00 if whole number OR if ends with a . ie 123., get rid of the .
        // also add tax, tip, subtotal value to hashmap
        // delete value if there is no value (for cases when user puts number and then deletes it)
        if (value) {
            if (!elementInput.id.includes('item')) {
                inputValueMap.set(elementInput.id, Number(value));
            }

            if (!value.includes('.')) {
                event.target.value = '$'.concat(value.concat('.00'));
            } else if (value[value.length - 1] === '.') {
                event.target.value = '$'.concat(value.concat('00'));
            } else {
                event.target.value = '$'.concat(Number(value).toFixed(2));
            }
        } else {
            if (inputValueMap.has(elementInput.id)) {
                inputValueMap.delete(elementInput.id);
            }
        }
        
        // calculate your total item costs, your tax, your tip if possible
        const container = document.querySelector('.total-items-cost-container');
        let totalItemCostsText = container.querySelector('.text');
        const taxContainer = document.querySelector('.your-tax-container');
        let taxContainerText = taxContainer.querySelector('.text');
        const tipContainer = document.querySelector('.your-tip-container');
        let tipContainerText = tipContainer.querySelector('.text');
        let result = document.getElementById('final-calculation');
        let hasAtLeastOneItem = Array.from(inputValueMap.keys()).some(key => key.includes('item'));
        
        if (hasAtLeastOneItem && inputValueMap.has('tax') && inputValueMap.has('tip') && inputValueMap.has('subtotal')) {
            let totalItemCosts = 0;
            for (const [input, value] of inputValueMap.entries()) {
                if (input.includes('item')) {
                    totalItemCosts += value;
                }
            }
            totalItemCostsText.style.opacity = 1;
            totalItemCostsText.textContent = `$${totalItemCosts.toFixed(2)}`;

            taxContainerText.style.opacity = 1;
            let yourtax = (inputValueMap.get('tax') / inputValueMap.get('subtotal')) * totalItemCosts;
            taxContainerText.textContent = `$${yourtax.toFixed(2)}`; 
            
            tipContainerText.style.opacity = 1;
            let yourtip = inputValueMap.get('tip') / inputValueMap.get('subtotal') * totalItemCosts;
            tipContainerText.textContent = `$${yourtip.toFixed(2)}`;

            result.style.opacity = 1;
            result.textContent = `$${(totalItemCosts + yourtax + yourtip).toFixed(2)}`;
        } else { // reset to default if needed
            totalItemCostsText.style.opacity = 0.5; 
            totalItemCostsText.textContent = '$39.75';
            taxContainerText.style.opacity = 0.5;
            taxContainerText.textContent = '$3.77'; 
            tipContainerText.style.opacity = 0.5;
            tipContainerText.textContent = '$7.16';
            result.style.opacity = 0.5;
            result.textContent = '$50.68';
        }
    });
    
    
    // get rid of $ when inputting
    elementInput.addEventListener('focus', (event) => {
        const value = event.target.value;
        if (value.includes('$')) {
            event.target.value = value.replace('$', '');
        }
    });

    // disable Enter key to submit input
    elementInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });
}

// each refresh: 
// random order number
// get today's date
// get current time
document.addEventListener('DOMContentLoaded', (event) => {
    let orderNumElement = document.getElementById('order-num');
    orderNumElement.textContent = `ORDER : ${getRandomInt(1, 100)}`;

    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    month = month < 10 ? '0' + month : month;
    let dateElement = document.getElementById('date');
    dateElement.textContent = `${month}/${day}/${year}`;

    let hour = date.getHours();
    let mins = date.getMinutes();
    let period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    mins = mins < 10 ? '0' + mins : mins;
    let timeElement = document.getElementById('time');
    timeElement.textContent = `${hour}:${mins} ${period}`;
});

// only accept numbers for tax, tip, and total
let taxInput = document.getElementById('tax');
inputRules(taxInput, /^-?\d*\.?\d*$/);
let tipInput = document.getElementById('tip');
inputRules(tipInput, /^-?\d*\.?\d*$/);
let subtotalInput = document.getElementById('subtotal');
inputRules(subtotalInput, /^-?\d*\.?\d*$/);

// handle add item logic -> adds Item starting from Item 3 and adjusts receipt template
const addItemBtn = document.getElementById('add-item');
let itemsDiv = document.getElementById('items');
addItemBtn.addEventListener('click', function() {
    totalItems++;
    let newDiv = document.createElement('div');
    newDiv.classList = `form-group item-${totalItems}`;

    let newLabel = document.createElement('label');
    newLabel.htmlFor = `item-${totalItems}`;
    newLabel.textContent = `Item ${totalItems}`;

    let newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.id = `item-${totalItems}`;

    newDiv.append(newLabel);
    newDiv.append(newInput);
    itemsDiv.append(newDiv);

    // apply rules
    let newItemInput = document.getElementById(`item-${totalItems}`);
    inputRules(newItemInput, /^-?\d*\.?\d*(\/-?\d*\.?\d*)?$/);
});

// handle item costs and total item costs
// calculate how much you owe -> total item costs + your tax + your tip
const inputValueMap = new Map(); 
let totalItems = 2; // by default 2 items will be presented
let item1Input = document.getElementById('item-1');
inputRules(item1Input, /^-?\d*\.?\d*(\/-?\d*\.?\d*)?$/);
let item2Input = document.getElementById('item-2');
inputRules(item2Input, /^-?\d*\.?\d*(\/-?\d*\.?\d*)?$/);
