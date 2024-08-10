import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTaskInState, deleteTask, addTask, addBoard } from '../redux/tasksSlice';
import { RootState, AppDispatch } from '../redux/store';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const KanbanBoard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const boards = useSelector((state: RootState) => state.tasks.boards);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingTaskTitle, setEditingTaskTitle] = useState('');
    const [editingTaskStatus, setEditingTaskStatus] = useState<string>('To Do');

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const reorderedTasks = [...tasks];
        const [movedTask] = reorderedTasks.splice(result.source.index, 1);
        movedTask.status = result.destination.droppableId;
        reorderedTasks.splice(result.destination.index, 0, movedTask);

        dispatch(updateTaskInState(reorderedTasks));
    };

    const handleDeleteTask = (taskId: string) => {
        dispatch(deleteTask(taskId));
    };

    const handleAddTask = () => {
        const newTask = {
            id: Math.random().toString(36).substr(2, 9),
            title: newTaskTitle,
            status: 'To Do'
        };
        dispatch(addTask(newTask));
        setNewTaskTitle('');
    };

    const handleAddBoard = () => {
        dispatch(addBoard(newBoardTitle));
        setNewBoardTitle('');
    };

    const handleEditTask = (taskId: string) => {
        setEditingTaskId(taskId);
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            setEditingTaskTitle(task.title);
            setEditingTaskStatus(task.status);
        }
    };

    const handleUpdateTask = () => {
        const updatedTasks = tasks.map(task => 
            task.id === editingTaskId ? { ...task, title: editingTaskTitle, status: editingTaskStatus } : task
        );
        dispatch(updateTaskInState(updatedTasks));
        setEditingTaskId(null);
        setEditingTaskTitle('');
        setEditingTaskStatus('To Do');
    };

    return (
        <div>
            <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Yeni görev ekle..."
            />
            <button onClick={handleAddTask}>Ekle</button>

            <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                placeholder="Yeni pano ekle..."
            />
            <button onClick={handleAddBoard}>Pano Ekle</button>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {boards.map((board, index) => (
                        <Droppable droppableId={board} key={index}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{ margin: '0 10px', padding: '10px', width: '30%', backgroundColor: '#f8f8f8', borderRadius: '4px' }}
                                >
                                    <h2>{board}</h2>
                                    {tasks
                                        .filter(task => task.status === board)
                                        .map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            marginBottom: '8px',
                                                            padding: '16px',
                                                            backgroundColor: 'white',
                                                            borderRadius: '4px',
                                                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                            ...provided.draggableProps.style
                                                        }}
                                                    >
                                                        {editingTaskId === task.id ? (
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    value={editingTaskTitle}
                                                                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                                                                />
                                                                <select
                                                                    value={editingTaskStatus}
                                                                    onChange={(e) => setEditingTaskStatus(e.target.value)}
                                                                >
                                                                    {boards.map((board) => (
                                                                        <option key={board} value={board}>
                                                                            {board}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <button onClick={handleUpdateTask}>Güncelle</button>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {task.title}
                                                                <button onClick={() => handleEditTask(task.id)}>Düzenle</button>
                                                                <button onClick={() => handleDeleteTask(task.id)}>Sil</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;

