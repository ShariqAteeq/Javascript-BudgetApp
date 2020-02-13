//we can create seperate model frim function expression inside IIFI
//IIFI basically means that it doesnt concern with global execution
//IIFI is an independent expression
//IIFI is applied on function expression
//you can access values or functions inside IIFI from return

//1st model
//BUDGET CONTROLLER
var budgetController = (function(){
        //create function constructor for all expensex and incomes b/c there are
        //lot of incomes and expenses means lots of objects thats why we make constructor
    var Expenxe = function(id,description,value){

            this.id = id;
            this.description = description;
            this.value=value;
            this.percentage = -1;

    };

    Expenxe.prototype.calpercentage = function(totalIncome){

        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }

    };

    Expenxe.prototype.getPercent = function(){
        return this.percentage;
    };

    var Income = function(id,description,value){

        this.id = id;
        this.description = description;
        this.value=value;

    };

    calculateTotal = function(type){

        var sum = 0;
        data.allItem[type].forEach(function(cur){
            
            sum += cur.value; 

        });

        data.totals[type] = sum;

    };

    //all incomes and expenses data
    var data = {

        allItem:{
            inc:[],
            exp:[]
        },
        totals:{
            inc:0,
            exp:0
        },
        budget:0,
        percentage: -1

    };
    return{

        addItem : function(type,des,val){
            var ID, newItem;
            //ID is assigned to every Income and exprenses object so later we can remove that from id
            //create new id
            if(data.allItem[type].length > 0){
            ID = data.allItem[type][data.allItem[type].length-1].id+1;
            }else{
                ID = 0;
            }
            //create new item based on inc or exp
            if(type==="exp"){
                newItem = new Expenxe(ID,des,val);
            } else if(type==="inc"){
                newItem = new Income(ID,des,val);
            }

            //push into data sctructure
            data.allItem[type].push(newItem);
            return newItem;
        },

        deleteItem : function(type,id){
            var ids , index;
            //map function is like foreach method but it returns new brand array
            //so it returns all item id into ids array
            ids = data.allItem[type].map(function(current){
                return current.id;

            });
            //find index of our desired id
            index = ids.indexOf(id);

            //-1 mean tere is no index
            //splice method remove elemnt from array its 1st arguement define index
            //2nd arguement define  how much values to remove
            if(index !== -1){
                data.allItem[type].splice(index,1);
            }

        },

        calculateBudget : function(){

            //calculate all income and expenses
            calculateTotal("inc");
            calculateTotal("exp");

            //calculate budget
            data.budget = data.totals.inc-data.totals.exp;

            //calculate percentage
            if(data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
            } else{
                data.percentage = -1;
            }

        },

        //calculate percentage
        calculatePercentage : function(){

            data.allItem.exp.forEach(function(cur){
                cur.calpercentage(data.totals.inc);

            });


        },

        getPercentage : function(){

            var allPer = data.allItem.exp.map(function(cur){
                return cur.getPercent();
            });
            return allPer;
        },

        getBudget : function(){

            return{
                budget:data.budget,
                totInc:data.totals.inc,
                totExp:data.totals.exp,
                Per:data.percentage
            };

        },

        //since data is not accessible so we pass it into return
        testingData : function(){
            console.log(data);
        }

    };

})();

