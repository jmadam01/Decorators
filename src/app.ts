//NEST.js

function Logger(logString:string){
    return function(constructor:Function){
        console.log(logString);
        console.log(constructor);
    } 
}

function WithTemplate(template:string,hookid:string){
    return function<T extends {new(...args:any[]):Person}>(originalconstructor:T){

        return class extends originalconstructor {
            constructor(..._:any[]){
            super();
            console.log("rendering template")
            const hookEl = document.getElementById(hookid);
    
            if(hookEl){
                hookEl.innerHTML = template;
                hookEl.querySelector("h1")!.textContent = this.name;
            }
        
        }}
    }
}

@Logger('LOGGING')
@WithTemplate("<h1>My Person Object</h1>","app")
class Person{
    name:string = "John";
    constructor(){
        console.log("Creating new Person...");
    }
}

const person = new Person();

console.log(person);

function Log(target:any,propertyName:string){

    console.log("Peroperty Decorator");
    console.log(propertyName);
    console.log(target);

}
function Log2(target:any,name:string,description:PropertyDescriptor){

    console.log("Accessor Decorator");
    console.log(name);
    console.log(description);
    console.log(target);


}

function Log3(target:any,name:string|symbol,description:PropertyDescriptor) {

    console.log("Method Decorator");
    console.log(name);
    console.log(description);
    console.log(target);
}

function Log4(target:any,name:string|Symbol,position:number) {

    console.log("Parameter Decorator");
    console.log(name);
    console.log(position);
    console.log(target);
}



class Product{
    @Log
    private _title:string;
    private _price:number

    @Log2
    set price(price:number){
        if(price > 0){
            this._price = price;
        }else{

            throw new Error("There needs to be a price to set!");
        }
    }

    set title(title:string){

        this._title = title;
    }

    get title(){

        return this._title;

    }

    get price(){

        return this._price;
    }

    constructor(t:string,p:number){
        this._title = t;
        this._price = p;

    }


    @Log3
    GetPriceWithTax(@Log4 tax:number){

        return this._price * (1+tax);

    }


    
}
function AutoBind(_:any,_2:string,descriptor:PropertyDescriptor){

    const origialMethod =descriptor.value;
    const adjDescriptor:PropertyDescriptor = {
        configurable: true,
        enumerable:false,
        get(){
            const boundFn = origialMethod.bind(this);
            return boundFn;
        }
    }

    return adjDescriptor;
}
class Printer{

    message:string = "Test";

    @AutoBind
    showMessage(){
        console.log(this.message);
    }
}

const p = new Printer();
p.showMessage();
const button =document.querySelector('button')!;
button.addEventListener("click", p.showMessage);



const courseFOrm = document.querySelector("form");

courseFOrm?.addEventListener("submit",event=>{

    event.preventDefault();
    const titleEl = document.getElementById("title") as HTMLInputElement;
    const priceEl = document.getElementById("price") as HTMLInputElement;

    const title = titleEl.value;
    const price = +priceEl.value;

    const createdCourse = new Course(title, price);
    if(validate(createdCourse)){
        console.log(createdCourse);

    }

    else{

        console.log("Bad Course");
    }
    
})


interface ValidatorConfig {

    [property: string]: {
        [validateableProp:string]:string[] // required positive
    }

}

const registeredVlaidators:ValidatorConfig = {};



function Required(target:any, propName:string){

    registeredVlaidators[target.constructor.name] = {
        ...registeredVlaidators[target.constructor.name],
        [propName]:[...(registeredVlaidators[target.constructor.name]?.[propName] ?? []), 'required']
    };

}

function PositiveNumber(target:any, propName:string){
    // console.log("Constructor name");
    // console.log(target.constructor.name);
    
    registeredVlaidators[target.constructor.name] = {
        ...registeredVlaidators[target.constructor.name],
        [propName]:[...(registeredVlaidators[target.constructor.name]?.[propName] ?? []), 'positive']
    };

}

function validate(obj:any):boolean {

    const objectValidators = registeredVlaidators[obj.constructor.name];

    if (!obj) {
        return true
    }
    else{
        let isValid = true;
        for(const prop in objectValidators){

            for (const validator of objectValidators[prop]) {
                switch(validator){

                    case 'required':
                        isValid = isValid && !!obj[prop];
                        break;
                    case 'positive':
                        isValid = isValid && obj[prop] >0;
                        break;

                }
            }
        }
        return isValid
    }

}

class Course{

    @Required
    title:string;
    @PositiveNumber
    price:number;

    constructor(t:string, p:number){

        this.title = t;
        this.price = p;

    }

}

const p1 = new Product("Book", 1.00);
const p2 = new Product("Book 2", 2.00);