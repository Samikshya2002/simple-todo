import { useEffect, useState } from "react";
import AddDay from "./addDay";
import AddTask from "./addTask";
import axios from "axios";

const API_URL = "http://localhost:5002";
const ToDo = () => {
  const[showModal, setShowModal] = useState(false);
  const[showTaskModal, setShowTaskModal]=useState(false);
  const[selectedDay,setSelectedDay]=useState<string |null>(null);
  const [days, setDays] = useState<string[]>([]);
  const[tasks,setTasks] = useState<{[key:string]:string[]}>({});

  useEffect(()=>{
    axios.get(`${API_URL}/days`).then((res)=> setDays(res.data.map((d:any) => d.name)));

    axios.get(`${API_URL}/tasks`).then((res)=>{
      const grouped: {[key:string]:string[]} = {};
      res.data.forEach((t:any)=>{
        if(!grouped[t.day]) grouped[t.day]=[];
        grouped[t.day].push(t.task);
      });
      setTasks(grouped);
    })
  },[]);

  const handleSaveDay = async(dayText: string) => {
    if (!days.includes(dayText)) {
      try{
        await axios.post(`${API_URL}/days`,{name:dayText});
        setDays([...days, dayText]);
      }catch (err){
        console.error(err);
      }
    }
    setShowModal(false);
  };

 const handleSaveTask =async(day:string, task:string)=>{
  try{
    await axios.post(`${API_URL}/tasks`,{day,task});
    setTasks((prev)=>({
    ...prev,
    [day]:prev[day]?[...prev[day],task]:[task],
  }))
  }catch(err){
    console.error(err);
  }
 }
 const handleDeleteTask = async(day: string, index: number) => {
  try{
    const res = await axios.get(`${API_URL}/tasks`);
    const found = res.data.find(
      (t:any)=> t.day === day&& t.task == tasks[day][index]
    );
    if(found) await axios.delete(`${API_URL}/tasks/${found.id}`);
    setTasks((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  }catch(err){
    console.error(err);
  }
    
  };

  const handleEditTask = async (day: string, index: number, newTask: string) => {
    try{
      const res = await axios.get(`${API_URL}/tasks`);
      const found = res.data.find(
        (t:any)=> t.day === day && t.task === tasks[day][index]
      );
      if(found)
        await axios.put(`${API_URL}/tasks/${found.id}`);
      setTasks((prev) => {
      const updated = [...prev[day]];
      updated[index] = newTask;
      return { ...prev, [day]: updated };
    });
    }catch(err){
      console.error(err);
    }   
  };
 const handleDayClick = (day:string)=>{
   setSelectedDay(day);
   setShowTaskModal(true);
 }

  const handleDeleteDay = async (day: string) => {
    try{
      await axios.delete(`${API_URL}/days/${days.indexOf(day)+1}`);
      const res = await axios.get(`${API_URL}/tasks`);
      const toDelete = res.data.filter((t:any)=> t.day === day);
      await Promise.all(toDelete.map((t:any)=> axios.delete(`${API_URL}/tasks/${t.id}`)));
       setDays((prev) => prev.filter((d) => d !== day));
    setTasks((prev) => {
      const updated = { ...prev };
      delete updated[day];
      return updated;
    });
    }catch(err){
      console.error(err);
    }
   
    setShowTaskModal(false);
  };

  const handleEditDay = async (oldDay: string, newDay: string) => {
    if (days.includes(newDay.trim())) {
      alert("A day with that name already exists!");
      return;
    }
    try{
      const dayId = days.indexOf(oldDay)+1;
      await axios.put(`${API_URL}/days/${dayId}`,newDay.trim());

      const res = await axios.get(`${API_URL}/tasks`);
      const tasksToUpdate = res.data.filter((t:any)=>t.day === oldDay);
      await Promise.all(
        tasksToUpdate.map((t:any)=>
        axios.put(`${API_URL}/tasks/${t.id}`,{...t,day:newDay.trim()})
        )
      )
      setDays((prev) => prev.map((d) => (d === oldDay ? newDay.trim() : d)));

    setTasks((prev) => {
      const updated = { ...prev, [newDay.trim()]: prev[oldDay] };
      delete updated[oldDay];
      return updated;
    });
    }catch(err){
      console.log(err);
    }
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
        <ul className="gap-2 mt-4 flex cursor-pointer flex-wrap">
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
