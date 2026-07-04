const titulo = document.getElementById("titulo")
const prioridade = document.getElementById("prioridade")
const tags = document.getElementById("tags")
const data = document.getElementById("data")
const descricao = document.getElementById("descricao")

const todo = document.getElementById("todo");
const doing = document.getElementById("doing")
const done = document.getElementById("done")
const fazerCount = document.getElementById("fazerCount")
const andamentoCount = document.getElementById("andamentoCount");
const feitoCount = document.getElementById("feitoCount");
const totalCount = document.getElementById("totalCount");

const formulario = document.getElementById("formulario")
const columns = document.querySelectorAll(".column")

const filterBox = document.getElementById("filterBox")
const filtro = document.getElementById("filtro")

var cardArrastado = null

function mostrarFormulario() {
  formulario.style.display = "block";
    titulo.focus()
}

function esconderFormulario(){
    formulario.style.display = "none";
    limparFormulario()
}

function mostrarFiltro(){
    if(filterBox.style.display === "none" || filterBox.style.display === ""){
        filterBox.style.display = "block"
    }else{
        filterBox.style.display = "none"
    }
}

function ativarDragNoCard(card){
     card.addEventListener("dragstart", function(){
        cardArrastado = card
        card.classList.add("dragging")
    })

    card.addEventListener("dragend", function(){
        card.classList.remove("dragging")
        cardArrastado = null
        
    });
}

function criarCard(){


    if(titulo.value.trim() === ""){
        alert("Digite uma tarefa")
        return
    }
    const card = document.createElement("div");
    card.className = "task";
    card.draggable = true;
    
    const listaTags = tags.value
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag !=="");

    var tagsHTML = ""

    listaTags.forEach(function(tag){
        tagsHTML += `<span class="tag"> ${tag}</span>`
    })

    const dataFormatada = data.value
    ? new Date(data.value).toLocaleDateString("pt-BR", {timeZone: "UTC"})
    : "SEM DATA"

    card.innerHTML = `
        <div class="task-header">
            <div class="task-title"> ${titulo.value} </div>
            <span class="priority ${prioridade.value}">
                ${prioridade.value.toUpperCase()}
            </span>
        </div>

        <p class="task-description">
        ${descricao.value || "Sem Descrição"}
        </p>

        <div class="task-footer">
            <div class="tags">
            ${tagsHTML}
            </div> 
        
            <span class="date"> ${dataFormatada}</span>
        </div>
    `

   
    ativarDragNoCard(card)
    todo.appendChild(card)
    //limparFormulario()
    esconderFormulario()
    atualizarContadores()
    salvarQuadro()
    filtrarTarefas()
}


function limparFormulario(){
    titulo.value = ""
    prioridade.value = "media"
    tags.value = ""
    data.value = ""
    descricao.value = ""
    titulo.focus()
}


columns.forEach(function(column){
    column.addEventListener("dragover", function(event){
        event.preventDefault()
        column.classList.add("over")
    })
    column.addEventListener("dragleave", function(){
        
        column.classList.remove("over")
    })
    column.addEventListener("drop", function(event){
        
        column.classList.remove("over")

        if(cardArrastado){
            column.appendChild(cardArrastado);
            card.classList.remove("dragging")
            if (column.id === "done") {
                cardArrastado.classList.add("done-card");
            } else {
                cardArrastado.classList.remove("done-card");
            }
            atualizarContadores();
            salvarQuadro()
            filtrarTarefas()
        }
    })
})

function atualizarContadores(){
    const quantidadeFazer = todo.querySelectorAll(".task").length
    const quantidadeAndamento = doing.querySelectorAll(".task").length
    const quantidadeFeito = done.querySelectorAll(".task").length
    const total = quantidadeFazer + quantidadeAndamento + quantidadeFeito

    fazerCount.textContent = quantidadeFazer;
    andamentoCount.textContent = quantidadeAndamento;
    feitoCount.textContent = quantidadeFeito;
    totalCount.textContent =  total;
}

function filtrarTarefas(){
    const valorfiltro = filtro.value
    const todosOsCards = document.querySelectorAll(".task")

    todosOsCards.forEach(function(card){
        card.style.display = "block";
        
        const estaNoAfazer = card.parentElement.id === "todo";
        const estaNoAndamento = card.parentElement.id === "doing";
        const estaNoFeito = card.parentElement.id === "done";

        const prioridadeAlta = card.querySelector(".priority").classList.contains("alta")
        const prioridadeMedia = card.querySelector(".priority").classList.contains("media")
        const prioridadeBaixa = card.querySelector(".priority").classList.contains("baixa")

        if(valorfiltro === "afazer" && !estaNoAfazer){
            card.style.display = "none"
        }

        if(valorfiltro === "andamento" && !estaNoAndamento){
            card.style.display = "none"
        }

        if(valorfiltro === "feito" && !estaNoFeito){
            card.style.display = "none"
        }

        if(valorfiltro === "alta" && !prioridadeAlta){
            card.style.display = "none"
        }

        if(valorfiltro === "media" && !prioridadeMedia){
            card.style.display = "none"
        }

        if(valorfiltro === "baixa" && !prioridadeBaixa){
            card.style.display = "none"
        }
    })
}

function salvarQuadro(){
    localStorage.setItem("tarefasAFazer", todo.innerHTML)
    localStorage.setItem("tarefasAndamentos", doing.innerHTML)
    localStorage.setItem("tarefasFeitas", done.innerHTML)
}

function carregarQuadro(){
    const tarefasAFazer = localStorage.getItem("tarefasAFazer")
    const tarefasAndamentos = localStorage.getItem("tarefasAndamentos")
    const tarefasFeitas = localStorage.getItem("tarefasFeitas")

    if(tarefasAFazer){
        todo.innerHTML = tarefasAFazer
    }
    if(tarefasAndamentos){
        doing.innerHTML = tarefasAndamentos
    }
    if(tarefasFeitas){
        done.innerHTML = tarefasFeitas;
    }

    const todosCards = document.querySelectorAll(".task")

    todosCards.forEach(function(card){
        card.draggable = true
        card.classList.remove("dragging")
        ativarDragNoCard(card);
    })
    atualizarContadores()
    filtrarTarefas()
}

carregarQuadro()


    