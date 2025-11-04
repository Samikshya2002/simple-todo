import { useState } from "react";
import AddDay from "./addDay";
import AddTask from "./addTask";
const ToDo = () => {
  const[showModal, setShowModal] = useState(false);
  const[showTaskModal, setShowTaskModal]=useState(false);
  const[selectedDay,setSelectedDay]=useState<string |null>(null);
  const [days, setDays] = useState<string[]>([]);
  const[tasks,setTasks] = useState<{[key:string]:string[]}>({});

  const handleSaveDay = (dayText: string) => {
    if (!days.includes(dayText)) {
      setDays([...days, dayText]);
    }
    setShowModal(false);
  };

 const handleSaveTask =(day:string, task:string)=>{
  setTasks((prev)=>({
    ...prev,
    [day]:prev[day]?[...prev[day],task]:[task],
  }))
 }
 const handleDeleteTask = (day: string, index: number) => {
    setTasks((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const handleEditTask = (day: string, index: number, newTask: string) => {
    setTasks((prev) => {
      const updated = [...prev[day]];
      updated[index] = newTask;
      return { ...prev, [day]: updated };
    });
  };
 const handleDayClick = (day:string)=>{
   setSelectedDay(day);
   setShowTaskModal(true);
 }

  const handleDeleteDay = (day: string) => {
    setDays((prev) => prev.filter((d) => d !== day));
    setTasks((prev) => {
      const updated = { ...prev };
      delete updated[day];
      return updated;
    });
    setShowTaskModal(false);
  };

  const handleEditDay = (oldDay: string, newDay: string) => {
    if (days.includes(newDay.trim())) {
      alert("A day with that name already exists!");
      return;
    }

    setDays((prev) => prev.map((d) => (d === oldDay ? newDay.trim() : d)));

    setTasks((prev) => {
      const updated = { ...prev, [newDay.trim()]: prev[oldDay] };
      delete updated[oldDay];
      return updated;
    });

    setSelectedDay(newDay.trim()); 
  };
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className=" container bg-white rounded-lg shadow-md w-2xl  p-6">
        <div className="flex border-b  justify-between">
            <h1 className="text-2xl font-bold mb-2 mt-1 text-center">
            Todo App
            </h1>
            <button onClick={()=>setShowModal(true)} className="bg-blue-600 text-white px-4 py-1 mb-2 rounded-md hover:bg-blue-500">
                Add new day
            </button>
        </div>
        <ul className="gap-2 mt-4 flex flex-wrap">
          {days.map((day, index)=>(
            <li key={index}
            onClick={()=> handleDayClick(day)}
            className="bg-gray-500 text-white w-32 text-center px-4 py-2 rounded shadow-sm">
              {day}
            </li>
          ))}
        </ul>
        {showModal &&(
          <AddDay onClose={()=>setShowModal(false)} onSave={handleSaveDay}/>
        )}
        {showTaskModal && selectedDay && (
          <AddTask
          day={selectedDay}
          onClose={()=> setShowTaskModal(false)}
          onSave={handleSaveTask}
          tasks={tasks[selectedDay] || []}
          onDelete = {handleDeleteTask}
          onEdit={handleEditTask}
          onDeleteDay={handleDeleteDay}
          onEditDay={handleEditDay}
          />
        )}
      </div>
    </div>
  );
};

export default ToDo;
