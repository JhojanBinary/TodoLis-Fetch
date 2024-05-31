import React, { useState, useEffect } from "react";

const Home = () => {
    const todosURL = "https://playground.4geeks.com/todo/";
    const [todos, setTodos] = useState([]);
    const [newTodoLabel, setNewTodoLabel] = useState("");

    const fetchTodos = () => {
        fetch(todosURL + "users/JhojanBinary")
            .then(response => response.json())
            .then(data => {
                setTodos(data.todos || []);
            })
            .catch(error => console.error("Error todos:", error));
    };

    const addTodo = () => {
        fetch(todosURL + "todos/JhojanBinary", {
            method: "POST",
            body: JSON.stringify({ label: newTodoLabel }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("New todo added:", data);
                fetchTodos();
                setNewTodoLabel("");
            })
            .catch(error => console.error("Error adding todo:", error));
    };

    const updateTodo = (todoId, updatedTodo) => {
        fetch(todosURL + "todos/" + todoId, {
            method: "PUT",
            body: JSON.stringify(updatedTodo),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Todo actualizado:", data);
                fetchTodos();
            })
            .catch(error => console.error("Error al actualizar todo:", error));
    };

    const deleteTodo = todoId => {
        fetch(todosURL + "todos/" + todoId, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) throw new Error("Error al eliminar todo");
                fetchTodos();
            })
            .catch(error => console.error(error));
    };


    const deleteAll = () => {
        const deleteall = todos.map(todo => 
            fetch(todosURL + "todos/" + todo.id, {
                method: "DELETE"
            })
        );

        Promise.all(deleteall)
            .then(() => {
                setTodos([]);
            })
            .catch(error => console.error("Error al eliminar todos los todos:", error));
    };

    useEffect(() => {
        fetchTodos();
    }, []);


    return (
        <div className="container-fluid bg-dark text-white py-5">
            <h1 className="text-center mb-4">ToDos</h1>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Add a new todo"
                value={newTodoLabel}
                onChange={e => setNewTodoLabel(e.target.value)}
                onKeyDown={e => {
                    if (e.key === "Enter") addTodo();
                }}
            />
            <button className="bg-danger" onClick={deleteAll}>DELETE ALL!</button>
            <ul className="list-group">
                {todos.map(todo => (
                    <li key={todo.id} className="list-group-item bg-dark text-white">
                        <div className="d-flex justify-content-between align-items-center">
                            <div onClick={() => updateTodo(todo.id, { label: todo.label })}>
                                {todo.label}
                            </div>
                            <button
                                className="btn btn-danger"
                                onClick={() => deleteTodo(todo.id)}>
                                X
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
