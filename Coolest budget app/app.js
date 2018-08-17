//Budget Controller
var budgetController = (function(){
    
    var Expense = function (id,desc,value){
        
        this.id = id;
        this.desc = desc;
        this.value = value;   
        this.perc = -1;
    };
    
    Expense.prototype.calcPerc = function(totalIncome){
        console.log(totalIncome);
        if(totalIncome > 0 ){
        this.perc = Math.round((this.value / totalIncome) * 100);
        }
        else {
            this.perc = -1;
        }
    };
    Expense.prototype.getPerc = function(){
        return this.perc;
    }
    var Income = function (id,desc,value){
        
        this.id = id;
        this.desc = desc;
        this.value = value;    
    };
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum = sum + curr.value;
        });
        data.totals[type] = sum;
    };
    
    var data = {
        allItems : {
            exp : [],
            inc :[]
        },
        
        totals : {
            exp :0,
            inc :0
        },
        budget : 0,
        percentage : -1
    };
    
    return {
        addItems : function (type,desc,val){
            var newItem,ID;
            //ID = last id + 1
            
            if(data.allItems[type].length > 0){
            
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            }
            else {
                ID = 0;
            }
            
            if(type === "exp"){
                
                newItem = new Expense(ID,desc,val);
               
            }
            else if( type === 'inc'){
                
                newItem = new Income(ID,desc,val);


            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        
        deleteItem : function (type, id){
            var ids, index;
          ids = data.allItems[type].map(function(current){
              return current.id;
              
          });
            
            index = ids.indexOf(id);
            
            if(index !== -1){
                data.allItems[type].splice(index , 1);
            }
            
            
        },
        
        
        calculateBudget : function (){
            //calculate total budget and expense
            calculateTotal('exp');
            calculateTotal('inc');
            //calc budget : income - expense
            data.budget = data.totals.inc - data.totals.exp;
            
            //cal percentage of income used i.e expense
            if(data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }
            
            
        },
        
        calculatePerc : function(){
            data.allItems.exp.forEach(function(curr){
                curr.calcPerc(data.totals.inc);
                console.log(data.totals.inc);
            });
            
        },
        
        getPercs : function (){
            var allPerc = data.allItems.exp.map(function(curr){
                
                return curr.getPerc();
            });
            return allPerc;
        
            },
        
        getBudget : function (){
            
            return {
                budget : data.budget,
                totalinc : data.totals.inc,
                totalexp : data.totals.exp,
                perc : data.percentage
            };
        },
        
        testing : function (){
            console.log(data);
        }
    };   
})();
    
   //Some code
 

