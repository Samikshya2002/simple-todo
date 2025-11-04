import { useState, useEffect } from "react";

interface AddDayprops{
    onClose:()=>void;
    onSave:(text:string)=>void;
    initialText?:string;
}

const AddDay:React.FC<AddDayprops>=({onClose,onSave,initialText=''})=>{
    const[inputValue, setInputValue] = useState('');

    useEffect(()=>{
        setInputValue(initialText);
    },[initialText]);

    const handleSave =()=>{
        if(inputValue.trim()){
            onSave(inputValue.trim());
            setInputValue('');
            onClose();
        }
    }
    return(
        <>
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                    <h2 className="text-xl font-semibold text-gray-700">
                        {initialText ? 'Edit Day':'Add New Day'}
                    </h2>
                    <input 
                        type="text" 
                        placeholder="Enter Day" 
                        value={inputValue}
                        onChange={(e)=>setInputValue(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                    />
                    <div className="flex justify-end space-x-2">
                        <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                    </div>       
                </div>
            </div>
        </>
    )
}

export default AddDay;