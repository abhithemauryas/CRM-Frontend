export const user = [
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
            onSelectOption={(option,leadId) => {
              updateStatus(option, leadId);
            }}
          />
        );
      },
    },
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
              dropdownItems={actions.map(a => ({ ...a, row }))}
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
]