const storageKey = "TodoArray";
let existingArray=[];


document.querySelector("form").addEventListener("submit",async (event)=>{
    event.preventDefault();
    const todoInput = document.getElementById("todo");
    const todo=document.getElementById("todo").value.trim();
    if(!todo)
    return

    try {
        const response = await fetch('http://localhost:5000/todo/createTodo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ todoName: todo }),
        });

        if (!response.ok) {
            throw new Error('Failed to create todo');
        }

        const data = await response.json();
        console.log(data)
        const addedTodo=data.todo
        console.log(addedTodo)
        display(addedTodo)
        todoInput.value = '';
    } catch (error) {
        console.error('Error creating todo:', error);
    }

})

function display(item)
{
    let displayDiv=document.querySelector("#display")

    const newDiv=document.createElement("div")
    newDiv.id=item._id;

    const input=document.createElement("input")
    input.type="text"
    input.value=item.todoName;
    input.style.border="0px"
    input.style.background="white"
    input.disabled=true;
    input.id="input"+item._id

    const check=document.createElement("button");
    const uncheck=document.createElement("button");
    const edit=document.createElement("button");
    const save=document.createElement("button");
    const deleteBtn=document.createElement("button")
    
    save.style.display="none"
    save.textContent="Save"
    check.textContent="Check"
    uncheck.textContent="Uncheck"
    edit.textContent="Edit"
    deleteBtn.textContent="Delete"
    if(item.checked)
    {
        input.style.textDecoration="line-through"
        uncheck.style.display="block"
        check.style.display="none"
        edit.disabled=true;
    }
    else{
        uncheck.style.display="none"
    }
    newDiv.appendChild(input)
    newDiv.appendChild(edit)
    newDiv.appendChild(save)
    newDiv.appendChild(deleteBtn)
    newDiv.appendChild(check)
    newDiv.appendChild(uncheck)
    newDiv.style.display="flex"
    newDiv.style.gap="10px"
    displayDiv.appendChild(newDiv)
}

async function showDisplay() {

    try {
        const response = await fetch('http://localhost:5000/todo/getTodo');
        if (!response.ok) {

            throw new Error('Failed to fetch todos');
        }
        const data=await response.json();
        const existingArray = data.data
        console.log(existingArray)
        let displayDiv=document.querySelector("#display")
        displayDiv.innerHTML=""
        existingArray.forEach((item, index) => {
            display(item);
        });
    } catch (error) {
        console.error('Error loading todos:', error);
    } 
}

document.querySelector("#display").addEventListener("click",(event)=>{
    const targetDiv=event.target.closest("div")
    console.log(targetDiv);
    let input =targetDiv.childNodes[0];
    let editBtn=targetDiv.childNodes[1] //edit button
    let saveBtn=targetDiv.childNodes[2] //edit button
    let deleteBtn=targetDiv.childNodes[3]//DELETE BTN
    let checkBtn=targetDiv.childNodes[4] //check button
    let uncheckBtn=targetDiv.childNodes[5] //uncheck button

    if(event.target.textContent==="Edit")
    {
        checkBtn.disabled=true;
        console.log("Edit")
        input.disabled=false;
        input.style.border="1px solid black"
        saveBtn.style.display="block"
        editBtn.style.display="none"
        
    }
    else if (event.target.textContent==="Save")
    {
       const todo=input.value;
        
        async function saveChange(params) {
            try{
                const response=await fetch('http://localhost:5000/todo/updateTodo',{
                    method:'PUT',
                    headers:{  
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({id:targetDiv.id,todoName:todo})
                })
                if (!response.ok) {
                    throw new Error('Failed to create todo');
                }
                const data = await response.json();
                console.log(data);
                checkBtn.disabled=false;
                saveBtn.style.display="none"
                editBtn.style.display="block"
                input.style.border="0px"
                input.disabled=true;

            }
            catch(error)
            {
                console.error('Error creating todo:', error);
            }
        }
        saveChange();
    }
    else if(event.target.textContent==="Delete"){
        console.log("delete")
        
        async function deleteTodo() {
            try{
                const response=await fetch('http://localhost:5000/todo/deleteTodo',{
                    method:'DELETE',
                    headers:{  
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({id:targetDiv.id})
                })
                if (!response.ok) {
                    throw new Error('Failed to create todo');
                }

                let div = document.getElementById(targetDiv.id);
                div.remove();

            }
            catch(error)
            {
                console.log("error while  deleting",error);

            }
        }
        deleteTodo()
    }
    else if(event.target.textContent==="Check")
    {
        console.log("Check")

        async function checkTodo(){
            try{
                const response=await fetch('http://localhost:5000/todo/checkTodo',{
                    method:'PUT',
                    headers:{  
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({id:targetDiv.id,checked:true})
                })
                if (!response.ok) {
                    throw new Error('Failed to create todo');
                } 
                input.style.textDecoration="line-through"
        
                checkBtn.style.display="none"
                uncheckBtn.style.display="block"
                editBtn.disabled=true;
            }
            catch(error)
            {
                console.log("error while marking check",error)
            }
        }
        checkTodo();
    }
    else if(event.target.textContent==="Uncheck")
        {
            console.log("un-Check")
    
            async function checkTodo(){
                try{
                    const response=await fetch('http://localhost:5000/todo/checkTodo',{
                        method:'PUT',
                        headers:{  
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify({id:targetDiv.id,checked:false})
                    })
                    if (!response.ok) {
                        throw new Error('Failed to create todo');
                    } 
                    input.style.textDecoration="none"
            
                    checkBtn.style.display="block"
                    uncheckBtn.style.display="none"
                    editBtn.disabled=false;
                }
                catch(error)
                {
                    console.log("error while marking check",error)
                }
            }
            checkTodo();
        }
})

showDisplay()
    
