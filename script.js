const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "studentPlannerTasks";
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

function updateDate() {
  const now = new Date();
  $("today").textContent = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  $("clock").textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); render(); }
function render() {
  const filter = $("filter").value;
  const shown = tasks.filter(t => filter === "all" || (filter === "completed" ? t.completed : !t.completed));
  $("totalCount").textContent = tasks.length;
  $("doneCount").textContent = tasks.filter(t => t.completed).length;
  $("pendingCount").textContent = tasks.filter(t => !t.completed).length;
  $("taskList").innerHTML = "";
  $("emptyState").hidden = shown.length > 0;
  shown.sort((a,b) => a.dueDate.localeCompare(b.dueDate)).forEach(task => {
    const item = document.createElement("article");
    item.className = "task" + (task.completed ? " completed" : "");
    const check = document.createElement("input");
    check.type = "checkbox"; check.checked = task.completed; check.setAttribute("aria-label", "Mark task complete");
    check.addEventListener("change", () => { task.completed = check.checked; save(); });
    const info = document.createElement("div"); info.className = "task-info";
    const title = document.createElement("strong"); title.textContent = task.name;
    const details = document.createElement("small"); details.textContent = `${task.subject || "General"} • Due ${task.dueDate}`;
    info.append(title, details);
    const tag = document.createElement("span"); tag.className = `tag ${task.priority}`; tag.textContent = task.priority;
    const del = document.createElement("button"); del.className = "delete"; del.textContent = "Delete"; del.type = "button";
    del.addEventListener("click", () => { tasks = tasks.filter(t => t.id !== task.id); save(); });
    item.append(check, info, tag, del); $("taskList").append(item);
  });
}
$("taskForm").addEventListener("submit", event => {
  event.preventDefault();
  tasks.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), name: $("taskName").value.trim(), subject: $("subject").value.trim(), dueDate: $("dueDate").value, priority: $("priority").value, completed: false });
  $("taskForm").reset(); save(); $("taskName").focus();
});
$("filter").addEventListener("change", render);
$("dueDate").value = new Date().toISOString().slice(0,10);
updateDate(); setInterval(updateDate, 30000); render();
