// ===== DOM Elements =====
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const progressCount = document.getElementById('progress-count');

// ===== State =====
let todos = [];
let editingIndex = null;

// Load todos from localStorage
function loadTodos() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        try {
            todos = JSON.parse(stored);
        } catch (e) {
            todos = [];
        }
    }
    renderTodos();
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// ===== Progress Bar =====
function updateProgress() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% complete`;
    progressCount.textContent = `${completed}/${total} tasks`;
    
    // Change progress bar color based on completion
    if (percentage === 100 && total > 0) {
        progressFill.style.background = 'linear-gradient(90deg, #4ade80, #22c55e)';
    } else if (percentage >= 50) {
        progressFill.style.background = 'linear-gradient(90deg, #4ade80, #22d3ee, #818cf8)';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #fbbf24, #f59e0b)';
    }
}

// ===== Render Functions =====
function renderTodos() {
    // Clear list
    todoList.innerHTML = '';
    
    // Show/hide empty state
    if (todos.length === 0) {
        emptyState.style.display = 'block';
        todoList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        todoList.style.display = 'flex';
    }
    
    // Render each todo
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        if (todo.completed) {
            li.classList.add('completed');
        }
        if (editingIndex === index) {
            li.classList.add('editing');
        }
        
        // Toggle button (complete/incomplete)
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-btn';
        toggleBtn.innerHTML = todo.completed ? 
            '<i class="fa-regular fa-circle-check"></i>' : 
            '<i class="fa-regular fa-circle"></i>';
        toggleBtn.setAttribute('aria-label', todo.completed ? 'Mark as incomplete' : 'Mark as complete');
        toggleBtn.title = todo.completed ? 'Mark as incomplete' : 'Mark as complete';
        toggleBtn.addEventListener('click', () => toggleTodo(index));
        
        // Todo text
        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;
        
        // Edit input (hidden by default)
        const editInput = document.createElement('input');
        editInput.className = 'edit-input';
        editInput.type = 'text';
        editInput.value = todo.text;
        editInput.setAttribute('aria-label', 'Edit task');
        
        // Actions container
        const actions = document.createElement('div');
        actions.className = 'actions';
        
        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        if (editingIndex === index) {
            editBtn.classList.add('editing');
            editBtn.innerHTML = '<i class="fa-regular fa-check"></i>';
            editBtn.setAttribute('aria-label', 'Save edit');
            editBtn.title = 'Save edit';
        } else {
            editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square" aria-hidden="true"></i>';
            editBtn.setAttribute('aria-label', 'Edit task');
            editBtn.title = 'Edit task';
        }
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleEdit(index);
        });
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
        deleteBtn.setAttribute('aria-label', 'Delete task');
        deleteBtn.title = 'Delete task';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTodo(index);
        });
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        li.appendChild(toggleBtn);
        li.appendChild(textSpan);
        li.appendChild(editInput);
        li.appendChild(actions);
        
        // Enter key on edit input
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit(index);
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                cancelEdit(index);
            }
        });
        
        // Blur event to save on focus loss
        editInput.addEventListener('blur', () => {
            if (editingIndex === index) {
                saveEdit(index);
            }
        });
        
        todoList.appendChild(li);
    });
    
    updateCounter();
    updateProgress();
}

function updateCounter() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    taskCount.textContent = total;
    
    // Update footer button visibility
    if (completed > 0) {
        clearCompletedBtn.classList.add('visible');
        clearCompletedBtn.style.display = 'flex';
    } else {
        clearCompletedBtn.classList.remove('visible');
        clearCompletedBtn.style.display = 'none';
    }
}

// ===== CRUD Operations =====
function addTodo(text) {
    if (text.trim() === '') {
        // Shake animation for empty input
        taskInput.style.animation = 'shake 0.4s ease';
        setTimeout(() => {
            taskInput.style.animation = '';
        }, 400);
        return false;
    }
    
    todos.push({
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    });
    
    saveTodos();
    renderTodos();
    taskInput.value = '';
    taskInput.focus();
    return true;
}

function deleteTodo(index) {
    if (index >= 0 && index < todos.length) {
        // Animate deletion
        const items = todoList.children;
        if (items[index]) {
            items[index].style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                todos.splice(index, 1);
                if (editingIndex === index) editingIndex = null;
                else if (editingIndex > index) editingIndex--;
                saveTodos();
                renderTodos();
            }, 300);
        } else {
            todos.splice(index, 1);
            if (editingIndex === index) editingIndex = null;
            else if (editingIndex > index) editingIndex--;
            saveTodos();
            renderTodos();
        }
    }
}

function toggleTodo(index) {
    if (index >= 0 && index < todos.length) {
        todos[index].completed = !todos[index].completed;
        // If editing and completed, cancel edit
        if (editingIndex === index) {
            editingIndex = null;
        }
        saveTodos();
        renderTodos();
    }
}

function handleEdit(index) {
    if (editingIndex === index) {
        // Save the edit
        saveEdit(index);
    } else {
        // Start editing
        editingIndex = index;
        renderTodos();
        // Focus the edit input after render
        setTimeout(() => {
            const items = todoList.children;
            if (items[index]) {
                const input = items[index].querySelector('.edit-input');
                if (input) {
                    input.focus();
                    input.select();
                }
            }
        }, 50);
    }
}

function saveEdit(index) {
    if (editingIndex !== index) return;
    
    const items = todoList.children;
    if (items[index]) {
        const input = items[index].querySelector('.edit-input');
        if (input) {
            const newText = input.value.trim();
            if (newText === '') {
                // If empty, delete the task
                deleteTodo(index);
                return;
            }
            todos[index].text = newText;
        }
    }
    
    editingIndex = null;
    saveTodos();
    renderTodos();
}

function cancelEdit(index) {
    if (editingIndex === index) {
        editingIndex = null;
        renderTodos();
    }
}

function clearCompleted() {
    const hasCompleted = todos.some(t => t.completed);
    if (!hasCompleted) return;
    
    if (confirm('Delete all completed tasks?')) {
        todos = todos.filter(t => !t.completed);
        editingIndex = null;
        saveTodos();
        renderTodos();
    }
}

// ===== Event Listeners =====
// Form submit
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(taskInput.value);
});

// Clear completed
clearCompletedBtn.addEventListener('click', clearCompleted);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+C to clear completed
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        clearCompleted();
    }
    // Escape to cancel editing
    if (e.key === 'Escape' && editingIndex !== null) {
        cancelEdit(editingIndex);
    }
});

// ===== Shake Animation =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }
    
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.8); }
    }
`;
document.head.appendChild(styleSheet);

// ===== Initialize =====
loadTodos();
taskInput.focus();

console.log('✅ Todo App with Edit, Delete & Progress Bar initialized!');