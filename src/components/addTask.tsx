import { useState } from "react";
import Delete from "./deleteConfirmation";

interface AddTaskprops{
    day:string;
    onClose:()=>void;
    onSave:(day:string, task:string)=> void;
    tasks: string[];
    onDelete:(day:string, index:number)=>void;
    onEdit : (day:string, index:number,newTask:string)=>void;
    onDeleteDay :(day:string)=>void;
    onEditDay:(oldDay:string, newDay:string)=>void;
}

const AddTask:React.FC<AddTaskprops>=({day, onClose, onSave, tasks, onDelete, onEdit, onDeleteDay, onEditDay,})=>{
    const[taskText, setTaskText]=useState("");
    const[editingIndex, setEditingIndex]=useState<number |null>(null);
    const[editedText,setEditedText]=useState("");
    const[completedTask, setCompletedTask]=useState<boolean []>(tasks.map(()=>false));
    const[isDeleteOpen, setIsDeleteOpen]=useState(false);
    const[deleteIndex, setDeleteIndex]=useState<number |null>(null);
    const[isEditingDay,setIsEditingDay]=useState(false);
    const[newDay, setNewDay] = useState(day);
    const[isDeleteDay, setIsDeleteDay] = useState(false);
    const[deleteDay,setDeleteDay]=useState(day);
    const handleSave=()=>{
        if(taskText.trim()){
            onSave(day,taskText.trim());
            setTaskText("");
            setCompletedTask([...completedTask,false]);
        }
    }

    const handleEditSave = (index:number)=>{
        if(editedText.trim()){
            onEdit(day,index,editedText.trim());
            setEditingIndex(null);
            setEditedText("");
        }
    }

    const toggleComplete = (index: number)=>{
      const updated = [...completedTask];
      updated[index] = !updated[index];
      setCompletedTask(updated);
    }

    const openDeleteModal = (index: number)=>{
      setDeleteIndex(index);
      setIsDeleteOpen(true);
    }

    const handleConfirmDelete = ()=>{
      if(deleteIndex !== null){
        onDelete(day, deleteIndex);
        setIsDeleteOpen(false);
        setDeleteIndex(null);
      }
    }

    const handleCancelDelete =()=>{
      setIsDeleteOpen(false);
      setDeleteIndex(null);
    }
    const openDeleteDayModal = (day: string)=>{
      setDeleteDay(day);
      setIsDeleteDay(true);
    }

    const handleConfirmDayDelete = ()=>{
      if(deleteDay !== null){
        onDeleteDay(day);
        setIsDeleteDay(false);
      }
    }

    const handleCancelDayDelete =()=>{
      setIsDeleteDay(false);
    }

    const handleDayEdit = ()=>{
      if(newDay.trim() && newDay !==day) {
        onEditDay(day, newDay.trim());
        setIsEditingDay(false);
      }
    }

    return(
        <>
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50" onClick={onClose}>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold">
                ✕
              </button>
                <div className="bg-white p-8 rounded-xl shadow-xl w-md ">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        {day}
                    </h3>
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            placeholder="Enter a task"
                            value={taskText}
                            onChange={(e)=>setTaskText(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded mb-4"
                        />
                        <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-1 w-32 mb-4 rounded-md hover:bg-blue-500">
                            Add task
                        </button>
                    </div>
                    <ul className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        {tasks.map((task,index)=>(
                            <li key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                              <div className="flex items-center space-x-2 w-full">
                                <span className="text-gray-700">{index + 1}.</span>
                                <input
                                  type="checkbox"
                                  checked={completedTask[index] || false}
                                  onChange={() => toggleComplete(index)}
                                  className="w-4 h-4"
                                />
                      
                                {editingIndex === index ? (
                                  <input
                                    type="text"
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    className=" w-48 border border-gray-300 rounded"
                                  />
                                ) : (
                                <span className={`grow ${completedTask[index] ? "line-through text-gray-400" : ""}`}>
                                  {task}
                                </span>
                                      )}
                                    </div>
                                    <div className="flex space-x-2">
                                      {editingIndex === index ? (
                                        <button
                                          onClick={() => handleEditSave(index)}
                                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400"
                                        >
                                          Save
                                        </button>
                                      ) : (
                                      <button
                                        onClick={() => {
                                          setEditingIndex(index);
                                          setEditedText(task);
                                        }}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                      >
                                        Edit
                                      </button>
                                    )}
                                    <button
                                      onClick={() => openDeleteModal(index)}
                                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                      ✕
                                    </button>
               </div>
                          </li>
                        ))}
                    </ul>
                    <div className="flex justify-end border-t-2 border-gray-300 space-x-2">
                      {isEditingDay?(
                        <>
                        <input
                            type="text"
                            value={newDay}
                            onChange={(e) => setNewDay(e.target.value)}
                            className="grow p-1 border border-gray-300 rounded"
                          />
                          <button
                            onClick={handleDayEdit}
                            className="bg-green-500 text-white px-3 py-1 rounded mt-4 hover:bg-green-400"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditingDay(false)}
                            className="bg-gray-400 text-white px-3 py-1 rounded mt-4 hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </>
                      ):(
                        <>
                           <button 
                            onClick={()=>{
                              setIsEditingDay(true);
                            }}
                            className="bg-blue-500 text-white px-3 py-1 rounded mt-4 hover:bg-blue-600">Edit</button>
                            <button 
                            onClick={()=>{
                              openDeleteDayModal(day)
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded mt-4 hover:bg-red-600">Delete</button>
                        </>
                      )}
                    </div>
                </div>   
            </div>
            </div>
            {isDeleteOpen && (
              <Delete 
              isOpen = {isDeleteOpen}
              message = {`Are you sure you want to delete "${tasks[deleteIndex??0]}"?`}
              onCancel={handleCancelDelete}
              onConfirm={handleConfirmDelete}
              />
            )}
            {isDeleteDay && (
              <Delete 
              isOpen = {isDeleteDay}
              message = {`Are you sure you want to delete "${day}"?`}
              onCancel={handleCancelDayDelete}
              onConfirm={handleConfirmDayDelete}
              />
            )}
        </>
    )
}

export default AddTask;