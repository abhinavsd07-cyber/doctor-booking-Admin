import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  // State Management for form inputs
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

  /**
   * Handles the submission of the Add Doctor form.
   * Uses FormData to allow image file uploads via the API.
   */
  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
        if (!docImg) {
            return toast.error('Image Not Selected')
        }

        const formData = new FormData()

        // These keys MUST match the Backend destructuring
        formData.append('image', docImg)
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('experience', experience)
        formData.append('fees', Number(fees))
        formData.append('about', about)
        formData.append('speciality', speciality)
        formData.append('degree', education) // Change 'education' to 'degree' here
        formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

        const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { 
            headers: { atoken: aToken } 
        })

        if (data.success) {
            toast.success(data.message)
            // ... reset fields ...
            setDocImg(false)
            setName('')
            setEmail('')
            setPassword('')
            setExperience('1 Year')
            setFees('')
            setAbout('')
            setSpeciality('General physician')
            setEducation('')
            setAddress1('')
            setAddress2('')
        }

    } catch (error) {
        toast.error(error.response?.data?.message || error.message)
    }
}

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        {/* Image Upload Section */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer object-cover aspect-square"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload preview"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p className="text-sm">
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Left Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Doctor name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2 outline-primary"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2 outline-primary"
                type="email"
                placeholder="Email Address"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2 outline-primary"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-3 py-2 outline-primary"
              >
                {["1", "2", "3", "4", "5", "6", "8", "10"].map((year) => (
                  <option key={year} value={`${year} Year`}>
                    {year} Year
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border rounded px-3 py-2 outline-primary"
                type="number"
                placeholder="Consultation Fees"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Speciality</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border rounded px-3 py-2 outline-primary"
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Education</p>
              <input
                onChange={(e) => setEducation(e.target.value)}
                value={education}
                className="border rounded px-3 py-2 outline-primary"
                type="text"
                placeholder="Qualifications"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2 outline-primary mb-2"
                type="text"
                placeholder="Address line 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2 outline-primary"
                type="text"
                placeholder="Address line 2"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-4 mb-2">
          <p>About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded outline-primary"
            placeholder="Describe doctor professional background"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full hover:bg-opacity-90 transition-all"
        >
          Add doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
