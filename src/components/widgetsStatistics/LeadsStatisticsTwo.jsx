import React, { useEffect, useState } from "react";
import axios from "axios";
import getIcon from "@/utils/getIcon";

const LeadsStatisticsTwo = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get("http://localhost:4500/lead/all"); // apna API URL daalo
        const leads = res.data.leads;

        // ✅ Calculation
        const totalLeads = leads.length;
        const openLeads = leads.filter((l) => l.status === "open").length;
        const workingLeads = leads.filter((l) => l.status === "working").length;
        const closedLeads = leads.filter((l) => l.status === "closed").length;

        // ✅ Percentage Helper
        const percentage = (part, total) =>
          total ? ((part / total) * 100).toFixed(2) + "%" : "0%";

        setStats([
          {
            icon: "feather-users",
            title: "Total Leads",
            count: totalLeads,
            percentage: "100%",
            arrowIcon: "feather-arrow-up",
            color: "primary",
            trend: "up",
          },
          {
            icon: "feather-user-check",
            title: "Open Leads",
            count: openLeads,
            percentage: percentage(openLeads, totalLeads),
            arrowIcon: "feather-arrow-up",
            color: "success",
            trend: "up",
          },
          {
            icon: "feather-user-plus",
            title: "Working Leads",
            count: workingLeads,
            percentage: percentage(workingLeads, totalLeads),
            arrowIcon: "feather-arrow-up",
            color: "teal",
            trend: "up",
          },
          {
            icon: "feather-user-minus",
            title: "Closed Leads",
            count: closedLeads,
            percentage: percentage(closedLeads, totalLeads),
            arrowIcon: "feather-arrow-down",
            color: "danger",
            trend: "down",
          },
        ]);
      } catch (error) {
        console.error("Error fetching leads", error);
      }
    };

    fetchLeads();
  }, []);

  return (
    <>
      {stats.map(
        (
          { arrowIcon, color, count, icon, percentage, title, trend },
          index
        ) => (
          <div key={index} className="col-xxl-3 col-md-6 customer-header-card">
            <div className="card stretch stretch-full">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className={`avatar-text avatar-xl rounded text-${color} bg-soft-${color}`}
                    >
                      {React.cloneElement(getIcon(icon), { size: 17 })}
                    </div>
                    <a href="#" className="fw-bold d-block">
                      <span className="text-truncate-1-line">{title}</span>
                      <span className="fs-24 fw-bolder d-block">{count}</span>
                    </a>
                  </div>
                  <div
                    className={`badge ${
                      trend === "up"
                        ? "bg-soft-success text-success"
                        : "bg-soft-danger text-danger"
                    }`}
                  >
                    {React.cloneElement(getIcon(arrowIcon), {
                      size: 10,
                      className: "me-1",
                    })}
                    <span>{percentage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default LeadsStatisticsTwo;
