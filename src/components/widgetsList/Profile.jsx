import Swal from "sweetalert2";
import { confirmDelete } from "@/utils/confirmDelete";
import topTost from "@/utils/topTost";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { FiEdit, FiMail, FiMapPin, FiPhone, FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false); // To toggle edit view
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const fetchCustomerProfile = async () => {
    try {
      const response = await axios.get(`${process.env.VITE_BASE_API_URL}/customer/${id}`);
      const customer = response.data.customer;
      setData(customer);
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
      });
    } catch (error) {
      console.error("Error fetching lead:", error);
      topTost(error?.response?.data?.message || "Error fetching lead:", "error");
    }
  };

  useEffect(() => {
    console.log("Received ID from cutomer URL:", id);
    fetchCustomerProfile();
  }, []);

  // for delete
  
  const handleDelete = async () => {
  const result= await confirmDelete(id)
  console.log("Delete confirm result:", result); // ⬅️ Add this for debugging
  if (result?.confirmed) {
    try {
       const config = {
          headers: {    
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem('crmToken')
          },    
        }
     const res= await axios.delete(`${process.env.VITE_BASE_API_URL}/customer/delete/${id}`,config);
       await Swal.fire({
       title: "Deleted!",
     text: res.data.message,
        icon: "success",
        customClass: {
          confirmButton: "btn btn-success",
        }
      });
     navigate("/customers/list")
    } catch (error) {
      console.error("Error deleting profile:", error);
       Swal.fire({
        title: "Error!",
        text: "Failed to delete profile.",
        icon: "error",
        customClass: {
          confirmButton: "btn btn-danger",
        }
      });
    }
  }
};


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="card stretch stretch-full">
      <div className="card-body">
        <div className="mb-4 text-center">
          <div className="wd-150 ht-150 mx-auto mb-3 position-relative">
            <div className="avatar-image wd-150 ht-150 border border-5 border-gray-3">
              <img src="/images/avatar/1.png" alt="img" className="img-fluid" />
            </div>
            <div
              className="wd-10 ht-10 text-success rounded-circle position-absolute translate-middle"
              style={{ top: "76%", right: "10px" }}
            >
              <BsPatchCheckFill size={16} />
            </div>
          </div>
          <div className="mb-4">
            <a href="#" className="fs-14 fw-bold d-block">
              {data?.name || "N/A"}{" "}
            </a>
            <a href="#" className="fs-12 fw-normal text-muted d-block">
              {data?.email || "N/A"}
            </a>
          </div>
          {/* <div className="fs-12 fw-normal text-muted text-center d-flex flex-wrap gap-3 mb-4">
                        <div className="flex-fill py-3 px-4 rounded-1 d-none d-sm-block border border-dashed border-gray-5">
                            <h6 className="fs-15 fw-bolder">28.65K</h6>
                            <p className="fs-12 text-muted mb-0">Followers</p>
                        </div>
                        <div className="flex-fill py-3 px-4 rounded-1 d-none d-sm-block border border-dashed border-gray-5">
                            <h6 className="fs-15 fw-bolder">38.85K</h6>
                            <p className="fs-12 text-muted mb-0">Following</p>
                        </div>
                        <div className="flex-fill py-3 px-4 rounded-1 d-none d-sm-block border border-dashed border-gray-5">
                            <h6 className="fs-15 fw-bolder">43.67K</h6>
                            <p className="fs-12 text-muted mb-0">Engagement</p>
                        </div>
                    </div> */}
        </div>
        <ul className="list-unstyled mb-4">
          <li className="hstack justify-content-between mb-4">
            <span className="text-muted fw-medium hstack gap-3">
              <FiMapPin size={16} />
              Location (State)
            </span>
            <a href="#" className="float-end">
              {data?.state}
            </a>
          </li>
          <li className="hstack justify-content-between mb-4">
            <span className="text-muted fw-medium hstack gap-3">
              <FiPhone size={16} />
              Phone
            </span>
            {editMode ? (
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            ) : (
              <a href="#" className="float-end">
                {data?.phone}
              </a>
            )}
          </li>
          <li className="hstack justify-content-between mb-0">
            <span className="text-muted fw-medium hstack gap-3">
              <FiMail size={16} />
              Email
            </span>
            {editMode ? (
              <input
                type="text"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            ) : (
              <a href="#" className="float-end">
                {data?.email}
              </a>
            )}
           
          </li>
        </ul>
       <div className="d-flex gap-2 text-center pt-4">
 <button
  type="button"
  className="w-50 btn btn-light-brand"
  onClick={handleDelete}
>
  <FiTrash2 size={16} className="me-2" />
  <span>Delete</span>
</button>


  {!editMode ? (
    <button className="w-50 btn btn-primary" onClick={() => setEditMode(true)}>
      <FiEdit size={16} className='me-2' />
      <span>Edit Profile</span>
    </button>
  ) : (
    <>
      <button
        className="w-50 btn btn-success"
        onClick={async () => {
          try {
            await axios.put(`${process.env.VITE_BASE_API_URL}/customer/${id}`, formData);
            setEditMode(false);
            fetchCustomerProfile(); // Update fresh data
          } catch (error) {
            console.error("Error updating profile:", error);
          }
        }}
      >
        ✅ Save
      </button>

      {/* 👇 Yahan Cancel button lagao */}
      <button
        className="w-50 btn btn-secondary"
        onClick={() => setEditMode(false)}
      >
        ❌ Cancel
      </button>
    </>
  )}
</div>

      </div>
    </div>
  );
};

export default Profile;
