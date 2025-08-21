import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import { FiAlertTriangle } from 'react-icons/fi';
import { projectsData } from '@/utils/fackData/projectsData';
import ImageGroup from '@/components/shared/ImageGroup';
import HorizontalProgress from '@/components/shared/HorizontalProgress';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import topTost from '@/utils/topTost';
import useDatePicker from "@/hooks/useDatePicker";


const TabOverviewContent = () => {

  const { startDate, setStartDate, renderFooter } = useDatePicker();
  const [customer, setCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    address: '',
    dob: '',
    country: '',
    state: '',
    citys: '',
  });

  const { id } = useParams();

  const fetchCustomerProfile = async () => {
    try {
      const response = await axios.get(`https://crm-backend-bxsr.onrender.com/customer/${id}`);
      const customer = response.data.customer;
      setCustomer(customer);
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        website: customer.website || '',
        address: customer.address || '',
        dob: customer.dob || '',
        country: customer.country || '',
        state: customer.state || '',
        citys: customer.citys || '',
      });
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      topTost(error?.response?.data?.message ||'Error fetching customer profile:', "error")
    }
  };

  useEffect(() => {
    fetchCustomerProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://crm-backend-bxsr.onrender.com/customer/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem('crmToken')
        },
      });
      setEditMode(false);
      fetchCustomerProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const profileFields = [
    { label: 'Name', name: 'name' },
    { label: 'Email', name: 'email' },
    { label: 'Phone', name: 'phone' },
    { label: 'Company', name: 'company' },
    { label: 'Website', name: 'website' },
    { label: 'Address', name: 'address' },
    { label: 'Date of Birth', name: 'dob' },
    { label: 'Country', name: 'country' },
    { label: 'State', name: 'state' },
    { label: 'City', name: 'citys' },
  ];

  return (
    <div className="tab-pane fade show active p-4" id="overviewTab" role="tabpanel">
      <div className="about-section mb-5">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">Profile About:</h5>
        </div>
        <p>This is a CRM user profile. Details are listed below.</p>
      </div>

      <div className="profile-details mb-5">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">Profile Details:</h5>
          {!editMode ? (
            <button className="btn btn-sm btn-light-brand" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-success" onClick={handleSave}>
                ✅ Save
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setEditMode(false);
                  fetchCustomerProfile();
                }}
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </div>

        {profileFields.map((field, index) => (
          <div key={index} className={`row g-0 ${index === profileFields.length - 1 ? 'mb-0' : 'mb-4'}`}>
            <div className="col-sm-6 text-muted">{field.label}:</div>
            <div className="col-sm-6 fw-semibold">
              { editMode ? (
                field.name === 'dob' ? 
                <DatePicker
                  placeholderText = "Pick date of birth"
                  selected={startDate}
                  showPopperArrow={false}
                  defaultValue={formData.dob}
                  onChange={(date) => {
                    setStartDate(date)
                    setFormData({...formData, dob: date})
                  }}
                  className="form-control rounded-0"
                  popperPlacement="bottom-start"
                  calendarContainer={({ children }) => (
                    <div className="bg-white react-datepicker">
                      {children}
                      {renderFooter("start")}
                    </div>
                  )}
                /> :
                <input
                  type="text"
                  className="form-control"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              ) : (
                customer?.[field.name] || 'N/A'
              )}
            </div>
          </div>
        ))}
      </div>

      {'' && <div className="alert alert-dismissible mb-4 p-4 d-flex alert-soft-warning-message profile-overview-alert" role="alert">
        <div className="me-4 d-none d-md-block">
          <FiAlertTriangle className="fs-1" />
        </div>
        <div>
          <p className="fw-bold mb-1 text-truncate-1-line">Your profile has not been updated yet!!!</p>
          <p className="fs-10 fw-medium text-uppercase text-truncate-1-line">
            Last Update: <strong>26 Dec, 2023</strong>
          </p>
          <button className="btn btn-sm bg-soft-warning text-warning d-inline-block" onClick={() => setEditMode(true)}>
            Update Now
          </button>
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
        </div>
      </div>}

      {0 && <div className="project-section">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">Projects Details:</h5>
          <a href="#" className="btn btn-sm btn-light-brand">
            View Alls
          </a>
        </div>
        <div className="row">
          {projectsData.runningProjects.slice(0, 2).map(({ id, progress, project_logo, project_category, project_name, status, team_members, progress_color, badge_color }) => (
            <div key={id} className="col-xxl-6 col-xl-12 col-md-6">
              <div className="border border-dashed border-gray-5 rounded mb-4 md-lg-0">
                <div className="p-4">
                  <div className="d-sm-flex align-items-center">
                    <div className="wd-50 ht-50 p-2 bg-gray-200 rounded-2">
                      <img src={project_logo} className="img-fluid" alt="" />
                    </div>
                    <div className="ms-0 mt-4 ms-sm-3 mt-sm-0">
                      <a href="#" className="d-block">
                        {project_name}
                      </a>
                      <div className="fs-12 d-block text-muted">{project_category}</div>
                    </div>
                  </div>
                  <div className="my-4 text-muted text-truncate-2-line">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias dolorem necessitatibus temporibus...
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="img-group lh-0 ms-3">
                      <ImageGroup data={team_members} avatarStyle={'bg-soft-primary'} />
                    </div>
                    <div className={`badge ${badge_color}`}>{status}</div>
                  </div>
                </div>
                <div className="px-4 py-3 border-top border-top-dashed border-gray-5 d-flex justify-content-between gap-2">
                  <div className="w-75 d-none d-md-block">
                    <small className="mb-1 fs-11 fw-medium text-uppercase text-muted d-flex align-items-center justify-content-between">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </small>
                    <HorizontalProgress progress={progress} barColor={progress_color} />
                  </div>
                  <span className="mx-2 text-gray-400 d-none d-md-block">|</span>
                  <a href="#" className="fs-12 fw-bold">
                    View →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
};

export default TabOverviewContent;
