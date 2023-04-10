"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
function Logger(logString) {
    return function (constructor) {
        console.log(logString);
        console.log(constructor);
    };
}
function WithTemplate(template, hookid) {
    return function (originalconstructor) {
        return class extends originalconstructor {
            constructor(..._) {
                super();
                console.log("rendering template");
                const hookEl = document.getElementById(hookid);
                if (hookEl) {
                    hookEl.innerHTML = template;
                    hookEl.querySelector("h1").textContent = this.name;
                }
            }
        };
    };
}
let Person = class Person {
    constructor() {
        this.name = "John";
        console.log("Creating new Person...");
    }
};
Person = __decorate([
    Logger('LOGGING'),
    WithTemplate("<h1>My Person Object</h1>", "app")
], Person);
const person = new Person();
console.log(person);
function Log(target, propertyName) {
    console.log("Peroperty Decorator");
    console.log(propertyName);
    console.log(target);
}
function Log2(target, name, description) {
    console.log("Accessor Decorator");
    console.log(name);
    console.log(description);
    console.log(target);
}
function Log3(target, name, description) {
    console.log("Method Decorator");
    console.log(name);
    console.log(description);
    console.log(target);
}
function Log4(target, name, position) {
    console.log("Parameter Decorator");
    console.log(name);
    console.log(position);
    console.log(target);
}
class Product {
    set price(price) {
        if (price > 0) {
            this._price = price;
        }
        else {
            throw new Error("There needs to be a price to set!");
        }
    }
    set title(title) {
        this._title = title;
    }
    get title() {
        return this._title;
    }
    get price() {
        return this._price;
    }
    constructor(t, p) {
        this._title = t;
        this._price = p;
    }
    GetPriceWithTax(tax) {
        return this._price * (1 + tax);
    }
}
__decorate([
    Log
], Product.prototype, "_title", void 0);
__decorate([
    Log2
], Product.prototype, "price", null);
__decorate([
    Log3,
    __param(0, Log4)
], Product.prototype, "GetPriceWithTax", null);
function AutoBind(_, _2, descriptor) {
    const origialMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFn = origialMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
class Printer {
    constructor() {
        this.message = "Test";
    }
    showMessage() {
        console.log(this.message);
    }
}
__decorate([
    AutoBind
], Printer.prototype, "showMessage", null);
const p = new Printer();
p.showMessage();
const button = document.querySelector('button');
button.addEventListener("click", p.showMessage);
const courseFOrm = document.querySelector("form");
courseFOrm === null || courseFOrm === void 0 ? void 0 : courseFOrm.addEventListener("submit", event => {
    event.preventDefault();
    const titleEl = document.getElementById("title");
    const priceEl = document.getElementById("price");
    const title = titleEl.value;
    const price = +priceEl.value;
    const createdCourse = new Course(title, price);
    if (validate(createdCourse)) {
        console.log(createdCourse);
    }
    else {
        console.log("Bad Course");
    }
});
const registeredVlaidators = {};
function Required(target, propName) {
    var _a, _b;
    registeredVlaidators[target.constructor.name] = Object.assign(Object.assign({}, registeredVlaidators[target.constructor.name]), { [propName]: [...((_b = (_a = registeredVlaidators[target.constructor.name]) === null || _a === void 0 ? void 0 : _a[propName]) !== null && _b !== void 0 ? _b : []), 'required'] });
}
function PositiveNumber(target, propName) {
    var _a, _b;
    registeredVlaidators[target.constructor.name] = Object.assign(Object.assign({}, registeredVlaidators[target.constructor.name]), { [propName]: [...((_b = (_a = registeredVlaidators[target.constructor.name]) === null || _a === void 0 ? void 0 : _a[propName]) !== null && _b !== void 0 ? _b : []), 'positive'] });
}
function validate(obj) {
    const objectValidators = registeredVlaidators[obj.constructor.name];
    if (!obj) {
        return true;
    }
    else {
        let isValid = true;
        for (const prop in objectValidators) {
            for (const validator of objectValidators[prop]) {
                switch (validator) {
                    case 'required':
                        isValid = isValid && !!obj[prop];
                        break;
                    case 'positive':
                        isValid = isValid && obj[prop] > 0;
                        break;
                }
            }
        }
        return isValid;
    }
}
class Course {
    constructor(t, p) {
        this.title = t;
        this.price = p;
    }
}
__decorate([
    Required
], Course.prototype, "title", void 0);
__decorate([
    PositiveNumber
], Course.prototype, "price", void 0);
const p1 = new Product("Book", 1.00);
const p2 = new Product("Book 2", 2.00);
//# sourceMappingURL=app.js.map