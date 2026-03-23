let habits=[];
let points=0;
let weeklyData=[0,0,0,0,0,0,0];
let chart=null;

window.onload = function(){
let savedHabits = localStorage.getItem("habits");

let savedPoints = localStorage.getItem("points");

let savedWeekly = localStorage.getItem("weeklyData");

if(savedHabits){
habits = JSON.parse(savedHabits);
}

if(savedPoints){
points = parseInt(savedPoints);
document.getElementById("points").innerText = points;
}

if(savedWeekly){
weeklyData = JSON.parse(savedWeekly);
}

let today=new Date().toDateString();
let lastDate=localStorage.getItem("lastDate");
if(lastDate!==today)
{
    habits.forEach(habit=>{habit.completed=false;});
    localStorage.setItem("lastDate",today);
    saveData();
}
habits.forEach(habit=>{
    if(habit.streak===undefined){
        habit.streak=0;
    }
});
displayHabits();
generateChart();
updateProgress();
updateTotalStreak();
updateStatistics();
checkBadge();
}

function addHabit(){      //habbit add chestham
    let input=document.getElementById("habitinput");
    let habit=input.value;
    let category=document.getElementById("category").value;
    if(habit==="")return;
    habits.push({name:habit,category:category,completed:false,streak:0});
    displayHabits();
    saveData();
    input.value="";
}

function displayHabits(){
    let list=document.getElementById("habitlist");
    list.innerHTML="";
    habits.forEach((habit,index)=>{
        let li=document.createElement("li");
        if(habit.completed)
        {
            li.classList.add("completed");
            li.innerHTML="[ " + habit.category + " ] " + habit.name + " ✔ 🔥 " + (habit.streak || 0);
        }
        else
        {
            li.innerHTML="[ " + habit.category + " ] " + habit.name+"<button onclick='completeHabit("+index+")'>Done</button>"+"<button onclick='editHabit("+index+")'>Edit</button>"+"<button onclick='deleteHabit("+index+")'>Delete</button>";
        }
        list.appendChild(li);
    });
}

function completeHabit(index){
    habits[index].completed=true;
    habits[index].streak++;
    points+=10;
    document.getElementById("points").innerText=points;
    let today=new Date().getDay();
    weeklyData[today]++;
    displayHabits();
    generateChart();
    updateProgress();
    updateTotalStreak();
    updateStatistics();
    checkBadge();
    saveData();
}

function generateChart(){
let ctx = document.getElementById("weeklyChart").getContext("2d");
if(chart)
{
    chart.destroy();
}
chart=new Chart(ctx,{
type:'bar',
data:{
labels:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
datasets:[{
label:"Habits Completed",
data:weeklyData,
backgroundColor:"green"
}]
},
options:{
    scales:{
        y:{
            beginAtZero:true,
            ticks:{
                stepSize:1
            }
        }
    }
}
});
}

function deleteHabit(index){
    habits.splice(index,1);
    displayHabits();
    updateProgress();
    updateTotalStreak();
    updateStatistics();
    saveData();
}

function updateProgress()
{
    let total=habits.length;
    let completed=habits.filter(habit=>habit.completed).length;
    let percent=0;
    if(total>0)
    {
        percent=Math.round((completed/total)*100);
    }
    document.getElementById("progress").innerText="Today's Progress: " + percent + "%";
    document.getElementById("progressFill").style.width=percent + "%";
}

function saveData()
{
    localStorage.setItem("habits",JSON.stringify(habits));
    localStorage.setItem("points",points);
    localStorage.setItem("weeklyData",JSON.stringify(weeklyData));
}

function resetData(){
    localStorage.clear();
    location.reload();
}

function updateTotalStreak(){
    let total=habits.reduce((sum,habit)=>sum+(habit.streak || 0),0);
    document.getElementById("totalStreak").innerText="🔥Total Streaks: "+ total;
}

function checkBadge()
{
    let total=habits.reduce((sum,habit)=>sum+(habit.streak || 0),0);
    let badgeText="🏆Badge: None";
    if(total>=100)
    {
        badgeText="🏆 Gold Badge";
    }
    else if(total>=30)
    {
        badgeText="🏆 Silver Badge";
    }
    else if(total>=7)
    {
        badgeText="🏆 Bronze Badge";
    }
    document.getElementById("badge").innerHTML=badgeText;
}

function editHabit(index){
    let newName=prompt("Edit habit name:",habits[index].name);
    if(newName && newName.trim()!==""){
        habits[index].name=newName;
        displayHabits();
        saveData();
    }
}

function searchHabit(){
    let searchText=document.getElementById("search").value.toLowerCase();
    let list=document.getElementById("habitlist");
    let items=list.getElementsByTagName("li");
    for(let i=0;i<items.length;i++)
    {
        let text=items[i].innerText.toLowerCase();
    if(text.includes(searchText)){
        items[i].style.display="block";
    }
    else{
        items[i].style.display="none";
    }
}
}

function sortHabits(){
    let type=document.getElementById("sort").value;
    if(type==="streak"){
        habits.sort((a,b)=>b.streak-a.streak);
    }
    else if(type==="category"){
        habits.sort((a,b)=>a.category.localeCompare(b.category));
    }
    else if(type==="name"){
        habits.sort((a,b)=>a.name.localeCompare(b.name));
    }
    displayHabits();
    saveData();
}

function updateStatistics(){
    let total=habits.length;
    let completed=habits.filter(h=>h.completed).length;
    let pending=total-completed;
    let rate=0;
    if(total>0)
    {
        rate=Math.round((completed/total)*100);
    }
    document.getElementById("totalHabits").innerText="Total Habits: "+total;
    document.getElementById("completedHabits").innerText="Completed Habits: "+completed;
    document.getElementById("pendingHabits").innerText="Pending: "+pending;
    document.getElementById("successRate").innerText="Success Rate: "+ rate + "%";
}
