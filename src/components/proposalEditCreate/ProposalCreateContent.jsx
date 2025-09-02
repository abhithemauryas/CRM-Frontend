import React, { useEffect, useState } from "react";
import SelectDropdown from "@/components/shared/SelectDropdown";
import MultiSelectTags from "@/components/shared/MultiSelectTags";
import MultiSelectImg from "@/components/shared/MultiSelectImg";
import DatePicker from "react-datepicker";
import useDatePicker from "@/hooks/useDatePicker";
import {
  // propasalLeadOptions,
  propsalDiscountOptions,
  propsalRelatedOptions,
  propsalStatusOptions,
  propsalVisibilityOptions,
  //   taskAssigneeOptions,
  taskLabelsOptions,
} from "@/utils/options";
import { timezonesData } from "@/utils/fackData/timeZonesData";
import { currencyOptionsData } from "@/utils/fackData/currencyOptionsData";
import useLocationData from "@/hooks/useLocationData";
import Loading from "@/components/shared/Loading";
import AddProposal from "./AddProposal";

import axios from "axios";
import topTost from "@/utils/topTost";
import { useNavigate } from "react-router-dom";

const previtems = [
  {
    id: 1,
    product: "",
    qty: 0,
    price: 0,
  },
];
const ProposalCreateContent = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [tags, setTags] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [items, setItems] = useState([]);

  const [propasalLeadOptions, setPropasalLeadOptions] = useState([]);
  const [taskAssigneeOptions, setTaskAssigneeOptions] = useState([]);
  const [discountOption, setDiscountOption] = useState(null);
  // const [visibilityOption, setVisibilityOption] = useState(null);
  const [timezoneOption, setTimezoneOption] = useState(null);
  const [toOption, setToOption] = useState(null);

  const { startDate, endDate, setStartDate, setEndDate, renderFooter } =
    useDatePicker();
  const navigator = useNavigate();
  const [selected, setOptions] = useState({});

  const {
    countries,
    states,
    cities,
    loading,
    error,
    fetchStates,
    fetchCities,
  } = useLocationData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // lead options fill-up
        const { data } = await axios.get("https://crm-backend-bxsr.onrender.com/lead/options");
        setPropasalLeadOptions(
          data.leads.map((lead) => ({
            value: lead._id,
            label: `${lead.name} - ${lead.email}`,
          }))
        );
        // Assignee options fill-up
        const { data: users } = await axios.get(
          "https://crm-backend-bxsr.onrender.com/employee/options"
        );
        console.log(users);
        setTaskAssigneeOptions(
          users.employees.map((user) => ({
            value: user._id,
            label: `${user.name} - ${user.email}`,
          }))
        );
      } catch (error) {
        console.error("Error fetching proposal lead options:", error);
      }
    };
    fetchData();
  }, []);

  const fetchLeadDetails = async (objID) => {
    const { data } = await axios.get(`https://crm-backend-bxsr.onrender.com/lead/${objID}`);
    setFields({
      ...fields,
      addressLine1: data.lead.address,
      email: data.lead.email,
      phone: data.lead.phone,
      country: data.lead.country,
      state: data.lead.state,
      city: data.lead.city,
    });
  };

  const [fields, setFields] = useState({
    subject: "",
    to: "",
    relatedTo: "",
    discount: "",
    visibility: "",
    status: "",
    startDate: "",
    dueDate: "",
    tags: [],
    assignees: [],
    addressLine1: "",
    addressLine2: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    timezone: "",
    currency: "",
    allowComments: "",
    items: [], // if nothing added
  });
  const change = (e) =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  const fetcchProposal = async () => {
    try {
      const formData = {
        ...fields,
        to:fields.toId,
        tags: tags.length > 0 ? tags.map((i) => i.value) : [],
        assignees: assignees.length > 0 ? assignees.map((a) => a.value) : [],
        ...selected,
        startDate,
        dueDate: endDate,
        items:
          items.length > 0
            ? items.map((item) => ({
                product: item.product,
                qty: item.qty,
                price: item.price,
              }))
            : [],
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("crmToken"),
        },
      };
      const response = await axios.post(
        "https://crm-backend-bxsr.onrender.com/proposal/create",
        formData,
        config
      );
      response.data.proposal &&
        console.log("Proposal data created successfully:");
      console.log(response.data.proposal);
      topTost(
        response?.data?.message || "Proposal created successfully!",
        "success"
      );
      navigator("/proposal/list");
    } catch (error) {
      console.error("Error creating proposal:", error);
      topTost(
        error?.response?.data.message || "Error creating proposal",
        "error"
      );
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetcchProposal();
  };

  return (
    <>
      {loading ? <Loading /> : ""}

      <div className="col-xl-6">
        <div className="card stretch stretch-full">
          <div className="card-body">
            <div className="mb-4">
              <label className="form-label">
                Subject <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Subject"
                name="subject"
                value={fields.subject}
                onChange={change}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">
                Related <span className="text-danger">*</span>
              </label>
              <SelectDropdown
                options={propsalRelatedOptions}
                selectedOption={selectedOption}
                defaultSelect="lead"
                onSelectOption={(option) => {
                  setFields({ ...fields, relatedTo: option.value });
                }}
              />
            </div>
            {/* <div className="mb-4">
              <label className="form-label">
                Lead <span className="text-danger">*</span>
              </label>
              <SelectDropdown
                options={propasalLeadOptions}
                selectedOption={selectedOption}
                defaultSelect="ui"
                onSelectOption={(option) => {
                  setOptions({...selected, lead: option.value})
                  // setSelectedOption(option)
                }}
              />
            </div> */}
            <div className="mb-4">
              <label className="form-label">Discount </label>
              <SelectDropdown
                options={propsalDiscountOptions}
                selectedOption={discountOption}
                defaultSelect="no-discount"
                onSelectOption={(option) => {
                  setDiscountOption(option);
                  setFields({ ...fields, discount: option.value });
                }}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Visibility:</label>
              <SelectDropdown
                options={propsalVisibilityOptions}
                selectedOption={selectedOption}
                defaultSelect="private"
                onSelectOption={(option) => {
                  console.log("visibility",option);
                  setOptions({ ...selected, visibility: option.value });
                  setSelectedOption(option.value);
                }}
              />
            </div>
            <div className="row">
              <div className="col-lg-6 mb-4">
                <label className="form-label">
                  Start <span className="text-danger">*</span>
                </label>
                <div className="input-group date ">
                  <DatePicker
                    placeholderText="Pick start date"
                    selected={startDate}
                    showPopperArrow={false}
                    onChange={(date) => setStartDate(date)}
                    className="form-control"
                    popperPlacement="bottom-start"
                    calendarContainer={({ children }) => (
                      <div className="bg-white react-datepicker">
                        {children}
                        {renderFooter("start")}
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-4">
                <label className="form-label">
                  Due <span className="text-danger">*</span>
                </label>
                <div className="input-group date ">
                  <DatePicker
                    placeholderText="Pick due date"
                    selected={endDate}
                    showPopperArrow={false}
                    onChange={(date) => setEndDate(date)}
                    className="form-control"
                    popperPlacement="bottom-start"
                    calendarContainer={({ children }) => (
                      <div className="bg-white react-datepicker">
                        {children}
                        {renderFooter("end")}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Tags:</label>
              <MultiSelectTags
                options={taskLabelsOptions}
                selectedValues={tags}
                setSelectedTags={setTags}
                placeholder={""}
              />
            </div>
            <div className="mb-0">
              <label className="form-label">Assignee:</label>
              <MultiSelectImg
                options={taskAssigneeOptions}
                selectedValues={assignees}
                setSelectedOptions={setAssignees}
                // onSelectOption={(option) => setSelectedOption(option)}
                placeholder={""}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-6">
        <div className="card stretch stretch-full">
          <div className="card-body">
            <div className="mb-4">
              <label className="form-label">
                To <span className="text-danger">*</span>
              </label>
              <SelectDropdown
                options={propasalLeadOptions}
                selectedOption={toOption}
                onSelectOption={(option) => {
                  setOptions({ ...selected, leadId: option.value }); // ✅ leadId bhejna
                  setFields({ ...fields, to: option.label, toId: option.value });
                  fetchLeadDetails(option.value);
                  setSelectedOption(option);
                }}
              />
            </div>
            <div>
              <label className="form-label">
                Address <span className="text-danger">*</span>
              </label>
              <div className="row">
                <div className="col-lg-12 mb-4">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Address Line 1"
                    name={"addressLine1"}
                    value={fields.addressLine1}
                    onChange={change}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 mb-4">
                <label className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  name={"email"}
                  value={fields.email}
                  onChange={change}
                />
              </div>
              <div className="col-lg-6 mb-4">
                <label className="form-label">
                  Phone <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone"
                  name={"phone"}
                  value={fields.phone}
                  onChange={change}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 mb-4">
                <label className="form-label">
                  Country <span className="text-danger">*</span>
                </label>
                <SelectDropdown
                  options={countries}
                  selectedOption={selectedOption}
                  defaultSelect="india"
                  onSelectOption={(option) => {
                    setFields({ ...fields, country: option.label });
                    fetchStates(option.label);
                    fetchCities(option.label);
                    setSelectedOption(option);
                  }}
                />
              </div>
              <div className="col-lg-6 mb-4">
                <label className="form-label">State</label>
                <SelectDropdown
                  options={states}
                  selectedOption={selectedOption}
                  defaultSelect={"new-york"}
                  onSelectOption={(option) => {
                    setFields({ ...fields, state: option.label });
                    setSelectedOption(option);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 mb-4">
                <label className="form-label">City </label>
                <SelectDropdown
                  options={cities}
                  selectedOption={selectedOption}
                  defaultSelect="new-york"
                  onSelectOption={(option) => {
                    setFields({ ...fields, city: option.label });
                    setSelectedOption(option);
                  }}
                />
              </div>
              <div className="col-lg-6 mb-4">
                <label className="form-label">Timezone </label>
                <SelectDropdown
                  options={timezonesData}
                  selectedOption={timezoneOption}
                  defaultSelect="Western Europe Time"
                  onSelectOption={(option) => {
                    console.log("time", option);
                    setFields({ ...fields, timezone: option.label });
                  }}
                />
              </div>
            </div>
            <hr className="my-5" />
            <div className="row">
              <div className="col-lg-6 mb-4">
                <label className="form-label">Currency</label>
                <SelectDropdown
                  options={currencyOptionsData}
                  selectedOption={selectedOption}
                  defaultSelect="usd"
                  onSelectOption={(option) => {
                    setFields({ ...fields, currency: option.label });
                    setSelectedOption(option);
                  }}
                />
              </div>
              <div className="col-lg-6 mb-4">
                <label className="form-label">Status </label>
                <SelectDropdown
                  options={propsalStatusOptions}
                  selectedOption={selectedOption}
                  defaultSelect="open"
                  onSelectOption={(option) => {
                    console.log(option);
                    setFields({ ...fields, status: option.label });
                    setSelectedOption(option);
                  }}
                />
              </div>
            </div>
            <hr className="my-5" />
            <div className="row mb-4">
              {/* <div className="form-check form-switch form-switch-sm ps-5">
                <input
                  className="form-check-input c-pointer"
                  type="checkbox"
                  id="commentSwitch"
                  checked={fields.allowComments}
                  onChange={(e) => setFields({ ...fields, allowComments: e.target.checked })}
                />
                <label
                  className="form-check-label fw-500 text-dark c-pointer"
                  htmlFor="commentSwitch"
                >
                  Allow Comments
                </label>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <AddProposal previtems={previtems} onItemsChange={setItems} />

      <div className="col-12">
        <div className="card">
          <div className="card-body text-center">
            <button
              type="submit"
              className="btn btn-primary px-5"
              onClick={handleSubmit}
            >
              Submit Proposal
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProposalCreateContent;
