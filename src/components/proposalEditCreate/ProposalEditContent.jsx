import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import SelectDropdown from "@/components/shared/SelectDropdown";
import MultiSelectImg from "@/components/shared/MultiSelectImg";
import MultiSelectTags from "@/components/shared/MultiSelectTags";
import Loading from "@/components/shared/Loading";
import AddProposal from "./AddProposal";
import { currencyOptionsData } from "@/utils/fackData/currencyOptionsData";
import useDatePicker from "@/hooks/useDatePicker";
import { addDays } from "date-fns";
import { timezonesData } from "@/utils/fackData/timeZonesData";
import {
  propasalLeadOptions,
  propsalDiscountOptions,
  propsalRelatedOptions,
  propsalStatusOptions,
  propsalVisibilityOptions,
  taskAssigneeOptions,
  taskLabelsOptions,
} from "@/utils/options";
import useLocationData from "@/hooks/useLocationData";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const previtems = [
  {
    id: 1,
    product: "Website design and development",
    qty: 1,
    price: 250,
  },
  {
    id: 2,
    product: "Search engine optimization (SEO) optimization",
    qty: 2,
    price: 300,
  },
];

const ProposalEditContent = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const { startDate, endDate, setStartDate, setEndDate, renderFooter } =
    useDatePicker();
  const { countries, states, cities, error, fetchStates, fetchCities } =
    useLocationData();
  const [relatedTo, setRelatedTo] = useState(null);
  const [lead, setLead] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [visibility, setVisibility] = useState(null);
  const [country, setCountry] = useState(null);
  const [stateOption, setStateOption] = useState(null);
  const [city, setCity] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setStartDate(new Date());
    setEndDate(addDays(new Date(), 2));
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    clientEmail: "",
    clientPhone: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    timezone: "",
    currency: "",
    status: "",
    startDate: new Date(),
    endDate: new Date(),
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchProposal = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:4500/proposal/${id}`
        );
        const proposal = data.proposal;

        // 👇 yaha aapne formData set kiya hai
        setFormData({
          subject: proposal.subject || "",
          clientEmail: proposal.clientEmail || "",
          clientPhone: proposal.clientPhone || "",
          address1: proposal.address?.line1 || "",
          address2: proposal.address?.line2 || "",
          country: proposal.country || "",
          state: proposal.state || "",
          city: proposal.city || "",
          timezone: proposal.timezone || "",
          currency: proposal.currency || "",
          status: proposal.status || "Draft",
          startDate: proposal.startDate
            ? new Date(proposal.startDate)
            : new Date(),
          endDate: proposal.endDate ? new Date(proposal.endDate) : new Date(),
        });

        // ✅ isi ke just neeche mera diya hua dropdown set code paste karo
        setRelatedTo(
          propsalRelatedOptions.find((opt) => opt.value === proposal.relatedTo)
        );
        setLead(propasalLeadOptions.find((opt) => opt.value === proposal.lead));
        setDiscount(
          propsalDiscountOptions.find((opt) => opt.value === proposal.discount)
        );
        setVisibility(
          propsalVisibilityOptions.find(
            (opt) => opt.value === proposal.visibility
          )
        );
        setCountry(countries.find((opt) => opt.value === proposal.country));
        setStateOption(states.find((opt) => opt.value === proposal.state));
        setCity(cities.find((opt) => opt.value === proposal.city));
        setTimezone(
          timezonesData.find((opt) => opt.value === proposal.timezone)
        );
        setCurrency(
          currencyOptionsData.find((opt) => opt.value === proposal.currency)
        );
        setStatus(
          propsalStatusOptions.find((opt) => opt.value === proposal.status)
        );
      } catch (error) {
        console.error("Error fetching proposal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProposal();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      relatedTo: relatedTo?.value,
      lead: lead?.value,
      discount: discount?.value,
      visibility: visibility?.value,
      country: country?.value,
      state: stateOption?.value,
      city: city?.value,
      timezone: timezone?.value,
      currency: currency?.value,
      status: status?.value,
    };

    try {
      await axios.put(`http://localhost:4500/proposal/${id}`, updatedData);
      alert("Proposal updated successfully!");
      navigate("/proposal/list");
    } catch (error) {
      console.error("Error updating proposal:", error);
    }
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
                defaultValue="Website design and development proposal"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">
                Related <span className="text-danger">*</span>
              </label>
              <SelectDropdown
                options={propsalRelatedOptions}
                selectedOption={relatedTo}
                defaultSelect="lead"
                onSelectOption={(option) => setRelatedTo(option)}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">
                Lead <span className="text-danger">*</span>
              </label>
              <SelectDropdown
                options={propasalLeadOptions}
                selectedOption={lead}
                defaultSelect="ui"
                onSelectOption={(option) => setLead(option)}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Discount </label>
              <SelectDropdown
                options={propsalDiscountOptions}
                selectedOption={discount}
                defaultSelect="no-discount"
                onSelectOption={(option) => setDiscount(option)}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Visibility:</label>
              <SelectDropdown
                options={propsalVisibilityOptions}
                selectedOption={visibility}
                defaultSelect="private"
                onSelectOption={(option) => setVisibility(option)}
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
                    selected={formData.startDate}
                    showPopperArrow={false}
                    onChange={(date) =>
                      setFormData((prev) => ({ ...prev, startDate: date }))
                    }
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
                    selected={formData.endDate}
                    showPopperArrow={false}
                    onChange={(date) =>
                      setFormData((prev) => ({ ...prev, endDate: date }))
                    }
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
                defaultSelect={[
                  taskLabelsOptions[2],
                  taskLabelsOptions[3],
                  taskLabelsOptions[4],
                ]}
              />
            </div>
            <div className="mb-0">
              <label className="form-label">Assignee:</label>
              <MultiSelectImg
                options={taskAssigneeOptions}
                defaultSelect={[taskAssigneeOptions[0]]}
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
              <MultiSelectImg
                options={taskAssigneeOptions}
                defaultSelect={[taskAssigneeOptions[0]]}
              />
            </div>
            <div>
              <label className="form-label">
                Address <span className="text-danger">*</span>
              </label>
              <div className="row">
                <div className="col-lg-6 mb-4">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Address Line 1"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                  />
                </div>
                {/* <div className="col-lg-6 mb-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Address Line 2"
                    // defaultValue="DeLorean New York"
                  />
                </div> */}
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
                  placeholder="Emial"
                  // defaultValue="green.cutte@outlook.com"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
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
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  // defaultValue="+1 (375) 9632 458"
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
                  defaultSelect="usa"
                  onSelectOption={(option) => {
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
                  onSelectOption={(option) => setSelectedOption(option)}
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
                  onSelectOption={(option) => setSelectedOption(option)}
                />
              </div>
              <div className="col-lg-6 mb-4">
                <label className="form-label">Timezone </label>
                <SelectDropdown
                  options={timezonesData}
                  selectedOption={timezone}
                  defaultSelect="Western Europe Time"
                  onSelectOption={(option) => setTimezone(option)}
                />
              </div>
            </div>
            <hr className="my-5" />
            <div className="row">
              <div className="col-lg-6 mb-4">
                <label className="form-label">Currency</label>
                <SelectDropdown
                  options={currencyOptionsData}
                  selectedOption={currency}
                  defaultSelect="usd"
                  onSelectOption={(option) => setCurrency(option)}
                />
              </div>
              <div className="col-lg-6 mb-4">
                <label className="form-label">Status </label>
                <SelectDropdown
                  options={propsalStatusOptions}
                  selectedOption={status}
                  defaultSelect="open"
                  onSelectOption={(option) => setStatus(option)}
                />
              </div>
            </div>
            <hr className="my-5" />
            <div className="row mb-4">
              <div className="form-check form-switch form-switch-sm ps-5">
                <input
                  className="form-check-input c-pointer"
                  type="checkbox"
                  id="commentSwitch"
                  defaultChecked
                />
                <label
                  className="form-check-label fw-500 text-dark c-pointer"
                  htmlFor="commentSwitch"
                >
                  Allow Comments
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddProposal previtems={previtems} />

      <div className="row">
        <div className="col-12 d-flex justify-content-center mt-4">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary px-5 py-3"
          >
            {" "}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProposalEditContent;
