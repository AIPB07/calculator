const defaultState = {
	activeNum: '0', // Content of primary number display (this changes when you click number keys)
	sum: 0, // Tracks running sum of a calculation
	calcString: '', // Content of secondary display that shows the actual calculation
	activeOperator: '' // Tracks the operator to be used in next stage of calculation
}
const operators = ['x', '-', '/', '+'];
let firstOperator = true; // Tracks whether an operator has been clicked yet 
let newNum = true; // Tracks whether a number is being typed
let decimalClicked = false; // Tracks whether current number contains a decimal
let calcComplete = false; // Tracks whether equals has been clicked
let result = 0; // For storing result of calculation


// Function to perform calculations
const operate = function(operandOne, operandTwo, operator) {
	switch(operator) {
		case "add":
			return operandOne + operandTwo;
			break;
		case "subtract":
			return operandOne - operandTwo;
			break;
		case "multiply":
			return operandOne * operandTwo;
			break;
		case "divide":
			return operandOne / operandTwo;
			break;
		default:
			return 0;		
	};
}

// Main stateful React component
class Controller extends React.Component {
	constructor(props) {
		super(props);
		this.state = defaultState;	
		this.handleNumberClick = this.handleNumberClick.bind(this);
		this.handleOperatorClick = this.handleOperatorClick.bind(this);
		this.handleClearClick = this.handleClearClick.bind(this);
		this.handleDecimalClick = this.handleDecimalClick.bind(this);
		this.handleEqualsClick = this.handleEqualsClick.bind(this);
	}

	handleNumberClick(event) {
		// Store value of number
		let value = event.target.innerHTML;
		// Will only effect activeNum
		if (this.state.activeNum == '0' || calcComplete) {
			// Overwrite activeNum
			this.setState ({
				activeNum: value
			});
			calcComplete = false;
		} else {
			// Append to activeNum
			this.setState ({
				activeNum: this.state.activeNum + value
			});
		}
		newNum = false;
	}

	handleOperatorClick(event) {
		// Remember operator symbol for calcString
		let symbol = event.target.innerHTML;
		// Handle two operators pressed in succession
		if (newNum) {
			// Operator was clicked before a number was. Needs overwriting unless '-'
			if (symbol == '-') {
				this.setState ({
					activeNum: '-'
				});
			}
			else {
				this.setState ({
					activeNum: '0',
					calcString: this.state.calcString.replace(/.$/, symbol),
					activeOperator: event.target.id
				});
			}
		}
		else {
			if (firstOperator) {
				// First time operator has been clicked => sum is just activeNum
				result = Number(this.state.activeNum);
				firstOperator = false;
			}
			else {
				// Second or more time operator has been clicked => need to perform calculation
				result = operate(this.state.sum, Number(this.state.activeNum), this.state.activeOperator);
			}
			this.setState ({
				activeNum: '0',
				sum: result,
				calcString: this.state.calcString + " " + this.state.activeNum + " " + symbol,
				activeOperator: event.target.id
			});
			newNum = true;
			decimalClicked = false;
		}
	}

	handleDecimalClick() {
		if (!decimalClicked) {
			this.setState ({
				activeNum: this.state.activeNum + "."
			});
			decimalClicked = true;
		}
	}

	handleClearClick() {
		// Reset state and global values
		this.setState(defaultState);
		firstOperator = true;
		newNum = true;
		decimalClicked = false;
	}

	handleEqualsClick() {
		if (this.state.calcString != '') {
			let result = operate(this.state.sum, Number(this.state.activeNum), this.state.activeOperator);
			console.log(result);
			this.setState ({
				calcString: '',
				activeNum: result,
				sum: result
			})
			calcComplete = true;
			decimalClicked = false;
			firstOperator = true;
		}
		// Else no calculation has occured
	}

	render() {
		return (
			<div className="container-fluid h-100">
				<div className="row h-25"></div>
				<div className="row h-50">
					<div className="col-sm-4"></div>
					<div className="col-sm-4 h-100 calculator">
						<div id="calc" className ="d-flex border justify-content-end h-1">{this.state.calcString}</div>
						<div id="display" className ="d-flex border justify-content-end h-1">{this.state.activeNum}</div>
						<div className="d-flex h-2">
							<div className="col-sm-6 border calc-btn"><button onClick={this.handleClearClick} id="clear" className="btn btn-danger">AC</button></div>
							<div className="col-sm-3 border calc-btn"><button onClick={this.handleOperatorClick} id="divide" className="btn btn-primary">/</button></div>
							<div className="col-sm-3 border calc-btn"><button onClick={this.handleOperatorClick} id="multiply" className="btn btn-primary">x</button></div>
						</div>
						<div className="d-flex h-4">
							<div className="col-sm-3">
								<div className="row h-50 border calc-btn"><button onClick={this.handleNumberClick} id="seven" className="btn btn-basic">7</button></div>
								<div className="row h-50 border calc-btn"><button onClick={this.handleNumberClick} id="four" className="btn btn-basic">4</button></div>
							</div>
							<div className="col-sm-3">
								<div className="row h-50 border calc-btn"><button onClick={this.handleNumberClick} id="eight" className="btn btn-basic">8</button></div>
								<div className="row h-50 border calc-btn"><button onClick={this.handleNumberClick} id="five" className="btn btn-basic">5</button></div>
							</div>
							<div className="col-sm-3">
								<div className="row h-50 border calc-btn"><button onClick={this.handleNumberClick} id="nine" className="btn btn-basic">9</button></div>
								<div className="row h-50 border calc-btn"><button onClick={this.handleNumberClick} id="six" className="btn btn-basic">6</button></div>
							</div>
							<div className="col-sm-3 border calc-btn"><button onClick={this.handleOperatorClick} id="subtract" className="btn btn-primary">-</button></div>
						</div>
						<div className="d-flex h-4">
							<div className="col-sm-3">
								<div className="row h-50 border calc-btn"><button onClick={this.handleNumberClick} id="one" className="btn btn-basic">1</button></div>
								<div className="row h-50 border calc-btn"><button onClick={this.handleDecimalClick} id="decimal" className="btn btn-basic">.</button></div>
							</div>
							<div className="col-sm-3">
								<div className="row h-50 border calc-btn"><button onClick={this.handleNumberClick} id="two" className="btn btn-basic">2</button></div>
								<div className="row h-50 border calc-btn"><button onClick={this.handleNumberClick} id="zero" className="btn btn-basic">0</button></div>
							</div>
							<div className="col-sm-3">
								<div className="row h-50 border calc-btn"><button onClick={this.handleNumberClick} id="three" className="btn btn-basic">3</button></div>
								<div className="row h-50 border calc-btn"><button onClick={this.handleEqualsClick} id="equals" className="btn btn-basic">=</button></div>
							</div>
							<div className="col-sm-3 border calc-btn"><button onClick={this.handleOperatorClick} id="add" className="btn btn-primary">+</button></div>
						</div>
					</div>
					<div className="col-sm-4"></div>
				</div>
				<div className="row h-25"></div>
			</div>
		)
	}
}

ReactDOM.render(<Controller />, document.getElementById('container'));