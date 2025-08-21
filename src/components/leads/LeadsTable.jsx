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
import { Link, useNavigate } from "react-router-dom";
import topTost from "@/utils/topTost";
import sourceOptions from "@/utils/sourceOptions";


const actions = [
  { label: "Edit", icon: <FiEdit3 /> },
  { label: "Print", icon: <FiPrinter /> },
  { label: "Remind", icon: <FiClock /> },
  { type: "divider" },
  { label: "Archive", icon: <FiArchive /> },
  { label: "Report Spam", icon: <FiAlertOctagon /> },
  { type: "divider" },
  { label: "Delete", icon: <FiTrash2 /> },
];

const updateStatus =  async (option, id) => {
  const {data} = await axios.get(`${process.env.VITE_BASE_API_URL}/lead-status/${id}/${option.value}`);
}

const TableCell = memo(({ id, options, defaultSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  return (
    <SelectDropdown
      options={options}
      defaultSelect={defaultSelect}
      selectedOption={selectedOption}
      onSelectOption={(option) => {
        updateStatus(option, id.leadId);
        // setSelectedOption(option);
        // console.log(option, id)
      }}
    />
  );
});

const LeadssTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(process.env.VITE_BASE_API_URL+"/lead/all");
        console.log("API Response:", res.data);

        const formattedData = res.data.leads.map((item, index) => {
        const matchedSource = sourceOptions.find(s => s.value === item.source);

        return {
          id: index + 1,
          leadId: item._id,
          customer: {
            name: item.name,
            img: null,
          },
          email: item.email,
          source: {
            media: matchedSource?.label || item.source || "N/A",
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
          actions: "",
        };
  });

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data", error);
        topTost(error?.response?.data?.message ||"Error fetching data", "error") 
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: "id",
      header: ({ table }) => {
        const checkboxRef = React.useRef(null);

        useEffect(() => {
          if (checkboxRef.current) {
            checkboxRef.current.indeterminate = table.getIsSomeRowsSelected();
          }
        }, [table.getIsSomeRowsSelected()]);

        return (
          <input
            type="checkbox"
            className="custom-table-checkbox"
            ref={checkboxRef}
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        );
      },
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="custom-table-checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      meta: {
        headerClassName: "width-30",
      },
    },
    {
      accessorKey: "customer",
      header: () => "Customer",
      cell: (info) => {
        const roles = info.getValue(); // this gives { name, img }
        const row = info.row.original; // ✅ this gives full row data including leadId

        return (
          <Link to={`/leads/view/${row.leadId}`}  className="hstack gap-3">
            {roles?.img ? (
              <div className="avatar-image avatar-md">
                <img src={roles?.img} alt="" className="img-fluid" />
              </div>
            ) : (
              <div className="text-white avatar-text user-avatar-text avatar-md">
                {roles?.name.substring(0, 1)}
              </div>
            )}
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
      cell: (info) => <a href="apps-email.html">{info.getValue()}</a>,
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
        
        return (<TableCell
          id={row}
          options={info?.getValue().status}
          defaultSelect={info?.getValue().defaultSelect}
        />)
      },
    },
    {
      accessorKey: "actions",
      header: () => "Actions",
      cell: (info) => {
      const row = info.row.original;
        return(
        <div className="hstack gap-2 justify-content-end">
          <Link to={`/leads/view/${row.leadId}`} className="avatar-text avatar-md">
            <FiEye />
          </Link>
          <Dropdown
            dropdownItems={actions}
            triggerClassNaclassName="avatar-md"
            triggerPosition={"0,21"}
            triggerIcon={<FiMoreHorizontal />}
          />
        </div>
      )},
      meta: {
        headerClassName: "text-end",
      },
    },
  ];

  return (
    <>
      <Table data={data} columns={columns} />
    </>
  );
};

export default LeadssTable;
