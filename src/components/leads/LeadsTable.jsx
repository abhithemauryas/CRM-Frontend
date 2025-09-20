import React, { memo, useEffect, useState } from "react";
import Table from "@/components/shared/table/Table";
import {
  FiAlertOctagon,
  FiArchive,
  FiClock,
  FiEdit3,
  FiEye,
  FiMoreHorizontal,
  FiPrinter,
  FiTrash2,
} from "react-icons/fi";
import Dropdown from "@/components/shared/Dropdown";
import SelectDropdown from "@/components/shared/SelectDropdown";
import getIcon from "@/utils/getIcon";
import axios from "axios"; // ✅ Import Axios
import { Link, useNavigate, useParams } from "react-router-dom";
import topTost from "@/utils/topTost";
import sourceOptions from "@/utils/sourceOptions";
import { confirmDelete } from "@/utils/confirmDelete";
import { set } from "date-fns";
import { dispositionOptions } from "@/utils/options";
// import Modal from "@/components/shared/Modal"; // ✅ add your Modal component
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

// dispositionOptions
const updateStatus = async (option, id) => {
  const { data } = await axios.get(
    `http://localhost:4500/lead-status/${id}/${option.value}`
  );
};

const TableCell = memo(
  ({ id, options, defaultSelect, onSelectOption, children }) => {
    const [selectedOption, setSelectedOption] = useState(defaultSelect || null);

    useEffect(() => {
      setSelectedOption(defaultSelect || null);
    }, [defaultSelect]);

    return (
      <div className="flex items-center gap-2">
        <SelectDropdown
          options={options}
          defaultSelect={defaultSelect}
          selectedOption={selectedOption}
          onSelectOption={(option) => {
            if (onSelectOption) {
              onSelectOption(option, id.leadId);
            }
            setSelectedOption(option);
          }}
        />
        {children}
      </div>
    );
  }
);

