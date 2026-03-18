// Updated app.js with new Roles & Permissions + 3D cards movement
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
const sections = {
  dashboard: document.getElementById('dashboard-section'),
  tasks: document.getElementById('tasks-section'),
  calendar: document.getElementById('calendar-section'),
  team: document.getElementById('team-section'),
  founder: document.getElementById('founder-tools-section')
};
function showSection(name){ for(const s in sections) sections[s].classList.add('hidden'); sections[name].classList.remove('hidden'); }
document.getElementById('dashboard-link').onclick=()=>showSection('dashboard');
document.getElementById('tasks-link').onclick=()=>showSection('tasks');
document.getElementById('calendar-link').onclick=()=>showSection('calendar');
document.getElementById('team-link').onclick=()=>showSection('team');
document.getElementById('founder-tools-link').onclick=()=>showSection('founder');
document.getElementById('logout-btn').onclick=async()=>{await supabase.auth.signOut(); window.location.href='index.html';};
async function loadTeam(){
  const {data: team} = await supabase.from('users').select('*').eq('role','team');
  document.getElementById('team-list').innerHTML = team.map(t=>`<div class="team-item glass-card"><h4>${t.username}</h4><p>Status: <span class="${Math.random()>0.5?'online':'offline'}">${Math.random()>0.5?'Online':'Offline'}</span></p></div>`).join('');
}
loadTeam();
document.getElementById('content-upload').addEventListener('change', async (e)=>{
  for(let file of e.target.files){
    const fileName = `${Date.now()}_${file.name}`;
    await supabase.storage.from('content').upload(fileName,file);
    await supabase.from('tasks').insert([{title:file.name.split('.')[0],desc:'Auto-generated',status:'pending'}]);
  }
  alert('Files uploaded and tasks created!');
  loadTasks();
});
document.getElementById('new-task-btn')?.addEventListener('click', ()=>{
  createModal('Create Task',`<input id="task-title" placeholder="Task Title"/><textarea id="task-desc" placeholder="Task Desc"></textarea><input type="date" id="task-deadline"/>`, async ()=>{
    const title=document.getElementById('task-title').value;
    const desc=document.getElementById('task-desc').value;
    const deadline=document.getElementById('task-deadline').value;
    const {data: members}=await supabase.from('users').select('username').eq('role','team');
    const assignedTo = members[Math.floor(Math.random()*members.length)].username;
    await supabase.from('tasks').insert([{title,desc,deadline,assigned_to:assignedTo,status:'pending'}]);
    alert('Task assigned to '+assignedTo);
    loadTasks();
  });
});
async function loadTasks(){
  const {data: tasks}=await supabase.from('tasks').select('*');
  document.getElementById('tasks-list').innerHTML = tasks.map(t=>`<div class="task-item glass-card"><h4>${t.title}</h4><p>${t.desc}</p><small>Assigned to: ${t.assigned_to} | Status: ${t.status}</small></div>`).join('');
}
loadTasks();
document.getElementById('add-user-btn')?.addEventListener('click', ()=>{
  createModal('Add User',`<input id="new-user-username" placeholder="Username"/><input id="new-user-password" placeholder="Password"/><select id="new-user-role"><option value="user">User</option><option value="marketing-lead">Marketing Lead</option><option value="sales-lead">Sales Lead</option></select>`, async ()=>{
    const username=document.getElementById('new-user-username').value;
    const password=document.getElementById('new-user-password').value;
    const role=document.getElementById('new-user-role').value;
    await supabase.auth.signUp({email:`${username}@onvo.local`,password});
    await supabase.from('users').insert([{username,role}]);
    alert('User added!');
    loadUsers();
  });
});
async function loadUsers(){
  const {data: users}=await supabase.from('users').select('*');
  document.getElementById('users-list').innerHTML = users.map(u=>`<div class="user-item">${u.username} (${u.role})</div>`).join('');
}
loadUsers();
// 3D interactive cards movement
document.querySelectorAll('.card-3d').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  });
});