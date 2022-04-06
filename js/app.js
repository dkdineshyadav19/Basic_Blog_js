//event listeners - will be invoked after DOM Content is loaded
function eventListeners(){
    const showBtn = document.getElementById("show-btn");
    const questionCard = document.querySelector(".question-card");
    const closeBtn = document.querySelector(".close-btn");
    const form = document.getElementById("question-form");
    const feedback = document.querySelector(".feedback");
    const questionInput = document.getElementById("question-input");
    const answerInput = document.getElementById("answer-input");
    const questionList = document.getElementById("questions-list");
    //let data = [];
    let id;

    //new ui instance
    const ui = new UI();
    //retrieve blog from local storage
    let data = ui.retrieveLocalStorgage();
    if (data.length > 0){
        id = (data[(data.length-1)].id)+1;
    } else {
        id = 1;
    }
    data.forEach(function(question){
        ui.addQuestion(questionList, question);
    })
    //show blog form
    showBtn.addEventListener('click', function(){
        ui.showQuestion(questionCard);
    });
    //hide blog form
    closeBtn.addEventListener('click', function(){
        ui.hideQuestion(questionCard);
    });
    //add blog
    form.addEventListener('submit', function(event){
        event.preventDefault();

        const questionValue = questionInput.value;
        const answerValue = answerInput.value;

        if(questionValue === '' || answerValue === ''){
            feedback.classList.add('showItem', 'alert-danger');
            feedback.textContent = 'cannot add empty values';

            setTimeout(function(){
                feedback.classList.remove('alert-danger', 'showItem');    
            }, 3000)
        } else {
            const question =  new Question(id, questionValue, answerValue);
            data.push(question);
            ui.addToLocalStorage(data);
            id++;
            ui.addQuestion(questionList, question)
            ui.clearFields(questionInput, answerInput);
        }
    });
  

    //work with blog Title
    questionList.addEventListener('click', function(event){
        event.preventDefault();
    if(event.target.classList.contains('delete-flashcard')){
        let id = event.target.dataset.id;

        questionList.removeChild(event.target.parentElement.parentElement.parentElement);
        // rest of data
        let tempData = data.filter(function(item){
            return item.id !== parseInt(id);
        });
        data = tempData;
        ui.addToLocalStorage(data);

    } else if (event.target.classList.contains('show-answer')){
            event.target.nextElementSibling.classList.toggle('showItem');
    } else if (event.target.classList.contains('edit-flashcard')){
        //delete blog from DOM
        let id = event.target.dataset.id;
        questionList.removeChild(event.target.parentElement.parentElement.parentElement);

        //show blog in a card
        ui.showQuestion(questionCard);
        //find specific blog clicked
        const tempQuestion = data.filter(function(item){
            return item.id === parseInt(id);
        });
        // rest of data
        let tempData = data.filter(function(item){
            return item.id !== parseInt(id);
        });
        data = tempData;
        questionInput.value = tempQuestion[0].title;
        questionInput.value = tempQuestion[0].answer;
    }  
    });
}
//refreshing page 
function refresh_content()
{
     location.reload();
}
//Contructor function responsible for the display
function UI(){
    //show  card
    UI.prototype.showQuestion = function(element){
        element.classList.add('showItem');
    }
    //hide blog card
    UI.prototype.hideQuestion = function(element){
        element.classList.remove('showItem');
    }
    //add blog 
    UI.prototype.addQuestion = function(element, question){
        const div = document.createElement('div');
        div.classList.add('col-md-4');
        div.innerHTML = `<div class="card card-body flashcard my-3">
        <h4 class="text-capitalize">${question.title}</h4>
        <a href="#" class="text-capitalize my-3 show-answer">Show/Hide Content</a>
        <h5 class="answer mb-3">${question.answer}</h5>
        <div class="flashcard-btn d-flex justify-content-between">
   
         <a href="#" id="edit-flashcard" class=" btn my-1 edit-flashcard text-uppercase" data-id="${question.id}">edit</a>
         <a href="#" id="delete-flashcard" class=" btn my-1 delete-flashcard text-uppercase" data-id="${question.id}">delete</a>
        </div>
       </div>`;
       element.appendChild(div);
    }
    //adding blog  to Local Storage
    UI.prototype.addToLocalStorage = function(data){
        localStorage.clear();
        const dataJSON = JSON.stringify(data);
        localStorage.setItem('flash-questions', dataJSON)
    }
    //retrieve blog from localStorage
    UI.prototype.retrieveLocalStorgage = function(){

        let savedQuestions = localStorage.getItem('flash-questions');
        if (savedQuestions){
            const savedQuestionsParsed = JSON.parse(savedQuestions);
            return savedQuestionsParsed;
        } else {
            return savedQuestions = [];
        }
        
    }

    //clear all fields
    UI.prototype.clearFields = function(question, answer){
        question.value = '';
        answer.value = '';
    }
}
//Constructor function responsible for each blog
function Question(id, title, answer){
    this.id = id;
    this.title = title;
    this.answer = answer;
}
// dom event listener to run when content is loaded
document.addEventListener('DOMContentLoaded', function(){
    eventListeners();
})