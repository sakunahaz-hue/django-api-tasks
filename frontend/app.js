const tasksList = document.getElementById('tasksList');
const taskForm = document.getElementById('taskForm');

const loadTasks = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/tasks/');
    const tasks = await response.json();

    tasksList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');

        const text = document.createElement('span');
        text.innerText = task.title + (task.done ? ' ✔️' : '');
        li.appendChild(text);

        // Botón completar
        const completeBtn = document.createElement('button');
        completeBtn.innerText = 'Completar';
        completeBtn.onclick = async () => {
            await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    done: true
                })
            });
            loadTasks();
        };
        li.appendChild(completeBtn);

        // Botón eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Eliminar';
        deleteBtn.onclick = async () => {
            await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}/`, {
                method: 'DELETE'
            });
            loadTasks();
        };
        li.appendChild(deleteBtn);

        tasksList.appendChild(li);
    });
};

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    await fetch('http://127.0.0.1:8000/api/tasks/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            description,
            done: false
        })
    });

    taskForm.reset();
    loadTasks();
});

loadTasks();