//UI controller
var UIController = (function(){
    var DOMStrings = {
        inputtype :'.add__type',
        inputDesc :'.add__description',
        inputValue :'.add__value',
        inputBtn  : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        budgetIncomeLabel : '.budget__income--value',
        budgetExpenseLabel : '.budget__expenses--value',
        perLabel : '.budget__expenses--percentage',
        container: '.container',
        expensePerc : '.item__percentage',
        dateLabel : '.budget__title--month'
    };
     formatNumber = function(val,type){
          var numSplit,int,dec;
            val = Math.abs(val);
            val =val.toFixed(2);
            console.log(val);
            
            numSplit = val.split('.');
            int = numSplit[0];
            
            if(int.length > 3){
                int = int.substr(0,int.length -3) + ',' + int.substr(int.length - 3,3);
            }
            
            dec = numSplit[1];
            
            return (type === 'exp' ? '-' : '+') + ' ' +int + '.' + dec;
        };
    var nodeListForEach = function(list, callback){
                for(var i =0; i<list.length;i++){
                    callback(list[i],i);
                }
                
            };
    
    return {
        getInput : function(){
            
        return {
            type : document.querySelector(DOMStrings.inputtype).value,
            desc : document.querySelector(DOMStrings.inputDesc).value,
            value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
                
    };
        
        
},
        addListItem : function(obj,type){
            var html, newhtml,element;
            
            if(type === 'inc'){
             element = DOMStrings.incomeContainer;   
             html ='<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if( type === 'exp'){
            element = DOMStrings.expenseContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newhtml = html.replace('%id%',obj.id);
            newhtml = newhtml.replace('%desc%',obj.desc);
            newhtml =newhtml.replace('%value%',formatNumber(obj.value,type));
        
            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
        
        },
        
        displayBudget : function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMStrings.budgetIncomeLabel).textContent = formatNumber(obj.totalinc,'inc');
            document.querySelector(DOMStrings.budgetExpenseLabel).textContent = formatNumber(obj.totalexp,'exp');
            
            
            if(obj.perc > 0)
            {
                document.querySelector(DOMStrings.perLabel).textContent = obj.perc + '%';
            }
            else{
                document.querySelector(DOMStrings.perLabel).textContent = '---';
            }
        },
        
        deleteListItem : function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearFields : function (){
          var fields, fieldsarr;
            fields = document.querySelectorAll(DOMStrings.inputDesc + ',' + DOMStrings.inputValue);
            
            fieldsarr = Array.prototype.slice.call(fields);
            
            fieldsarr.forEach(function(current,index,array){
                current.value="";
                
            })
            fieldsarr[0].focus();
            
        },
        
        displayPercentage : function(perc){
            
            var fields = document.querySelectorAll(DOMStrings.expensePerc);
            
            
            nodeListForEach(fields,function(current,index){
               if(perc[index] > 0){
                   current.textContent = perc[index] + '%';
               }              
                else{
                    current.textContent = '---';
                }
                
            });
            
            
            
        },
        
         displayMonth : function(){
             
          var now = new Date();
             var year = now.getFullYear();
             var month = now.getMonth();  
             
             
             var months = ['Jan','Feb','Mar','April','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];    document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ', ' + year;
             
         },
        
        changedType : function (){
            
       var fields =  document.querySelectorAll(DOMStrings.inputtype + ',' +DOMStrings.inputDesc + ',' + DOMStrings.inputValue);
        
        nodeListForEach(fields,function(curr){
           curr.classList.toggle('red-focus'); 
            
            
        });   
         
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
            
        },
        
        getDOMStrings : function (){
            return DOMStrings;
        }
        };
    
})();


//App controller
var Controller = (function (budgetCtrl,UICtrl){
   
    
    var setupEventListeners = function(){
    var DOM = UICtrl.getDOMStrings();     
    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
    
    document.addEventListener('keypress',function(evt){
        if(evt.keyCode === 13 || evt.which === 13){
            ctrlAddItem();
        }
        
    });    
       
        
    document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    document.querySelector(DOM.inputtype).addEventListener('change',UICtrl.changedType);    
    };
    
    var updateBudget = function(){
        
        //cal the budget
        budgetCtrl.calculateBudget();
       
        var budget = budgetCtrl.getBudget();
       //Display the budget on UI.
        UICtrl.displayBudget(budget);
        
    };
    
   
    var ctrlAddItem = function(){
    var input ,newItem;   
    
       // get input from fields
       input =  UICtrl.getInput();
       //  console.log(input);
       //add item to budget module
        if(input.desc && input.value >0 && !isNaN(input.value) ){
       newItem = budgetCtrl.addItems(input.type, input.desc, input.value);
        
       //add the item to ui
       UICtrl.addListItem(newItem, input.type);
       //Clearing the fields
        UICtrl.clearFields();
        
       updateBudget();
            updatePerc();
        }
    };
    
    var updatePerc = function(){
        
      //Calc perc
        budgetCtrl.calculatePerc();
        
      //Read perc from budget controller 
        var perc = budgetCtrl.getPercs();
        
        //console.log(perc);
      //Update the UI with new Perc
        UICtrl.displayPercentage(perc);
    };
    
    var ctrlDeleteItem = function(evt){
        var itemID, splitID, ID, type;
        
        itemID = evt.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);
        if(itemID){
            splitID =  itemID.split('-');
            type =splitID[0];
            ID = parseInt(splitID[1]);
            //  console.log(type + ' '+ ID);
            budgetCtrl.deleteItem(type, ID);
            
            
            UICtrl.deleteListItem(itemID);
            updateBudget();
            updatePerc();
        }
        
        // delete item from data
        
        
        // delete item from UI
        
        
        //update and show the new budget
        
        
        
        
    };
       return {
           init : function(){
               
               console.log('Application has Started');
               UICtrl.displayMonth();
               UICtrl.displayBudget({
                   budget : 0,
                totalinc : 0,
                totalexp : 0,
                perc : -1});
               
               setupEventListeners();
           }
       };
       
    
       
   
       
       
})(budgetController,UIController);
 

Controller.init();