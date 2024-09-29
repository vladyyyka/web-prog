const app = Vue.createApp({
    data() {
      return {
        tasks: [],
        newTaskText: '',
        editingTask: null
      };
    },
    methods: {
      fetchTasks() {
        fetch('/api/tasks')
          .then(response => response.json())
          .then(data => {
            this.tasks = data;
          });
      },
      addTask() {
        if (this.editingTask) {
          fetch(`/api/tasks/${this.editingTask.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: this.newTaskText, completed: this.editingTask.completed })
          })
            .then(response => response.json())
            .then(updatedTask => {
              const index = this.tasks.findIndex(task => task.id === updatedTask.id);
              this.tasks[index] = updatedTask; 
              this.editingTask = null; 
            });
        } else {
          fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: this.newTaskText, completed: false })
          })
            .then(response => response.json())
            .then(newTask => {
              this.tasks.push(newTask);
            });
        }
        this.newTaskText = '';
      },
      deleteTask(taskId) {
        fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE'
        })
          .then(() => {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
          });
      },
      toggleTask(task) {
        task.completed = !task.completed;
        this.updateTask(task);
      },
      updateTask(task) {
        fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: task.text, completed: task.completed })
        });
      },
      editTask(task) {
        this.newTaskText = task.text;
        this.editingTask = task; 
      }
    },
    mounted() {
      this.fetchTasks();
    }
  });
  
  app.mount('#app');
  