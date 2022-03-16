var screen = document.querySelector('#calculator-input');
var outputScreen = document.querySelector('#calculator-result');
var tokens = [];
var stack = [];

var changeInput = inp => {
    if(inp == 'ac') {
        screen.innerText = "";
        tokens = [];
        return;
    } else if(inp == 'bs') {
        screen.innerText = screen.innerText.substring(0,screen.innerText.length-1);
        if(tokens) tokens.pop();
        return;
    }

    screen.innerText += inp;
    tokens.push(inp);
}

var precedence = token => (token == '*' || token == '/' || token == '%') ? 1 : 0;

var evaluate = () => {
    stack = [];
    var nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    var postfix = [], temp = [];
    var reading = false;

    tokens.map(token => {
        if(nums.indexOf(token) > -1) {
            if(!reading) {
                postfix.push(Number(token));
                reading = true;
            } else postfix[postfix.length - 1] = (postfix[postfix.length - 1] + token);
        }
        else if(token == '(') temp.push('(');
        else if(token == ')') {
            while(temp[temp.length - 1] != '(') postfix.push(temp.pop());
            temp.pop();
        }
        else {
            while ((temp[temp.length - 1] != '(') && (temp.length > 0 && precedence(temp[temp.length - 1]) >= precedence(token))) {
                var x = temp.pop();
                postfix.push(x);
            }
            temp.push(token);
            reading = false;
        }
    });

    while(temp.length > 0) postfix.push(temp.pop());

    console.log(postfix);

    postfix.map(token => {
        if(!isNaN(Number(token))) stack.push(token);
        else {
            var y = Number(stack[stack.length - 1]), x = Number(stack[stack.length - 2]);
            
            stack.pop();
            stack.pop();
            if(token == '+') stack.push(x+y);
            else if(token == '-') stack.push(x-y);
            else if(token == '*') stack.push(x*y);
            else if(token == '/') stack.push(x/y);
            else if(token == '%') stack.push(x%y);
            else if(token == '^') stack.push(Math.pow(x,y));
        }
    });

    return stack.length > 0 ? stack[0] : 0;
}

var btns = [...document.querySelectorAll('#calculator-btn-group>button')];
btns.map(btn => btn.addEventListener('click', () => {
    changeInput(btn.innerText);
    outputScreen.innerText = evaluate();
}))

outputScreen.innerText = evaluate();