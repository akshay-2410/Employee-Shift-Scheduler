let fromDate = $(".from-date")[0], toDate = $(".to-date")[0];
let months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let weekdays = $(".weekday")
let weekStart = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()));
let weekEnd = new Date(new Date().setDate(new Date().getDate() +(6 - new Date().getDay())));
let mainModal = $(".shift-modal")[0]
let drag = $(".shiftCell")
let last = '0'
let form_input = $('.form-input')
let form_select = $('.form-input-select')
let avail_shifts = $('.avail-shifts')
let cell =0 
let form = document.getElementById('formshift')

displayDate()
getShifts()

function setId(){
    for(let i = 0; i < drag.length; i++){
        drag[i].id = weekStart.getDate()+months[weekStart.getMonth()]+weekStart.getFullYear()+'-'+i
        
    }
}

setId()
show_data()

if (localStorage.key('last')){
    $('.shifts_list')[0].classList.add('btn-primary')
}else{
    $('.shifts_list')[0].classList.add('btn-secondary')
    $('.shifts_list')[0].classList.remove('btn-primary')
}

function displayDate(){
    fromDate.innerHTML = months[weekStart.getMonth()] + " " + weekStart.getDate() + " " + weekStart.getFullYear()
    toDate.innerHTML = months[weekEnd.getMonth()] + " " + weekEnd.getDate() + " " + weekEnd.getFullYear()
    weekdays.map((index, item)=>{
        const curr_date = new Date(weekStart)
        curr_date.setDate(weekStart.getDate() + index)
        item.innerHTML = (days[weekStart.getDay()+index]) + ' - ' + curr_date.getDate()
        
    })
}
function getShifts(){
    let last_shift = localStorage.getItem('last')
    avail_shifts.html('')
    for (let i = 0; i <= last_shift; i++){
        if(localStorage.getItem(i)){
            avail_shifts.append("<li class = 'd-flex justify-content-between ps-3 pe-3'>"+localStorage.getItem(i)+"<i id='"+ i +"'  class='fa-solid fa-trash text-danger shift-name-del'></i></li>")
        }
    }
}

$('.shift-name-del').click((e)=>{
    localStorage.removeItem(e.target.id)
    getShifts()
    $('.dropdown-toggle').attr('aria-expanded',true)
})



function formHandler(){
    if($("#shiftInput")[0].value){
        if (localStorage.key('last')){
            localStorage.setItem(+localStorage.getItem('last')+1, $("#shiftInput")[0].value)
            localStorage.setItem('last', +localStorage.getItem('last')+1)
            last = +localStorage.getItem('last')+1
        }else{
            localStorage.setItem(last, $("#shiftInput")[0].value)
            localStorage.setItem('last', 0)
            $('.shifts_list')[0].classList.remove('btn-secondary')
            $('.shifts_list')[0].classList.add('btn-primary')
        }
    }
    avail_shifts.html('')
    console.log($('.get-shift'))
    $('.get-shift')[0].value = ''
    console.log($('.get-shift'))
    getShifts() 
}
$('#prev_btn').click((e)=>{
    prevDate()
    setId()
    show_data()
})
$('#next_btn').click((e)=>{
    nextDate()
    setId()
    show_data()
})
function nextDate(){
    let newWeekStart = new Date(weekStart)
    let newWeekEnd = new Date(weekEnd)
    newWeekStart.setDate(newWeekStart.getDate() + 7)
    newWeekEnd.setDate(newWeekEnd.getDate() + 7)
    fromDate.innerHTML = months[newWeekStart.getMonth()]+' '+ newWeekStart.getDate() + ' '+ newWeekStart.getFullYear()
    toDate.innerHTML = months[newWeekEnd.getMonth()]+' '+ newWeekEnd.getDate() + ' '+ newWeekEnd.getFullYear()
    weekStart = newWeekStart
    weekEnd = newWeekEnd
    weekdays.map((index, item)=>{
        const curr_date = new Date(weekStart)
        curr_date.setDate(weekStart.getDate() + index)
        item.innerHTML = (days[weekStart.getDay()+index]) + ' - ' + curr_date.getDate()
        
    })
}

function prevDate(){
    let newWeekStart = new Date(weekStart)
    let newWeekEnd = new Date(weekEnd)
    newWeekStart.setDate(newWeekStart.getDate() - 7)
    newWeekEnd.setDate(newWeekEnd.getDate() - 7)
    fromDate.innerHTML = months[newWeekStart.getMonth()]+' '+ newWeekStart.getDate() + ' '+ newWeekStart.getFullYear()
    toDate.innerHTML = months[newWeekEnd.getMonth()]+' '+ newWeekEnd.getDate() + ' '+ newWeekEnd.getFullYear()
    weekStart = newWeekStart
    weekEnd = newWeekEnd
    weekdays.map((index, item)=>{
        const curr_date = new Date(weekStart)
        curr_date.setDate(weekStart.getDate() + index)
        item.innerHTML = (days[weekStart.getDay()+index]) + ' - ' + curr_date.getDate()
        
    })
}