const LeadssTable = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [customer, setCustomer] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [selectedDisposition, setSelectedDisposition] = useState(null);
  const [note, setNote] = useState("");
  const [nextActionDate, setNextActionDate] = useState("");

  const actions = [
    {
      label: "Edit",
      icon: <FiEdit3 />,
      onClick: (row) => navigate(`/leads/create/${row.leadId}`),
      // 👈 id ke sath navigate
    },
    { label: "Print", icon: <FiPrinter /> },
    { label: "Remind", icon: <FiClock /> },
    { type: "divider" },
    { label: "Archive", icon: <FiArchive /> },
    { label: "Report Spam", icon: <FiAlertOctagon /> },
    { type: "divider" },
    {
      label: "Delete",
      icon: <FiTrash2 />,
      onClick: (row) => deleteLead(row.leadId, setData),
    },
  ];

  const fetchEmployees = async () => {
    try {
      const { data: users } = await axios.get(
        `http://localhost:4500/employee/options`
      );
      // console.log("customerrrrrrrrr", users)

      const employeeOptions = users.employees.map((user) => ({
        value: user._id,
        label: `${user.name} - ${user.email}`,
      }));
      // console.log("employeeOptions", employeeOptions)
      setCustomer(employeeOptions); // ✅ ab sirf formatted options state me jayega
      // console.log("employeeOptions", employeeOptions)
    } catch (error) {
      console.error("Error fetching customer data", error);
    }
  };

  const deleteLead = async (leadId, setData) => {
    const result = await confirmDelete(leadId);
    if (!result.confirmed) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("crmToken"),
        },
      };
      await axios.delete(`http://localhost:4500/lead/delete/${leadId}`, config);
      setData((prevData) => prevData.filter((item) => item.leadId !== leadId));
      Swal.fire({
        title: "Deleted!",
        text: "The lead has been deleted successfully.",
        icon: "success",
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
      });
    } catch (error) {
      console.error("Error deleting lead", error);
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Error deleting lead",
        icon: "error",
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
    }
  };

  // Assign for task
  //   useEffect(() => {
  //     fetchEmployees();
  //   }, []);

  const assignLead = async (option, leadId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("crmToken"),
        },
      };
      const result = await axios.put(
        `http://localhost:4500/lead/assign/${leadId}`,
        { employeeId: option.value },
        config
      );
      topTost("Lead assigned successfully!", "success");
      setData((prev) =>
        prev.map((lead) =>
          lead.leadId === leadId ? { ...lead, assignedTo: option } : lead
        )
      );
    } catch (error) {
      console.error("Error assigning task", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("crmToken"),
          },
        };
        const userRole = localStorage.getItem("crmRole");
        const url =
          userRole === "admin"
            ? "http://localhost:4500/lead/all"
            : "http://localhost:4500/lead/customer/my-leads";

        const res = await axios.get(url, config);

        const formattedData = res.data.leads.map((item, index) => {
          const matchedSource = sourceOptions.find(
            (s) => s.value === item.source
          );
          return {
            id: index + 1,
            leadId: item._id,
            customer: {
              name: item.name,
              img: null,
            },
            email: item.email,
            source: {
              media: matchedSource?.label || item.source || "Loading...",
              icon: matchedSource?.icon || "feather-globe",
            },
            phone: item.phone,
            date: new Date(item.createdAt).toLocaleDateString(),
            status: {
              status: [
                { label: "Open", value: "open" },
                { label: "Working", value: "working" },
                { label: "Closed", value: "closed" },
              ],
              defaultSelect: item.status || "open",
            },
            disposition: item.disposition || "", // ✅ add this line
            assignedTo: item.assigned?.[0]
              ? {
                  label: `${item.assigned[0].name} - ${item.assigned[0].email}`,
                  value: item.assigned[0]._id,
                }
              : null,
            actions: "",
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data", error);
        topTost(
          error?.response?.data?.message || "Error fetching data",
          "error"
        );
      }
    };
    // pahle employees option k liye
    // then data
    fetchEmployees().then(() => fetchData());
  }, []);

  const handleDispositionChange = async (option, leadId, note = "", nextActionDate = null) => {
  try {
    const token = localStorage.getItem("crmToken");
    const config = { headers: { Authorization: "Bearer " + token } };

    const response = await axios.patch(
      `http://localhost:4500/lead/disposition/${leadId}`,
      { disposition: option.label, note, nextActionDate },
      config
    );

    if (response.data.deleted) {
      // Lead ko frontend se bhi hatao
      setData((prev) => prev.filter((lead) => lead.leadId !== leadId));
      topTost("Lead deleted after 5 failed attempts", "error");
      return;
    }

    setData((prev) =>
      prev.map((lead) =>
        lead.leadId === leadId
          ? {
              ...lead,
              disposition: option.value,
              dispositionWarning: response.data.warning || null, // 👈 extra flag
            }
          : lead
      )
    );

    if (response.data.warning) {
      topTost("⚠️ Last chance before deletion!", "warning");
    } else {
      topTost("Disposition updated successfully!", "success");
    }

  } catch (error) {
    console.error("Error updating disposition:", error);
    topTost("Failed to update disposition", "error");
  }
};

  const columns = [
    {
      accessorKey: "customer",
      header: () => "Customer",
      cell: (info) => {
        const roles = info.getValue(); // this gives { name, img }
        const row = info.row.original; // ✅ this gives full row data including leadId

        return (
          <Link to={`/leads/view/${row.leadId}`} className="hstack gap-3">
            <div>
              <span className="text-truncate-1-line">{roles?.name}</span>
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: "email",
      header: () => "Email",
      cell: (info) => {
        const row = info.row.original;
        return <Link to={`/leads/view/${row.leadId}`}>{info.getValue()}</Link>;
      },
    },
    {
      accessorKey: "source",
      header: () => "Source",
      cell: (info) => {
        const x = info.getValue();
        return (
          <div className="hstack gap-2">
            <div className="avatar-text avatar-sm">{getIcon(x.icon)}</div>
            <a href="#">{x.media}</a>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: () => "Phone",
      cell: (info) => <a href="tel:">{info.getValue()}</a>,
    },
    {
      accessorKey: "date",
      header: () => "Date",
    },
    {
      accessorKey: "status",
      header: () => "Status",
      cell: (info) => {
        const row = info.row.original;

        return (
          <TableCell
            id={row}
            options={info?.getValue().status}
            defaultSelect={info?.getValue().defaultSelect || ""}
            onSelectOption={(option, leadId) => {
              updateStatus(option, leadId);
            }}
          />
        );
      },
    },
    //  {
    //   accessorKey: "status",
    //   header: () => "Disposition",
    //   cell: (info) => {
    //     const row = info.row.original;

    //     return (
    //       <TableCell
    //         id={row}
    //         options={info?.getValue().status}
    //         defaultSelect={info?.getValue().defaultSelect || ""}
    //         onSelectOption={(option, leadId) => {
    //           updateStatus(option, leadId);
    //         }}
    //       />

    //     );
    //   },
    // },

    {
      accessorKey: "actions",
      header: () => "Actions",
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="hstack gap-2 justify-content-end">
            <Link
              to={`/leads/view/${row.leadId}`}
              className="avatar-text avatar-md"
            >
              <FiEye />
            </Link>
            <Dropdown
              dropdownItems={actions.map((a) => ({ ...a, row }))}
              triggerClass="avatar-md"
              triggerPosition={"0,21"}
              triggerIcon={<FiMoreHorizontal />}
            />
          </div>
        );
      },
      meta: {
        headerClassName: "text-end",
      },
    },
  ];
  let hogya = false;
  if (localStorage.crmRole === "admin" && !hogya) {
    columns.splice(6, 0, {
      accessorKey: "assign",
      header: () => "Assign To",
      cell: (info) => {
        const row = info.row.original;
        return (
          <TableCell
            id={row}
            options={customer}
            defaultSelect={row.assignedTo ? row.assignedTo.value : ""}
            onSelectOption={(option, leadId) => assignLead(option, leadId)}
          >
            {row.assignedTo?.label && (
              <span className="ml-2 text-xs text-green-600 flex items-center">
                ✅
              </span>
            )}
          </TableCell>
        );
      },
    });
  }
  // ✅ Status ke baad insert karenge
  if (localStorage.getItem("crmRole") === "employee") {
    columns.splice(6, 0, {
      accessorKey: "disposition",
      header: () => "Disposition",
      cell: (info) => {
        const row = info.row.original;
        return (
          <TableCell
            id={row.leadId}
            options={dispositionOptions}
            defaultSelect={row.disposition || ""}
            onSelectOption={(option) => {
              // Agar note ya nextAction chahiye, tab modal open karo
              if (["Call back", "Follow-up","Appointment"].includes(option.label)) {
                setSelectedLeadId(row.leadId);
                setSelectedDisposition(option);
                setNote(row.nextAction?.note || "");
                setNextActionDate(
                  row.nextAction?.date
                    ? new Date(row.nextAction.date).toISOString().split("T")[0]
                    : ""
                );
                setModalOpen(true); // ✅ only for specific dispositions
              } else {
                // Simple update without modal
                handleDispositionChange(option, row.leadId);
              }
            }}
          />
        );
      },
    });
  }
  return (
    <>
    <Table
  data={data}
  columns={columns}
  getRowProps={(row) => ({
    style: row.original.dispositionWarning
      ? { backgroundColor: "#ffcccc" } // 👈 red highlight if last chance
      : {},
  })}
/>



      {/* Modal for adding note */}
     <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
      <ModalHeader toggle={() => setModalOpen(false)}>
        Add note for "{selectedDisposition?.label}"
      </ModalHeader>
      <ModalBody>
    <textarea
      placeholder="Write note here..."
      value={note}
      onChange={(e) => setNote(e.target.value)}
      className="form-control mb-3"
      rows={3}
    />
    <input
      type="date"
      value={nextActionDate}
      onChange={(e) => setNextActionDate(e.target.value)}
      className="form-control"
    />
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" onClick={() => setModalOpen(false)}>
      Cancel
    </Button>
    <Button
      color="primary"
      onClick={async () => {
        await handleDispositionChange(
          selectedDisposition,
          selectedLeadId,
          note,
          nextActionDate
        );
        setModalOpen(false);
      }}
    >
      Save
    </Button>
  </ModalFooter>
</Modal>

    </>
  );

  
};

export default LeadssTable;
