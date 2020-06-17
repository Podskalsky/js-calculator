class Calculator {
	constructor(container, display, keypad) {
		this.container = container;
		this.display = display;
		this.keypad = keypad;
		this.container.addEventListener('click', this.onClick);
		this.lastKey = this.keypad.querySelector('.zero');
		this.displayStr = '0';
		this.displayFontSize = window.getComputedStyle(this.display).fontSize;
		this.displayPaddingX = window.getComputedStyle(this.display).paddingLeft;
	}

	// gets called every click on any calc input (btn)
	updateDisplay(displayString) {
		this.display.textContent = displayString
			.split('')
			.map((char) => {
				switch (char) { // adds margin to every operator and changes it to a proper character
					case '+':
						return ' + ';
					case '-':
						return ' - ';
					case '*':
						return ' × ';
					case '/':
						return ' ÷ ';
					default:
						return char;
				}
			})
			.join('');
		this.overflowCheck(this.display);
	}

	// decreases the display padding and font-size whenever the content is overflowing so it fits
	overflowCheck(el) {
		el.style.fontSize = this.displayFontSize; // sets fontSize to the default val
		el.style.paddingLeft = this.displayPaddingX; // sets left padding to the default val
		el.style.paddingRight = this.displayPaddingX; // sets right padding to the default val
		let currPadding = parseInt(this.displayPaddingX.match(/\d+/)); // gets the default padding in an integer
		let currFontSize = parseInt(this.displayFontSize.match(/\d+/)); // gets the default font-size in an integer
		while (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
			// while content of el is overflowing...
			currPadding -= 1;
			currFontSize -= 1;
			el.style.fontSize = `${currFontSize}px`;
			el.style.paddingLeft = `${currPadding}px`;
			el.style.paddingRight = `${currFontSize}px`;
		}
	}
	// clears the displayStr
	clearAll = () => {
		this.displayStr = '0';
		this.lastKey = document.querySelector('.zero');
	};

	// removes last char from the displayStr
	clearOne = () => {
		if (this.displayStr.length > 1) {
			this.displayStr = this.displayStr.substring(0, this.displayStr.length - 1);
			this.lastKey = eval(
				`document.querySelector("input[data-val='${this.displayStr[this.displayStr.length - 1]}']")` //sets the lastKey corresponding to the last char (after one is removed)
			);
		}
	};

	// enters a digit char into displayStr
	digit = (target) => {
		const lastNumStartsWithZero = this.displayStr.match(/(\.|\d)*$/)[0] === '0';
		const digit = target.dataset.val; // gets the specific number
		if (lastNumStartsWithZero) {
			this.displayStr = this.displayStr.substring(0, this.displayStr.length - 1) + digit;
		} else {
			this.displayStr += digit;
		}
	};

	// enters an operator char into displayStr
	operator = (target) => {
		if (this.lastKey.matches('.operator')) {
			this.displayStr = this.displayStr.substring(0, this.displayStr.length - 1) + target.dataset.val;
		} else if (/\d$/.test(this.displayStr)) {
			this.displayStr += target.dataset.val;
		}
	};

	// enters a decimal point into displayStr
	decimal = (target) => {
		if (/\d$/.test(this.displayStr) && !/\.\d*$/.test(this.displayStr)) {
			this.displayStr += target.dataset.val;
		}
	};

	// negates the number if it's positive and makes it positive if it's negative
	plusMinus = () => {
		if (/^-?[.0-9]+$/.test(this.displayStr)) {
			this.displayStr = String(parseFloat(this.displayStr) * -1);
		}
	};
	// evaluates the displayStr expression
	equal = () => {
		if (/\d$/.test(this.displayStr)) {
			this.displayStr = String(parseFloat(eval(this.displayStr).toPrecision(15)));
		}
	};
	// event listener for click
	onClick = (event) => {
		const targetEl = event.target;

		if (targetEl.matches('.clear-all')) {
			this.clearAll();
		} else if (targetEl.matches('.clear-one')) {
			this.clearOne();
		} else if (targetEl.matches('.digit')) {
			this.digit(targetEl);
		} else if (targetEl.matches('.operator')) {
			this.operator(targetEl);
		} else if (targetEl.matches('.decimal')) {
			this.decimal(targetEl);
		} else if (targetEl.matches('.plus-minus')) {
			this.plusMinus();
		} else if (targetEl.matches('.equal')) {
			this.equal();
		}
		this.updateDisplay(this.displayStr); // update display
		if (!targetEl.matches('.func')) {
			// func inputs set the lastKey themselves
			this.lastKey = targetEl;
		}
	};
}

// initialize the calculator object
const calc = new Calculator(
	document.querySelector('.container'),
	document.querySelector('.display'),
	document.querySelector('.keypad')
);
