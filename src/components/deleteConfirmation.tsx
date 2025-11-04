interface DeletionProps{
    isOpen:boolean;
    message?:string;
    onCancel:()=>void;
    onConfirm:()=>void;
}

const Delete:React.FC<DeletionProps>=({isOpen, onCancel, onConfirm,message="Are you sure you want to delete this task?"})=>{
    if(!isOpen) return null;
    return(
    <>
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-200 roundede hover:bg-gray-300">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white">Delete</button>
                </div>
            </div>
        </div>
    </>
)
}

export default Delete;