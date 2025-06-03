// Calculator state variables
let currentInput = '0';
let previousInput = '';
let operator = '';
let waitingForNewInput = false;

// DOM elements
const currentDisplay = document.getElementById('current');
const historyDisplay = document.getElementById('history');

// Initialize background animation
function createParticles() {
    const bgAnimation = document.getElementById('bgAnimation');
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 60 + 20;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const delay = Math.random() * 6;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.animationDelay = delay + 's';
        
        bgAnimation.appendChild(particle);
    }
}

// Create ripple effect
function createRipple(event, button) {
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Update display function with animation
function updateDisplay() {
    currentDisplay.textContent = currentInput;
    historyDisplay.textContent = previousInput + ' ' + operator;
    
    // Add success animation for calculations
    if (waitingForNewInput && operator === '') {
        currentDisplay.classList.add('success');
        setTimeout(() => {
            currentDisplay.classList.remove('success');
        }, 400);
    }
}

// Input number function
function inputNumber(num) {
    if (waitingForNewInput) {
        currentInput = num;
        waitingForNewInput = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

// Input decimal function
function inputDecimal() {
    if (waitingForNewInput) {
        currentInput = '0.';
        waitingForNewInput = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

// Input operator function
function inputOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (previousInput === '') {
        previousInput = inputValue;
    } else if (operator) {
        const result = performCalculation();
        
        if (result === null) return;
        
        currentInput = String(result);
        previousInput = result;
    }

    waitingForNewInput = true;
    operator = nextOperator;
    updateDisplay();
}

// Perform calculation function
function performCalculation() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return null;

    let result;
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                showError('Cannot divide by zero');
                return null;
            }
            result = prev / current;
            break;
        default:
            return null;
    }

    result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;
    
    if (!isFinite(result)) {
        showError('Result too large');
        return null;
    }

    return result;
}

// Calculate function
function calculate() {
    if (operator && previousInput !== '' && !waitingForNewInput) {
        const result = performCalculation();
        
        if (result === null) return;
        
        currentInput = String(result);
        previousInput = '';
        operator = '';
        waitingForNewInput = true;
        updateDisplay();
    }
}

// Clear all function
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    waitingForNewInput = false;
    currentDisplay.classList.remove('error');
    updateDisplay();
}

// Clear entry function
function clearEntry() {
    currentInput = '0';
    currentDisplay.classList.remove('error');
    updateDisplay();
}

// Delete last character function
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    currentDisplay.classList.remove('error');
    updateDisplay();
}

// Show error function with animation
function showError(message) {
    currentInput = message;
    currentDisplay.classList.add('error');
    updateDisplay();
    setTimeout(() => {
        clearAll();
    }, 2500);
}

// Keyboard event handler
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if ('0123456789+-*/.=Enter'.includes(key) || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }

    if ('0123456789'.includes(key)) {
        inputNumber(key);
    } else if (key === '+') {
        inputOperator('+');
    } else if (key === '-') {
        inputOperator('-');
    } else if (key === '*') {
        inputOperator('×');
    } else if (key === '/') {
        inputOperator('÷');
    } else if (key === '.') {
        inputDecimal();
    } else if (key === '=' || key === 'Enter') {
        calculate();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Add enhanced button interactions
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(event) {
        createRipple(event, this);
    });
    
    button.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(-2px) scale(0.98)';
    });
    
    button.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Initialize
createParticles();
updateDisplay();

// Recreate particles on window resize
window.addEventListener('resize', function() {
    document.getElementById('bgAnimation').innerHTML = '';
    createParticles();
});