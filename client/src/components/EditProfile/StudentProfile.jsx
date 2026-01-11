import { useEffect, useState } from "react";
import { useAuth } from "../../context/Context";
import { LoadingOverlay } from "../Loading/Loading";
import { toast } from "react-toastify";
export const StudentProfilePage = () => {
  const {
    postData,
    apiLoading,
    fetchData,
    isLoggedIn,
  } = useAuth();
  // const {
  //   fetchProfileData,
  //   postUpdatedStudentProfile,
  //   postData,
  //   apiLoading,
  // } = useAuth();
  const [profileData, setProfileData] = useState([]);
  // const { profileData } = user || {}; // Ensure user is defined
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [previewImage, setPreviewImage] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchingData = async () => {
      try {
        const responseData = await fetchData(`${process.env.BACKEND_URL}/api/profile`);
        if (responseData.success) {
          setProfileData(responseData.data || []);
        } else {
          toast.error(responseData.message);
        }
      } catch (error) {
        toast.error("An unexpected error occurred while fetching profile data");
      }
    };
    fetchingData();
  }, [isEditing, fetchData, isLoggedIn]);

  // Set form data once profileData is available
  useEffect(() => {
    // Ensure profileData and personalInfo are defined before accessing them
    if (profileData?.personalInfo) {
      setFormData({
        name: profileData.personalInfo?.name || "",
        email: profileData.personalInfo?.email || "",
      });
      setPreviewImage(profileData?.profile || "");
    }
  }, [profileData, previewImage]);

  const setEditingTrue = () => setIsEditing(true);
  const setEditingFalse = () => setIsEditing(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setProfileImage(selectedFile);
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform save logic
    const updatedFormData = new FormData();
    updatedFormData.append("profileImage", profileImage);
    for (const key in formData) {
      updatedFormData.append(key, formData[key]);
    }

    // Call API to update profile data
    try {
      const responseData = await postData(
        `${process.env.BACKEND_URL}/api/update-student-profile`,
        updatedFormData
      );
      if (responseData.success) {
        toast.success(responseData.message);
        // fetchProfileData();
        setIsEditing(false); // Disable editing mode after submission
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred while updating profile");
    }
  };

  // if (apiLoading) {
  //   return apiLoading && <LoadingOverlay />;
  // }
  return (
    <div className="max-w-2xl mx-auto pt-24 p-8 bg-white shadow-md rounded-lg">
      <div className="text-center">
        <div className="flex justify-center">
          <img
            className="w-32 h-32 rounded-full object-cover"
            src={`${process.env.BACKEND_URL}/images/${previewImage}`}
            alt="Profile"
          />
        </div>

        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className="mt-4 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-1">
          <label className="block text-gray-700 font-semibold">Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            <p>{formData.name}</p>
          )}
        </div>

        <div className="space-y-1">
          <p className="block text-gray-700 font-semibold">Email</p>
          <p>{formData.email}</p>
        </div>
        <div>
          {isEditing ? (
            <>
              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                className="mt-4 mx-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                onClick={setEditingFalse}
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="text-center">
              <button
                type="button"
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                onClick={setEditingTrue}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
