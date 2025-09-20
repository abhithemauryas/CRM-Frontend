import React, { useEffect, useState } from "react";
import getIcon from "@/utils/getIcon";
import axios from "axios";
import { useParams } from "react-router-dom";
import topTost from "@/utils/topTost";

const TabLeadsProfile = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();

  const fetchLeadProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:4500/lead/${id}`);
      setData(response.data.lead);
      console.log("Profile data:", response.data.lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      topTost("Error fetching lead:", "error");
    }
  };

  useEffect(() => {
    console.log("Received ID from URL:", id);
    fetchLeadProfile();
  }, []);

  const getUserNameById = (id) => {
    const user = data?.assigned?.find((u) => u._id === id || u.id === id);
    return user?.name || "Unknown";
  };

  const leadInfoData = [
    {
      title: "Name",
      content: <a href="#">{data?.name || "Loading..."}</a>,
    },
    // {
    //     title: 'Position',
    //     content: <> <a href="#">{data?.company || 'Loading...'}</a></>,
    // },
    {
      title: "Company",
      content: <a href="#">{data?.company || "Loading..."}</a>,
    },
    {
      title: "Email",
      content: (
        <a href={`mailto:${data?.email}`}>{data?.email || "Loading..."}</a>
      ),
    },
    {
      title: "Phone",
      content: <a href={`tel:${data?.phone}`}>{data?.phone || "Loading..."}</a>,
    },
    {
      title: "Website",
      content: (
        <a href={data?.website} target="_blank">
          {data?.website || "Loading..."}
        </a>
      ),
    },
    // {
    //     title: 'Lead value',
    //     // content: <a href="#">$255.50 USD</a>,
    // },
    {
      title: "Address",
      content: <a href="#">{data?.address || "Loading..."}</a>,
    },
    {
      title: "City",
      content: <a href="#">{data?.citys || "Loading..."}</a>,
    },
    {
      title: "State",
      content: <a href="#">{data?.state || "Loading..."}</a>,
    },
    {
      title: "Country",
      content: <a href="#">{data?.country || "Loading..."}</a>,
    },
    {
      title: "Disposition",
      icon: "feather-activity",
      content: (
        <a href="#">
          {
            <div className="mb-3">
              <span className="fw-semibold me-2">Current:</span>
              <span className="badge bg-primary fs-6">
                {data?.disposition || "Loading..."}
              </span>
            </div>
          }
        </a>
      ),
      text: (
        <div>
          <span className="fw-semibold mb-2 d-block">History:</span>
          <div className="d-flex flex-wrap gap-2">
            {data?.dispositionHistory?.length > 0 ? (
              [...data.dispositionHistory].reverse().map((item, index) => {
                const isLastChance =
                  data?.dispositionAttempts === 4 && index === 0; // 👈 latest risky attempt

                return (
                  <div
                    key={index}
                    className={`p-3 border rounded shadow-sm ${
                      isLastChance ? "bg-danger text-white" : "bg-light"
                    }`}
                    style={{ minWidth: "200px", maxWidth: "250px" }}
                  >
                    <div className="fw-semibold mb-1 text-truncate">
                      {item.value}{" "}
                      {item.attemptNo > 0 && (
                        <span className="badge bg-secondary ms-2">
                          Attempt {item.attemptNo}
                        </span>
                      )}
                      {isLastChance && (
                        <span className="badge bg-warning text-dark ms-2">
                          ⚠ Last Chance
                        </span>
                      )}
                    </div>
                    <div className="fs-10 text-muted mb-1">
                      {new Date(item.at).toLocaleString()} by{" "}
                      {item.by?.id ? getUserNameById(item.by.id) : "Unknown"}
                    </div>
                    {item.note && (
                      <div className="fs-10 text-secondary">
                        <strong>Note:</strong> {item.note}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-muted">No history available</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Next Action",
      content: (
        <div className="d-flex flex-column gap-2">
          {data?.nextAction?.date ? (
            <div
              className="shadow rounded overflow-hidden"
              style={{ maxWidth: 320, backgroundColor: "#fff" }}
            >
              {/* Header */}
              <div
                className="d-flex align-items-center p-2"
                style={{
                  background: "linear-gradient(90deg,#4e54c8,#8f94fb)",
                  color: "#fff",
                }}
              >
                <i className="feather-calendar me-2 fs-5"></i>
                <span className="fw-bold">Next Action</span>
              </div>

              {/* Body */}
              <div className="p-3">
                <div className="mb-2">
                  <strong>Date:</strong>{" "}
                  {new Date(data.nextAction.date).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    // hour: "2-digit",
                    // minute: "2-digit",
                  })}
                </div>

                {data?.nextAction?.note && (
                  <div
                    className="p-2 mb-2 rounded"
                    style={{ backgroundColor: "#f1f3f5", fontStyle: "italic" }}
                  >
                    "{data.nextAction.note}"
                  </div>
                )}

                <div className="d-flex gap-2 mb-3">
                  <span
                    className={`badge rounded-pill ${
                      data.nextAction.reminderSet
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {data.nextAction.reminderSet
                      ? "Reminder Set ✅"
                      : "Not Set ❌"}
                  </span>
                  <span
                    className={`badge rounded-pill ${
                      data.nextAction.reminderSent ? "bg-info" : "bg-secondary"
                    }`}
                  >
                    {data.nextAction.reminderSent ? "Sent 📩" : "Pending ⏳"}
                  </span>
                </div>

                {/* <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-primary flex-grow-1">Edit</button>
              <button className="btn btn-sm btn-outline-success flex-grow-1">Complete</button>
            </div> */}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted fst-italic">
              No next action scheduled
            </div>
          )}
        </div>
      ),
    },

    // {
    //     title: 'Zip Code',
    //      content: <a href="#">{data?.zipcode || 'Loading...'}</a>,
    // },
  ];

  const generalInfoData = [
    {
      title: "Status",
      icon: "feather-git-commit",
      text: data?.status || "Customer",
    },
    {
      title: "Source",
      icon: "feather-facebook",
      text: data?.source || "Facebook",
    },
    {
      title: "Default Language",
      icon: "feather-airplay",
      text: "System Default",
    },
    {
      title: "Privacy",
      icon: "feather-globe",
      text: data?.visibility || "Private",
    },
    {
      title: "Created",
      icon: "feather-clock",
      text: data
        ? new Date(data.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "26 MAY, 2023",
    },
    {
      title: "Assigned",
      image: "/images/avatar/1.png",
      text:
        data?.assigned
          ?.map((user) => `${user.name} (${user.email})`)
          .join(", ") || "No Assigned",
    },
    {
      title: "Lead By",
      image: "/images/avatar/5.png",
      text: "Green Cute - Website design and development",
    },
  ];

  return (
    <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
      <div className="card card-body lead-info">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">
            <span className="d-block mb-2">Lead Information :</span>
            <span className="fs-12 fw-normal text-muted d-block">
              Following information for your lead
            </span>
          </h5>
          <a href="#" className="btn btn-sm btn-light-brand">
            Create Invoice
          </a>
        </div>
        {leadInfoData.map((data, index) => (
          <Card
            key={index}
            title={data.title}
            content={data.content}
            text={data.text}
          />
        ))}
      </div>
      <hr />
      <div className="card card-body general-info">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">
            <span className="d-block mb-2">General Information :</span>
            <span className="fs-12 fw-normal text-muted d-block">
              General information for your lead
            </span>
          </h5>
          <a href="#" className="btn btn-sm btn-light-brand">
            Edit Lead
          </a>
        </div>

        {generalInfoData.map((data, index) => (
          <GeneralCard
            key={index}
            title={data.title}
            icon={data.icon}
            text={data.text}
            image={data.image}
          />
        ))}

        <div className="row mb-4">
          <div className="col-lg-2 fw-medium">Tags</div>
          <div className="col-lg-10 hstack gap-1">
            {data?.tags?.map((tag, i) => (
              <a
                key={i}
                href="#"
                className="badge bg-soft-primary text-primary"
              >
                {tag}
              </a>
            )) || (
              <>
                <a href="#" className="badge bg-soft-primary text-primary">
                  VIP
                </a>
                <a href="#" className="badge bg-soft-success text-success">
                  High Rated
                </a>
                <a href="#" className="badge bg-soft-warning text-warning">
                  Promotions
                </a>
                <a href="#" className="badge bg-soft-danger text-danger">
                  Team
                </a>
                <a href="#" className="badge bg-soft-teal text-teal">
                  Updates
                </a>
              </>
            )}
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-lg-2 fw-medium">Description</div>
          <div className="col-lg-10 hstack gap-1">
            {data?.description ||
              `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae, nulla veniam, ipsam nemo autem fugit earum accusantium reprehenderit recusandae in minima harum vitae doloremque quasi aut dolorum voluptate.`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabLeadsProfile;

const Card = ({ title, content, text }) => {
  return (
    <div className="row mb-4">
      <div className="col-lg-2 fw-medium">{title}</div>
      <div className="col-lg-10">{content}</div>
      <span>{text}</span>
    </div>
  );
};

const GeneralCard = ({ title, icon, text, image }) => {
  return (
    <div className="row mb-4">
      <div className="col-lg-2 fw-medium">{title}</div>
      <div className="col-lg-10 hstack gap-1">
        <a href="#" className="hstack gap-2">
          {icon && <div className="avatar-text avatar-sm">{getIcon(icon)}</div>}
          {image && (
            <div className="avatar-image avatar-sm">
              <img src={image} alt="" className="img-fluid" />
            </div>
          )}
          <span>{text}</span>
        </a>
      </div>
    </div>
  );
};
