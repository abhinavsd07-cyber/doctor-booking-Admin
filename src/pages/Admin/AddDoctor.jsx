import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [education, setEducation] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!docImg) {
        return toast.error('Image Not Selected');
      }

      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', education);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

      const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { 
        headers: { atoken: aToken } 
      });

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName('');
        setEmail('');
        setPassword('');
        setFees('');
        setAbout('');
        setEducation('');
        setAddress1('');
        setAddress2('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full font-sans">
      <h2 className="mb-6 text-xl font-bold text-slate-900 tracking-tight">Add <span className="text-blue-600">New Doctor</span></h2>

      <div className="bg-white px-8 py-10 border border-slate-100 rounded-[2rem] shadow-sm w-full max-w-5xl max-h-[85vh] overflow-y-auto no-scrollbar">
        
        {/* --- IMAGE UPLOAD --- */}
        <div className="flex items-center gap-6 mb-10">
          <label htmlFor="doc-img" className="relative group cursor-pointer">
            <div className="w-20 h-20 bg-slate-50 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-blue-400 transition-colors">
              <img
                className="w-full h-full object-cover"
                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                alt="preview"
              />
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity">
              <span className="text-[10px] text-white font-bold uppercase">Change</span>
            </div>
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <div>
            <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-1">Upload Photo</p>
            <p className="text-xs text-slate-400 leading-relaxed">Recommended: Square aspect ratio<br/>Max size: 2MB</p>
          </div>
        </div>

        {/* --- FORM GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
          
          {/* LEFT SIDE */}
          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Doctor Name</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className="border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:bg-white transition-all text-sm" type="text" placeholder="Dr. Jonathan Doe" required />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className="border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:bg-white transition-all text-sm" type="email" placeholder="doctor@hospital.com" required />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Security Password</p>
              <input onChange={(e) => setPassword(e.target.value)} value={password} className="border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:bg-white transition-all text-sm" type="password" placeholder="••••••••" required />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Experience Level</p>
              <select onChange={(e) => setExperience(e.target.value)} value={experience} className="border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:bg-white transition-all text-sm appearance-none cursor-pointer">
                {["1", "2", "3", "5", "8", "10"].map((year) => <option key={year} value={`${year} Year`}>{year} Year</option>)}
              </select>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Speciality</p>
              <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className="border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:bg-white transition-all text-sm appearance-none cursor-pointer">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Academic Degree</p>
              <input onChange={(e) => setEducation(e.target.value)} value={education} className="border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:bg-white transition-all text-sm" type="text" placeholder="MBBS, MD" required />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Clinic Address</p>
              <input onChange={(e) => setAddress1(e.target.value)} value={address1} className="border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:bg-white transition-all text-sm mb-1" type="text" placeholder="Line 1" required />
              <input onChange={(e) => setAddress2(e.target.value)} value={address2} className="border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:bg-white transition-all text-sm" type="text" placeholder="Line 2" required />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Consultation Fee</p>
              <input onChange={(e) => setFees(e.target.value)} value={fees} className="border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:bg-white transition-all text-sm" type="number" placeholder="40" required />
            </div>
          </div>
        </div>

        {/* --- ABOUT --- */}
        <div className="mt-8">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2">Professional Biography</p>
          <textarea onChange={(e) => setAbout(e.target.value)} value={about} className="w-full px-4 py-4 border border-slate-100 bg-slate-50/50 rounded-[1.5rem] outline-none focus:border-blue-400 focus:bg-white transition-all text-sm" placeholder="Briefly describe the doctor's journey..." rows={4} required />
        </div>

        <button type="submit" className="mt-10 w-full lg:w-fit bg-slate-900 text-white font-bold text-xs uppercase tracking-[0.2em] px-16 py-4 rounded-full hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
          Confirm & Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;