
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillAlt,
  FaCar,
  FaTachometerAlt,
  FaGasPump,
  FaCalendarAlt,
  FaIndustry,
} from "react-icons/fa";
import carDetails from "../Data/CarDetails.json";
import { IoCloseCircleSharp } from "react-icons/io5";
import { IoReturnUpBack } from "react-icons/io5";
import "./AddListing.css";

function AddListing() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pictures: [],
    videos: [],
    make: "",
    year: "",
    mileage: "",
    sellingPrice: "",
    fuelType: "",
    category: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map((file) => ({
      file,
      name: file.name,
    }));
    setSelectedVideos((prevVideos) => [...prevVideos, ...newVideos]);
  };

  const handleImageRemove = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  const handleVideoRemove = (index) => {
    const updatedVideos = selectedVideos.filter((_, i) => i !== index);
    setSelectedVideos(updatedVideos);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    const reorderedImages = [...selectedImages];
    const [draggedItem] = reorderedImages.splice(draggedIndex, 1);
    reorderedImages.splice(index, 0, draggedItem);
    setSelectedImages(reorderedImages);
    setDraggedIndex(null);
  };

  const uploadImagesToCloudinary = async () => {
    setIsUploading(true); // Start loading
    const uploadedUrls = [];
  
    for (const image of selectedImages) {
      const formData = new FormData();
      formData.append("file", image.file);
      formData.append("upload_preset", "speedcarvision");
  
      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dm6kk5w8j/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  
    setFormData((prevData) => ({
      ...prevData,
      pictures: uploadedUrls,
    }));
    setIsUploading(false); // Stop loading
  };
  const uploadVideosToCloudinary = async () => {
    setIsUploading(true); // Start loading
    const uploadedUrls = [];
    setUploadProgress(0);
  
    for (let i = 0; i < selectedVideos.length; i++) {
      const video = selectedVideos[i];
      const formData = new FormData();
      formData.append("file", video.file);
      formData.append("upload_preset", "speedcarvision");
  
      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dm6kk5w8j/video/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
  
        const data = await res.json();
        uploadedUrls.push(data.secure_url);
  
        // Update progress
        const progress = Math.round(((i + 1) / selectedVideos.length) * 100);
        setUploadProgress(progress);
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  
    setFormData((prevData) => ({
      ...prevData,
      videos: uploadedUrls,
    }));
    setUploadProgress(0); // Reset progress after upload
    setIsUploading(false); // Stop loading
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      await uploadImagesToCloudinary();
      // Wait a bit to ensure state is updated (optional, React batching fix)
      await new Promise((res) => setTimeout(res, 300));
    } else if (currentStep === 2) {
      await uploadVideosToCloudinary();
      await new Promise((res) => setTimeout(res, 300));
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };
  

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const validateForm = () => {
    return {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      console.error("Form validation errors:", newErrors);
      return;
    }

    try {
      const res = await fetch("https://carvision.onrender.com/api/add-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage("Listing submitted successfully!");
        setTimeout(() => {
          setMessage("");
          navigate("/");
        }, 3000);
      } else {
        const errorData = await res.json();
        console.error("Error submitting listing:", errorData);
        setMessage("Failed to submit the listing. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Failed to submit the listing. Please try again.");
    }
  };

  return (
    <div className="add-listing-container">
       <button className="back-button" onClick={() => navigate("/")}>
              <IoReturnUpBack /> Back
            </button>
      {message && <div className="message-box">{message}</div>}
      {isUploading && (
  <div className="loading-overlay">
    <div className="spinner"></div>
    <p>Uploading... Please wait</p>
  </div>
)}
      <h1 className="form-title">Add Listing</h1>
      <form onSubmit={handleSubmit} className="add-listing-form">
        {/* Step 1: Add Pictures */}
        {currentStep === 1 && (
          <div className="form-step">
            <h2 className="step-title">Step 1: Add Pictures</h2>
            <div className="upload-area">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
              />
              <p className="upload-text">Select images to upload</p>
            </div>
            <div className="uploaded-images-grid">
              {selectedImages.map((image, index) => (
                <div
                  key={index}
                  className="uploaded-image-item"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                >
                  <div
                    className="remove-icon"
                    onClick={() => handleImageRemove(index)}
                  >
                    <IoCloseCircleSharp />
                  </div>
                  <img
                    src={image.preview}
                    className="uploaded-image"
                    alt={`Selected ${index}`}
                  />
                </div>
              ))}
            </div>
            <div className="button-group">
  <button
    type="button"
    className="next-button"
    onClick={handleNext}
    disabled={isUploading} // Disable when uploading
  >
    {isUploading ? "Uploading..." : "Next"}
  </button>
  <button
    type="button"
    className="admin-button"
    onClick={() => navigate("/admin")}
  >
    Admin
  </button>
</div>
          </div>
        )}

        {/* Step 2: Add Videos */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2 className="step-title">Step 2: Add Videos</h2>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={handleVideoSelect}
            />
            <div className="uploaded-videos-list">
              {selectedVideos.map((video, index) => (
                <div key={index} className="uploaded-video-item">
                  <p>{video.name}</p>
                  <button
                    type="button"
                    className="remove-video-button"
                    onClick={() => handleVideoRemove(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            {uploadProgress > 0 && (
              <div className="upload-progress-container">
                <div
                  className="upload-progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="upload-progress-text">{uploadProgress}%</p>
              </div>
            )}
     <div className="button-group">
  <button
    type="button"
    className="previous-button"
    onClick={handlePrevious}
    disabled={isUploading} // Disable when uploading
  >
    Previous
  </button>
  <button
    type="button"
    className="next-button"
    onClick={handleNext}
    disabled={isUploading} // Disable when uploading
  >
    {isUploading ? "Uploading..." : "Next"}
  </button>
</div> 
          </div>
        )}

        {/* Step 3: Add Car Details */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2 className="step-title">Step 3: Add Car Details</h2>
            <div className="form-grid">
              {carDetails.carDetails.map((item, index) => (
                <div key={index} className="form-field">
                  <label>
                    {item.icon === "FaIndustry" && <FaIndustry />}
                    {item.icon === "FaCalendarAlt" && <FaCalendarAlt />}
                    {item.icon === "FaGasPump" && <FaGasPump />}
                    {item.icon === "FaTachometerAlt" && <FaTachometerAlt />}
                    {item.icon === "FaCar" && <FaCar />}
                    {item.icon === "FaMoneyBillAlt" && <FaMoneyBillAlt />}
                    {item.label}
                  </label>
                  {item.fieldType === "dropdown" ? (
                    <select
                      value={formData[item.name] || ""}
                      onChange={(e) =>
                        handleInputChange(item.name, e.target.value)
                      }
                    >
                      <option value="">Select {item.label}</option>
                      {item.options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={item.fieldType}
                      placeholder={item.placeholder}
                      value={formData[item.name] || ""}
                      onChange={(e) =>
                        handleInputChange(item.name, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="button-group">
              <button
                type="button"
                className="previous-button"
                onClick={handlePrevious}
              >
                Previous
              </button>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default AddListing;
