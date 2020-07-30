console.log("hello");

//querySelector is similar to getElementById
const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');// to grab element with the loading class
const msgElement = document.querySelector('.msgs');

const API_URL = "http://localhost:5000/msgs";



loadingElement.style.display = 'none'; 


listAllMsgs();

form.addEventListener('submit' , (event) => {
    //console.log("form was submitted"); // this will show and then disappear 

    event.preventDefault(); // this will stop browser from submitting the data
    
    //console.log("form was submitted nowwww");

    //to grab data
    const formData = new FormData(form);  //built-in to web browsers
    const name = formData.get('name'); // name is the name used in tag
    const content = formData.get('content'); // content -> name of tag

    const msg = {
        name , content
    };

    console.log(msg);

    //loading gif
    form.style.display = 'none'; 
    loadingElement.style.display = ''; 

    
    //fetch -> making req to a server

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(msg) ,
        headers:{
            'content-type' : 'application/json'
        }
    }).then(response => response.json())
    .then(createdMsg => {
        //console.log(createdMsg);
        
        form.reset();

        //form will be displayed after 30 seconds
        setTimeout(() => {
            form.style.display = ''; 
        }, 10000);
        
        listAllMsgs(); 
    });
});


function listAllMsgs(){
    msgElement.innerHTML = '';
    
    //get req so no need of any header or contenttype etc
    fetch(API_URL)
    .then(response => response.json())
    .then(msgs => {
        console.log(msgs);

        msgs.reverse();
        msgs.forEach(msg => {
            const div = document.createElement('div');

            const header = document.createElement('h3');
            header.textContent = msg.name;

            const contents =  document.createElement('p');
            contents.textContent = msg.content; 

            const date = document.createElement('small');
             date.textContent = new Date(msg.created);

            //to put these in a div
            div.appendChild(header);
            div.appendChild(contents);
            div.appendChild(date); 

            msgElement.appendChild(div);
        });
        loadingElement.style.display = 'none'; 
    });
}