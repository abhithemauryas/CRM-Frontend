import React, { useEffect, useState } from "react";
import SelectDropdown from "@/components/shared/SelectDropdown";
import TextArea from "@/components/shared/TextArea";
import {
  customerListTagsOptions,
  leadsGroupsOptions,
  leadsSourceOptions,
  leadsStatusOptions,
  propsalVisibilityOptions,
  // taskAssigneeOptions,
  taskStatusOptions,
} from "@/utils/options";
import useLocationData from "@/hooks/useLocationData";
import { currencyOptionsData } from "@/utils/fackData/currencyOptionsData";
import { languagesData } from "@/utils/fackData/languagesData";
import { timezonesData } from "@/utils/fackData/timeZonesData";
import Loading from "@/components/shared/Loading";
import Input from "@/components/shared/Input";
import MultiSelectImg from "@/components/shared/MultiSelectImg";
import MultiSelectTags from "@/components/shared/MultiSelectTags";
import axios from "axios";
import topTost from "@/utils/topTost";
import { useNavigate, useParams } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import { set } from "date-fns";
import { use } from "react";
import { labels } from "../tasks/TaskHeader";

const LeadsCreateContent = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [statusOption, setStatusOption] = useState(null);
  const [sourceOption, setSourceOption] = useState(null);
  const [visibilityOption, setVisibilityOption] = useState(null);
  const [countryOption, setCountryOption] = useState(null);
  const [stateOption, setStateOption] = useState(null);
  const [cityOption, setCityOption] = useState(null);
  const [tags, setTags] = useState([]); // array of selected tag values
  const [groups, setGroups] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [leadData, setLeadData] = useState(null);
  const [taskAssigneeOptions, setTaskAssigneeOptions] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [excelUploadLoading, setExcelUploadLoading] = useState(false);

  const {
    countries,
    states,
    cities,
    loading,
    error,
    fetchStates,
    fetchCities,
  } = useLocationData();
  const leadsTags = customerListTagsOptions;
  const [fields, setFields] = useState({
    status: "",
    source: "",
    visibility: "",
    tags: "",
    assigned: "",
    groups: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    address: "",
    description: "",
    country: "",
    state: "",
    citys: "",
  });
  const change = (e) => {
    console.log("change", e.target.name, e.target.value);
    setFields({ ...fields, [e.target.name]: e.target.value });
  };
  const fetchData = async () => {
    try {
      const formData = {
        ...fields,
        tags: tags.map((tag) => tag.value),
        groups: groups.length > 0 ? groups[0].value : "",
        assigned: assigned.map((user) => user.value),
        // assigned: assigned.length > 0 ? assigned[0].value : "",
        // assigned: assigned.length > 0 ? assigned[0].value : "",
        status: statusOption?.value,
        source: sourceOption?.value,
        visibility: visibilityOption?.value,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("crmToken"),
        },
      };
      console.log("ASSIGNED before submit:", assigned);
      console.log(
        "ASSIGNED mapped:",
        assigned.map((a) => a.value)
      );
      const response = await axios.post(
        "http://localhost:4500/lead/create",
        formData,
        config
      );
      response.data.lead && console.log("Lead created successfully:");
      console.log(response.data.lead);

      topTost(
        response?.data.message || "Lead created successfully!",
        "success"
      );
    } catch (error) {
      console.error("Error creating lead:", error);
      topTost(
        error?.response?.data.message ||
          "Error creating lead, please try again later.",
        "error"
      );
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await handleEdit();
    } else {
      await fetchData();
    }

    navigate("/leads/list");
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type.includes("spreadsheet") ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls"))
    ) {
      setExcelFile(file);
    } else {
      topTost("Invalid file type. Only Excel files allowed.", "error");
      setExcelFile(null);
    }
  };

  const submitExcelFile = async () => {
    if (!excelFile) return;

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      setExcelUploadLoading(true);
      const response = await axios.post(
        "http://localhost:4500/lead/import-excel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("crmToken"),
          },
        }
      );
      topTost(
        response?.data?.message || "Excel uploaded successfully",
        "success"
      );
      navigate("/leads/list");
      setExcelFile(null);
    } catch (error) {
      console.error("❌ Excel upload failed:", error);
      topTost(
        error?.response?.data?.message || "Failed to upload Excel file",
        "error"
      );
    } finally {
      setExcelUploadLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/lead/download-template`,
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "lead_template.xlsx");
    document.body.appendChild(link);
    link.click();
  };
  useEffect(() => {
    if (!id) return;
    const fetchLeadProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/lead/${id}`);
        const leadData = response.data.lead;
        setLeadData(leadData);
        setFields({
          status: leadData.status || "",
          source: leadData.source || "",
          visibility: leadData.visibility || "",
          tags: leadData.tags || "",
          assigned: leadData.assigned || "",
          name: leadData.name || "",
          email: leadData.email || "",
          phone: leadData.phone || "",
          company: leadData.company || "",
          website: leadData.website || "",
          address: leadData.address || "",
          description: leadData.description || "",
          country: leadData.country || "",
          state: leadData.state || "",
          city: leadData.city || "",
        });
        // 👇 Yeh add karo for dropdowns & multiselects
        if (leadData.status) {
          setStatusOption(
            leadsStatusOptions.find(
              (opt) => opt.value.toLowerCase() === leadData.status.toLowerCase()
            )
          );
        }
        if (leadData.source) {
          setSourceOption(
            leadsSourceOptions.find(
              (opt) => opt.value.toLowerCase() === leadData.source.toLowerCase()
            )
          );
        }
        if (leadData.visibility) {
          setVisibilityOption(
            propsalVisibilityOptions.find(
              (opt) =>
                opt.value.toLowerCase() === leadData.visibility.toLowerCase()
            )
          );
        }

        if (leadData.tags?.length) {
          setTags(
            leadData.tags
              .map((tag) => leadsTags.find((opt) => opt.value === tag))
              .filter(Boolean)
          );
        }
        if (leadData.groups) {
          setGroups([
            leadsGroupsOptions.find((opt) => opt.value === leadData.groups),
          ]);
        }
        if (leadData.assigned?.length) {
          setAssigned(
            leadData.assigned.map((a) => ({
              value: a._id,
              label: `${a.name} - ${a.email}`,
            }))
          );
        }

        if (leadData.country) {
          setCountryOption({
            label: leadData.country,
            value: leadData.country,
          });
        }
        if (leadData.state) {
          setStateOption({ label: leadData.state, value: leadData.state });
        }
        if (leadData.city) {
          setCityOption({ label: leadData.city, value: leadData.city });
        }
      } catch (error) {
        console.error("Error fetching Lead profile:", error);
        topTost(
          error?.response?.data?.message || "Error fetching Lead profile:",
          "error"
        );
      }
    };

    fetchLeadProfile();
  }, [id]);

  const handleEdit = async () => {
    try {
      const formData = {
        ...fields,
        tags: tags.map((tag) => tag.value),
        groups: groups.length > 0 ? groups[0].value : "",
        assigned: assigned.map((user) => user.value),
        status: statusOption?.value,
        source: sourceOption?.value,
        visibility: visibilityOption?.value,
        country: countryOption?.value || fields.country,
        state: stateOption?.value || fields.state,
        city: cityOption?.value || fields.citys,
      };
      await axios.put(
        `http://localhost:4500/lead/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("crmToken"),
          },
        }
      );
      topTost("Lead updated successfully!", "success");
    } catch (error) {
      console.error("Error updating Lead:", error);
      topTost(error?.response?.data?.message || "Error updating Lead", "error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: users } = await axios.get(
          "http://localhost:4500/employee/options"
        );
        console.log("users", users);
        setTaskAssigneeOptions(
          users.employees.map((user) => ({
            value: user._id,
            label: `${user.name}- ${user.email}`,
          }))
        );
      } catch (error) {
        console.error("Error fetching assigned options:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className="col-lg-12">
        <form action="" onSubmit={handleSubmit}>
          <div className="card stretch stretch-full">
            <div className="card-body lead-status">
              <div className="mb-5 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                  <span className="d-block mb-2">Lead Status :</span>
                  <span className="fs-12 fw-normal text-muted text-truncate-1-line">
                    Typically refers to adding a new potential customer or sales
                    prospect
                  </span>
                </h5>
                <a href="#" className="btn btn-sm btn-light-brand">
                  Create Invoice
                </a>
              </div>
              <div className="row">
                <div className="col-lg-4 mb-4">
                  <label className="form-label">Status</label>
                  <SelectDropdown
                    options={leadsStatusOptions}
                    value={statusOption}
                    defaultValue={leadsStatusOptions[0]} // agar default rakhna hai
                    onChange={(option) => setStatusOption(option)}
                  />
                </div>
                <div className="col-lg-4 mb-4">
                  <label className="form-label">Source</label>
                  <SelectDropdown
                    options={leadsSourceOptions}
                    selectedOption={sourceOption}
                       defaultValue={leadsSourceOptions[0]}
                    onSelectOption={(option) => {
                      setSourceOption(option);
                      console.log("logooooo", option.value);
                    }}
                  />
                </div>
                <div className="col-lg-4 mb-4">
                  <label className="form-label">Visibility:</label>
                  <SelectDropdown
                    options={propsalVisibilityOptions}
                    selectedOption={visibilityOption}
                       defaultValue={propsalVisibilityOptions[0]}
                    onSelectOption={(option) => setVisibilityOption(option)}
                  />
                </div>
                <div className="col-lg-4 mb-4">
                  <label className="form-label">Tags</label>
                  <MultiSelectTags
                    options={leadsTags}
                    selectedTags={tags}
                    setSelectedTags={setTags}
                  />
                </div>
                <div className="col-lg-4 mb-4">
                  <label className="form-label">Assigned</label>
                  <MultiSelectImg
                    options={taskAssigneeOptions}
                    selectedOptions={assigned}
                    setSelectedOptions={setAssigned}
                  />
                </div>

                <div className="col-lg-4 mb-4">
                  <label className="form-label">Groups</label>
                  <MultiSelectTags
                    options={leadsGroupsOptions}
                    selectedTags={groups}
                    setSelectedTags={setGroups}
                  />
                </div>
              </div>
            </div>
            <hr className="mt-0" />
            <div className="card-body general-info">
              <div className="mb-5 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                  <span className="d-block mb-2">Lead Info :</span>
                  <span className="fs-12 fw-normal text-muted text-truncate-1-line">
                    General information for your lead
                  </span>
                </h5>
                <a href="#" className="btn btn-sm btn-light-brand">
                  Edit Lead
                </a>
              </div>
              <Input
                icon="feather-user"
                label={"Name"}
                labelId={"nameInput"}
                placeholder={"Name"}
                name={"name"}
                value={fields.name}
                changeFunction={change}
              />
              <Input
                icon="feather-mail"
                label={"Email"}
                labelId={"emailInput"}
                placeholder={"Email"}
                name={"email"}
                type={"email"}
                value={fields.email}
                changeFunction={change}
              />
              {/* <Input
                            icon='feather-link-2'
                            label={"Username"}
                            labelId={"usernameInput"}
                            placeholder={"Username"}
                            name={"username"}
                        /> */}
              <Input
                icon="feather-phone"
                label={"Phone"}
                labelId={"phoneInput"}
                placeholder={"Phone"}
                name={"phone"}
                value={fields.phone}
                changeFunction={change}
              />
              <Input
                icon="feather-compass"
                label={"Company"}
                labelId={"companyInput"}
                placeholder={"Company"}
                name={"company"}
                value={fields.company}
                changeFunction={change}
              />
              {/* <Input
                            icon='feather-briefcase'
                            label={"Designation"}
                            labelId={"designationInput"}
                            placeholder={"Designation"}
                            name={"designation"}
                        /> */}
              <Input
                icon="feather-link"
                label={"Website"}
                labelId={"websiteInput"}
                placeholder={"Website"}
                name={"website"}
                value={fields.website}
                changeFunction={change}
              />
              {/* <Input
                            icon="feather-dollar-sign"
                            label={"VAT"}
                            labelId={"vatInput"}
                            placeholder={"VAT"}
                            name={"vat"}
                        /> */}
              <TextArea
                icon="feather-map-pin"
                label={"Address"}
                labelId={"addressInput"}
                placeholder={"Address"}
                value={fields.address}
                name={"address"}
                changeFunction={change}
              />
              <TextArea
                icon="feather-type"
                label={"description"}
                labelId={"descriptionInput"}
                placeholder={"Description"}
                row="5"
                name={"description"}
                value={fields.description}
                changeFunction={change}
              />
              <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                  <label className="fw-semibold">Country: </label>
                </div>
                <div className="col-lg-8">
                  <SelectDropdown
                    options={countries}
                    selectedOption={selectedOption}
                    defaultSelect="usa"
                    onSelectOption={(option) => {
                      setFields({ ...fields, country: option.label });
                      fetchStates(option.label); // fetch states based on selected country
                      fetchCities(option.label); // fetch cities based on selected country
                      setSelectedOption(option); // set the selected country to state
                    }}
                  />
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                  <label className="fw-semibold">State: </label>
                </div>
                <div className="col-lg-8">
                  <SelectDropdown
                    options={states}
                    selectedOption={selectedOption}
                    defaultSelect={"new-york"}
                    onSelectOption={(option) => {
                      setSelectedOption(option);
                      setFields({ ...fields, state: option.label });
                    }}
                  />
                </div>
              </div>
              <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                  <label className="fw-semibold">City: </label>
                </div>
                <div className="col-lg-8">
                  <SelectDropdown
                    options={cities}
                    selectedOption={selectedOption}
                    defaultSelect="new-york"
                    onSelectOption={(option) => {
                      setSelectedOption(option);
                      console.log(option);

                      setFields({ ...fields, citys: option.label });
                    }}
                  />
                </div>
              </div>
              {/* <div className="row mb-4 align-items-center">
                            <div className="col-lg-4">
                                <label className="fw-semibold">Time Zone: </label>
                            </div>
                            <div className="col-lg-8">
                                <SelectDropdown
                                    options={timezonesData}
                                    selectedOption={selectedOption}
                                    defaultSelect="Western Europe Time"
                                    onSelectOption={(option) => setSelectedOption(option)}
                                />
                            </div>
                        </div> */}
              {/* <div className="row mb-4 align-items-center">
                            <div className="col-lg-4">
                                <label className="fw-semibold">Languages: </label>
                            </div>
                            <div className="col-lg-8">
                                <MultiSelectTags
                                    options={languagesData}
                                    defaultSelect={[languagesData[25], languagesData[10], languagesData[45]]}
                                />
                            </div>
                        </div> */}
              {/* <div className="row mb-4 align-items-center">
                            <div className="col-lg-4">
                                <label className="fw-semibold">Currency: </label>
                            </div>
                            <div className="col-lg-8">
                                <SelectDropdown
                                    options={currencyOptionsData}
                                    selectedOption={selectedOption}
                                    defaultSelect="usd"
                                    onSelectOption={(option) => setSelectedOption(option)}
                                />
                            </div>
                        </div> */}
              <div className="row">
                <div className="col-12 d-flex justify-content-center mt-4">
                  <button type="submit" className="btn btn-primary px-5 py-3">
                    {id ? "Update Lead" : "Create Lead"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <hr className="my-5" />
        <div className="card">
          <div className="card-body">
            <h5 className="fw-bold mb-3">📁 Import Leads via Excel</h5>
            <p className="text-muted fs-12 mb-4">
              Easily add multiple leads at once by uploading an Excel file.
              <br />
              Please make sure you use the correct format. You can download the
              sample file below:
            </p>

            {/* Download Format Button */}
            <button
              className="btn btn-outline-primary mb-3"
              onClick={() => {
                window.open(
                  `${import.meta.env.VITE_BASE_URL}/lead/download-template`,
                  "_blank"
                );
              }}
            >
              ⬇️ Download Excel Template
            </button>

            {/* File Upload Input */}
            <input
              type="file"
              accept=".xlsx, .xls"
              className="form-control mb-3"
              onChange={handleExcelUpload}
            />

            {/* Upload Button */}
            <button
              className="btn btn-success"
              onClick={submitExcelFile}
              disabled={!excelFile}
            >
              Upload Excel File
            </button>

            {/* Loading Spinner */}
            {excelUploadLoading && (
              <span className="ms-3 spinner-border spinner-border-sm text-success" />
            )}

            {/* Optional Note */}
            <p className="text-muted mt-3 fs-12">
              📌 Only .xlsx or .xls files are supported. Ensure all required
              fields are filled.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadsCreateContent;