//2nd Model
//UICONTROLLER
var UIController = (function(){

    var DOMStrings = {
        inputType : ".add__type",
        inputDes : ".add__description",
        inputValue : ".add__value",
        inputBtn : ".add__btn",
        incomeContainer : ".income__list",
        expensesContainer : ".expenses__list",
        budgetLabel : ".budget__value",
        incomeLabel : ".budget__income--value",
        expenseLabel : ".budget__expenses--value",
        perLabel : ".budget__expenses--percentage",
        container: ".container",
        expensesPerLabel : ".item__percentage"
    };

    return{
        getinput : function(){
            return{
             type: document.querySelector(DOMStrings.inputType).value,
             description: document.querySelector(DOMStrings.inputDes).value,
             //to covert value from string to float pr int use parsefloat
             value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
    };
    
    },

        //add items into UI

        addListItem : function(obj,type){

            var html , element , newHtml;

            //create html string with placeholder text
            if(type==="inc"){
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            } else if(type==="exp"){
                element = DOMStrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%Z">  <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>'

            }
            //replace the placeolder text with actual data

                newHtml = html.replace("%id%",obj.id);
                newHtml = newHtml.replace("%description%",obj.description);
                newHtml = newHtml.replace("%value%",obj.value);

            //insert newhtml into DOM

                document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);

        },

        //delete item from list on UI
        deleteListItem : function(itemId){

            var el = document.getElementById(itemId);
            el.parentNode.removeChild(el);

        },

        clearFields : function(){
            var fields, fieldArr;

            //to select all fields which will be clear
            //it returns a list 
            fields = document.querySelectorAll(DOMStrings.inputDes+ ", "+DOMStrings.inputValue);
            
            //convert list to an array
            //slice is used to convert list to arrat
            fieldArr = Array.prototype.slice.call(fields);
            
            //for each metod will select all itms of array
            fieldArr.forEach(function(current , index , fieldArr) {
                current.value = "";
            });
            fieldArr[0].focus();
        },

        displayBudget : function(obj){

            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totInc;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.totExp;

            if(obj.budget > 0) {
            document.querySelector(DOMStrings.perLabel).textContent = obj.Per+"%";
            } else{
                document.querySelector(DOMStrings.perLabel).textContent = "--";
            }

        },

        //display percentages
        displayPercentage : function(percentages){

            var fields = document.querySelectorAll(DOMStrings.expensesPerLabel);

            var nodeListforEach = function(list, callBack){

                for(var i = 0 ; i < list.length ; i++){
                    callBack(list[i], i);
                }

            };
            nodeListforEach(fields,function(current,index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + "%";
                }else{
                    current.textContent = percentages = -1;
                }
            });

        },

    //if we want to public our DOM Strings to other model we have to pass in return
        returnDOM : function(){
            return DOMStrings;
    }
};
})();

//3rd or our main model

//APP CONTROLLER
var Controller = (function(budgetctrl,UIctrl){

    var SetupEventListener = function(){

            var DOM = UIctrl.returnDOM();

            //this event is occured when user click yes button
            document.querySelector(DOM.inputBtn).addEventListener("click",ctrlAddItem);

            //this event occur when press enter key
            document.addEventListener("keypress",function(event){

            //enter keycode is 13
            //which method used in older browser
            if(event.keyCode===13 || event.which===13){
                ctrlAddItem();
            }

            //event for delete items from income or expense list
            document.querySelector(DOM.container).addEventListener("click",ctrlDeleteItem);

        });
    };

    var updateBudget = function(){
        
        //1. calculate budget
        budgetctrl.calculateBudget();

        //2. return budget
        var budget = budgetctrl.getBudget();

        //3. display budget
        UIctrl.displayBudget(budget);
        

    };

    var ctrlAddItem = function(){
        
            var input , newItem;
             
            //1. get the field input data

            input = UIctrl.getinput();

            //now it will not add income or expenses if there will be no value

            if(input.description !== "" && !isNaN(input.value) && input.value > 0 ){

                //2. put into budget controller

                newItem = budgetctrl.addItem(input.type,input.description,input.value);

                //3. put into UI controller
    
                UIctrl.addListItem(newItem,input.type);
    
                //4. clear all fields
    
                UIctrl.clearFields();
    
                //5. calculate and update budget
    
                updateBudget();

                //6 calculate and update percentage

                updateper();

            }      

        };

        var ctrlDeleteItem = function(event){

            var ItemID , splitId , type , ID;

            ItemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
            splitId = ItemID.split("-");  
            type = splitId[0];
            ID = parseInt(splitId[1]);

            //1. delete the item from data structure

            budgetctrl.deleteItem(type,ID);

            //2. delete the item from UI

            UIctrl.deleteListItem(ItemID);

            //3. update and show the budget

            updateBudget();

            //4 calculate and update percentage

            updateper();

        };

        var updateper = function(){

            //calculate percentage
            budgetctrl.calculatePercentage();

            //get percentage
           var percentages = budgetctrl.getPercentage();

            //show per on UI
            UIctrl.displayPercentage(percentages);

        };

        //for accessing eventlistener function we have to pass in return b/c its IIFI
        return{
            init:function(){
                console.log("Application started");
                UIctrl.displayBudget({
                    budget:0,
                    totInc:0,
                    totExp:0,
                    Per:0
                });
                SetupEventListener();
            }
        }
       

})(budgetController,UIController); //it takes arguement
//call thi init function

Controller.init();