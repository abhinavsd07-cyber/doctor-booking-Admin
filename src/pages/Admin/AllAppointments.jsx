import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="m-6 font-sans">
      
      {/* --- Section Header --- */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Booking <span className="text-blue-600">Ledger</span></h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Live Appointment Stream</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 px-5 py-2 rounded-full">
           <p className="text-blue-600 text-xs font-black uppercase tracking-widest">
            Total Sessions: {appointments.length}
          </p>
        </div>
      </div>

      {/* --- Main Table Container --- */}
      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        
        {/* Scrollable Area */}
        <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
          
          {/* Table Header - Sticky */}
          <div className="hidden sm:grid grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1fr] items-center py-5 px-8 border-b bg-slate-50/50 sticky top-0 backdrop-blur-md z-10">
            {['#', 'Patient', 'Age', 'Schedule', 'Doctor', 'Fee', 'Action'].map((head) => (
              <p key={head} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{head}</p>
            ))}
          </div>

          {/* Empty State */}
          {appointments.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">No Records Found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {appointments.map((item, index) => (
                <div
                  className="grid grid-cols-1 sm:grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1fr] items-center py-5 px-8 hover:bg-slate-50/50 transition-colors group"
                  key={index}
                >
                  <p className="text-slate-400 font-bold text-xs max-sm:hidden">{index + 1}</p>

                  {/* Patient Info */}
                  <div className="flex items-center gap-3">
                    <img className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" src={item.userData.image} alt="" />
                    <p className="text-slate-900 font-bold text-sm tracking-tight">{item.userData.name}</p>
                  </div>

                  {/* Age */}
                  <p className="text-slate-500 font-medium text-sm">
                    {item.userData.dob ? (new Date().getFullYear() - item.userData.dob.split("-")[0]) : "—"}
                  </p>

                  {/* Schedule */}
                  <div>
                    <p className="text-slate-900 font-bold text-xs">{slotDateFormat(item.slotDate)}</p>
                    <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mt-0.5">{item.slotTime}</p>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex items-center gap-3">
                    <img className="w-8 h-8 rounded-full bg-slate-100 object-cover" src={item.docData.image} alt="" />
                    <p className="text-slate-600 font-semibold text-xs">{item.docData.name}</p>
                  </div>

                  {/* Fee */}
                  <p className="text-slate-900 font-black text-sm">${item.amount}</p>

                  {/* Actions */}
                  <div className="flex justify-end sm:justify-center">
                    {item.cancelled ? (
                      <span className="px-3 py-1 bg-rose-50 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-rose-100">Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Settled</span>
                    ) : (
                      <button 
                        onClick={() => cancelAppointment(item._id)}
                        className="p-2.5 hover:bg-rose-50 rounded-xl transition-all group/btn"
                        title="Cancel Appointment"
                      >
                        <img 
                          className="w-5 grayscale group-hover/btn:grayscale-0 opacity-40 group-hover/btn:opacity-100 transition-all" 
                          src={assets.cancel_icon} 
                          alt="Cancel" 
                        />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllAppointments;