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
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { set } from "date-fns";
import { confirmDelete } from "@/utils/confirmDelete";



const updateStatus = async (option, id) => {
  const { data } = await axios.get(
    `http://localhost:4500/customer-status/${id}/${option.value}`
  );
};

const TableCell = memo(({ id, options, defaultSelect }) => {
  const [selectedOption, setSelectedOption] = useState(defaultSelect || null);

  return (
    <SelectDropdown
      options={options}
      defaultSelect={defaultSelect}
      selectedOption={selectedOption}
      onSelectOption={(option) => {
        updateStatus(option, id);
        setSelectedOption(option);
      }}
    />
  );
});

const CustomersTable = () => {
  const [customerData, setCustomerData] = useState([]);
  const navigate = useNavigate();


  const actions = [
   
  { label: "Edit", icon:
    <FiEdit3 />,
    onClick:(row)=>navigate(`/customers/view/${row.customerId}`,{ state: { editMode: true }})
  },                        
  { label: "Print", icon: <FiPrinter /> },
  { label: "Remind", icon: <FiClock /> },
  { type: "divider" },
  { label: "Archive", icon: <FiArchive /> },
  { label: "Report Spam", icon: <FiAlertOctagon /> },
  { type: "divider" },
  { label: "Delete", icon: <FiTrash2 />,
    onClick:(row)=>deleteCustomer(row.customerId,setCustomerData)    
   },
];

  const fetchCustomer = async () => {
    try {
      const response = await axios.get("http://localhost:4500/find/customer");
      const fetched = response.data.customers;
      console.log("Fetched customers:", fetched);

      // Format backend data to match table needs
      const formattedData = fetched.map((item, index) => ({
        id: index + 1,
        customerId: item._id, // ✅ Add this line
        customer: {
          name: item.name,
          img: null, // Or use avatar url if exists
        },
        email: item.email,
        group: {
          defaultSelect: null,
          tags: [
            { value: "general", label: "General", color: "#5e72e4" },
            { value: "vip", label: "VIP", color: "#f5365c" },
          ],
        },
        phone: item.phone,
        date: new Date(item.createdAt).toLocaleDateString(),
        status: {
          defaultSelect: item.status,
          status: [
            { label: "active", value: "active" },
            { label: "inactive", value: "inactive" },
            { label: "pending", value: "pending" },
          ],
        },
        actions: "",
      }));

      setCustomerData(formattedData);
    } catch (error) {
      console.error("Error fetching customer data:", error);
      alert(`Error fetching customer data: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);


 const deleteCustomer =async (customerId,setCustomerData)=>{
  const result =await confirmDelete(customerId)
  if(!result.confirmed) return;
  try {
  const config={
    headers:{
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("crmToken"),
    },
  };
  await axios.delete(`http://localhost:4500/customer/delete/${customerId}`, config);
  setCustomerData(prevData => prevData.filter(customer => customer._id !== customerId));
await fetchCustomer();

   Swal.fire({
      title: "Deleted!",
      text: "The customer has been deleted successfully.",
      icon: "success",
      customClass:{
       confirmButton: "btn btn-success",
       cancelButton: "btn btn-danger"
      }
    })
    await fetchCustomer();
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
}


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
        const row = info.row.original;
        return (
          // customers/view
          <Link
            to={`/customers/view/${row.customerId}`}
            className="hstack gap-3"
          >
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
      cell: (info) => {
        const roles = info.getValue(); // this gives { name, img }
        const row = info.row.original;
        return (
          <Link to={`/customers/view/${row.customerId}`}>
            {info.getValue()}
          </Link>
        );
      },
    },

    // {
    //   accessorKey: 'group',
    //   header: () => 'Group',
    //   cell: (info) => {
    //     const x = info.getValue();
    //     return (
    //       <Select
    //         defaultValue={x.defaultSelect}
    //         isMulti
    //         name="tags"
    //         options={x.tags}
    //         className="basic-multi-select"
    //         classNamePrefix="select"
    //         hideSelectedOptions={false}
    //         isSearchable={false}
    //         formatOptionLabel={tags => (
    //           <div className="user-option d-flex align-items-center gap-2">
    //             <span style={{ marginTop: "1px", backgroundColor: `${tags.color}` }} className={`wd-7 ht-7 rounded-circle`}></span>
    //             <span>{tags.label}</span>
    //           </div>
    //         )}
    //       />
    //     );
    //   }
    // },
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
         
        return(
        <TableCell
        id={info.row.original.customerId}
          options={info.getValue().status}
          defaultSelect={info.getValue().defaultSelect}
        />
        )
      },
    },
    {
      accessorKey: "actions",
      header: () => "Actions",
      cell: (info) => {
        const row = info.row.original; // 👈 Access the whole row data

        return (
          <div className="hstack gap-2 justify-content-end">
            {/* 👁️ View Icon with dynamic link */}
            <Link
              to={`/customers/view/${row.customerId}`}
              className="avatar-text avatar-md"
            >
              <FiEye />
            </Link>

            {/* More actions dropdown */}
            <Dropdown
              dropdownItems={actions.map(a=>({...a,row}))}
              triggerClass="avatar-md"
              triggerPosition={"0,21"}
              triggerIcon={<FiMoreHorizontal />}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Table data={customerData} columns={columns} />
    </div>
  );
};

export default CustomersTable;