function cellHandler(parentElement){
    mainModal.classList.add('show', 'd-flex', 'justify-content-center', 'align-items-center')

    $('.modal-content')[0].style.height = 'auto'
    alert(Boolean(!$('.shift-save')[0].id))
    
    if(!($('.shift-save')[0].id)){
        form_input.map((index,element) => {
            element.value = ''
        });
        form_select.html('')
        for(let i=0; i<avail_shifts[0].children.length; i++){
            form_select.append('<option>'+avail_shifts[0].children[i].innerHTML+'</option>');
        }
        date = new Date(weekStart)
        date.setDate(date.getDate()+parentElement.id.split('-')[1]%7)
        $('.form-input-date')[0].value = date.getFullYear()+'-'+ String(+date.getMonth()+ +1).padStart(2,0)+'-'+String(date.getDate()).padStart(2,0)
        cell = parentElement.id
    }else{
        shift = JSON.parse(localStorage.getItem(parentElement.id))
        form_select.html('')
        for(let i=0; i<avail_shifts[0].children.length; i++){
            form_select.append('<option>'+avail_shifts[0].children[i].innerHTML+'</option>');
        }
        form_input[0].value = shift.start
        form_input[1].value = shift.end
        form_input[3].value = shift.date

    }
}

$('.clear').click((e)=>{
    localStorage.clear()
    show_data()
    location.reload()
})

$(".shift-save").click((e)=>{
    mainModal.classList.remove('show', 'd-flex', 'justify-content-center', 'align-items')
    
    if(!$('.shift-save')[0].id){
        if(!localStorage.getItem(cell)){
            localStorage.setItem(cell, 0)
        }
        if(form_input[0].value && form_input[1].value && form_input[2].value && form_input[3].value){
            let shift = {
                start:form_input[0].value,
                end:form_input[1].value,
                name:form_input[2].value,
                date:form_input[3].value,
            }
            localStorage.setItem(cell+'~'+localStorage.getItem(cell), JSON.stringify(shift))
            localStorage.setItem(cell, +localStorage.getItem(cell)+ +1)
            console.log(cell+'~'+(+localStorage.getItem(cell)-1))
            
            $('#'+(cell+'~'+(+localStorage.getItem(cell)-1)).split('~')[0]).append('<div id = "'+cell+'~'+(+localStorage.getItem(cell)-1)+'" class="shiftdata border border-dark rounded-3 mt-1 d-flex justify-content-around "><div class "d-flex flex-column justify-content-center align-items-center"><p class="shift-detail">Start : '+shift.start+'</p><p class="shift-detail">End : '+shift.end+'</p><p class="shift-detail">Name :'+ shift.name+'</p></div><div class="d-flex flex-column justify-content-around"><i id = "'+cell+'~'+(+localStorage.getItem(cell)-1)+"_edit"+'" class="fa-solid fa-pen-to-square crud_btn text-primary"></i><i id = "'+cell+'~'+(+localStorage.getItem(cell)-1)+"_del"+'" class="fa-solid fa-trash crud_btn text-danger"></i></div></div>')
        }
    }else{
        if(form_input[0].value && form_input[1].value && form_input[2].value && form_input[3].value){
            let shift = {
                start:form_input[0].value,
                end:form_input[1].value,
                name:form_input[2].value,
                date:form_input[3].value,
            }

            localStorage.setItem(parentElement.id, JSON.stringify(shift))
            show_data()
            $('.shift-save')[0].id = ''
        }
    }
    
})

$(".close").click(()=>{
    mainModal.classList.remove('show', 'd-flex', 'justify-content-center', 'align-items')
})

$(".btn-close").click(()=>{
    mainModal.classList.remove('show', 'd-flex', 'justify-content-center', 'align-items')
})

$(document).click((e)=>{
    if (e.target.classList.contains('shift-modal')){
        mainModal.classList.remove('show', 'd-flex', 'justify-content-center', 'align-items')
    }
    if(e.target.classList.contains('shift-detail')){
        parentElement = e.target.parentElement.parentElement.parentElement
        
        cellHandler(parentElement)
    }else if(e.target.classList.contains('shiftdata')){
        parentElement = e.target.parentElement
        cellHandler(parentElement)
    }else if(e.target.classList.contains('shiftCell')){
        parentElement = e.target
        cellHandler(parentElement)
    }else if(e.target.classList.contains('crud_btn')){
        if(e.target.id.includes('_edit')){
            parentElement =  e.target.parentElement.parentElement
            $('.shift-save')[0].id = 'shift-edit'
            cellHandler(parentElement)
            
        }else if(e.target.id.includes('_del')){
            console.log(e.target.id)
            localStorage.removeItem(e.target.id.split('_')[0])
            show_data()
        }
    }else if(e.target.classList.contains('add-shift')){
        parentElement = e.target.parentElement.parentElement
        cellHandler(parentElement)
    }
    

})
function show_data(){
    for(let i =0; i < drag.length; i++){
        drag[i].innerHTML = ''
    }
    for(let i=0; i<localStorage.length; i++){
        if (localStorage.key(i).split('~').length > 1){
            let shift = JSON.parse(localStorage.getItem(localStorage.key(i)))
            $('#'+localStorage.key(i).split('~')[0]).append('<div id="'+ localStorage.key(i) +'" class="shiftdata border border-dark rounded-3 mt-1 d-flex justify-content-around "><div class ="add-shift d-flex flex-column justify-content-center align-items-center"><p class="shift-detail">Start : '+shift.start+'</p><p class="shift-detail">End : '+shift.end+'</p><p class="shift-detail">Name :'+ shift.name+'</p></div><div class="d-flex flex-column justify-content-around"><i id = "'+ localStorage.key(i)+"_edit" +'" class="fa-solid fa-pen-to-square text-primary crud_btn"></i><i id = "'+ localStorage.key(i)+"_del" +'" class="fa-solid fa-trash text-danger crud_btn"></i></div></div>')
        }
    }
}
