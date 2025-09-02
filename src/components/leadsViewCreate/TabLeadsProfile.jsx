import React, { useEffect, useState } from 'react'
import getIcon from '@/utils/getIcon';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import topTost from '@/utils/topTost';

const TabLeadsProfile = () => {
    const [data, setData] = useState(null);
    const { id } = useParams();

    const fetchLeadProfile = async () => {
        try {
            const response = await axios.get(`https://crm-backend-bxsr.onrender.com/lead/${id}`);
            setData(response.data.lead);
            console.log("Profile data:", response.data.lead);
        } catch (error) {
            console.error("Error fetching lead:", error);
            topTost("Error fetching lead:", "error")
        }
    }

    useEffect(() => {
        console.log("Received ID from URL:", id);
        fetchLeadProfile();
    }, []);

    const leadInfoData = [
        {
            title: 'Name',
            content: <a href="#">{data?.name || 'N/A'}</a>,
        },
        // {
        //     title: 'Position',
        //     content: <> <a href="#">{data?.company || 'N/A'}</a></>,
        // },
        {
            title: 'Company',
            content: <a href="#">{data?.company || 'N/A'}</a>,
        },
        {
            title: 'Email',
            content: <a href={`mailto:${data?.email}`}>{data?.email || 'N/A'}</a>,
        },
        {
            title: 'Phone',
            content: <a href={`tel:${data?.phone}`}>{data?.phone || 'N/A'}</a>,
        },
        {
            title: 'Website',
            content: <a href={data?.website} target="_blank">{data?.website || 'N/A'}</a>,
        },
        // {
        //     title: 'Lead value',
        //     // content: <a href="#">$255.50 USD</a>,
        // },
        {
            title: 'Address',
            content: <a href="#">{data?.address || 'N/A'}</a>,
        },
        {
            title: 'City',
           content: <a href="#">{data?.citys || 'N/A'}</a>,
        },
        {
            title: 'State',
         content: <a href="#">{data?.state || 'N/A'}</a>,
        },
        {
            title: 'Country',
           content: <a href="#">{data?.country || 'N/A'}</a>,
        },
        {
            title: 'Zip Code',
             content: <a href="#">{data?.zipcode || 'N/A'}</a>,
        },
    ];

    const generalInfoData = [
        {
            title: 'Status',
            icon: 'feather-git-commit',
            text: data?.status || 'Customer',
        },
        {
            title: 'Source',
            icon: 'feather-facebook',
            text: data?.source || 'Facebook',
        },
        {
            title: 'Default Language',
            icon: 'feather-airplay',
            text: 'System Default',
        },
        {
            title: 'Privacy',
            icon: 'feather-globe',
            text: data?.visibility || 'Private',
        },
        {
            title: 'Created',
            icon: 'feather-clock',
            text: data ? new Date(data.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) : '26 MAY, 2023',
        },
        {
  title: 'Assigned',
  image: '/images/avatar/1.png',
  text: data?.assigned?.map(user => `${user.name} (${user.email})`).join(', ') || 'No Assigned',
},
        {
            title: 'Lead By',
            image: '/images/avatar/5.png',
            text: 'Green Cute - Website design and development',
        },
    ];

    return (
        <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
            <div className="card card-body lead-info">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">
                        <span className="d-block mb-2">Lead Information :</span>
                        <span className="fs-12 fw-normal text-muted d-block">Following information for your lead</span>
                    </h5>
                    <a href="#" className="btn btn-sm btn-light-brand">Create Invoice</a>
                </div>
                {leadInfoData.map((data, index) => (
                    <Card
                        key={index}
                        title={data.title}
                        content={data.content}
                    />
                ))}
            </div>
            <hr />
            <div className="card card-body general-info">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">
                        <span className="d-block mb-2">General Information :</span>
                        <span className="fs-12 fw-normal text-muted d-block">General information for your lead</span>
                    </h5>
                    <a href="#" className="btn btn-sm btn-light-brand">Edit Lead</a>
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
                            <a key={i} href="#" className="badge bg-soft-primary text-primary">{tag}</a>
                        )) || (
                            <>
                                <a href="#" className="badge bg-soft-primary text-primary">VIP</a>
                                <a href="#" className="badge bg-soft-success text-success">High Rated</a>
                                <a href="#" className="badge bg-soft-warning text-warning">Promotions</a>
                                <a href="#" className="badge bg-soft-danger text-danger">Team</a>
                                <a href="#" className="badge bg-soft-teal text-teal">Updates</a>
                            </>
                        )}
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-lg-2 fw-medium">Description</div>
                    <div className="col-lg-10 hstack gap-1">
                        {data?.description || `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae, nulla veniam, ipsam nemo autem fugit earum accusantium reprehenderit recusandae in minima harum vitae doloremque quasi aut dolorum voluptate.`}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TabLeadsProfile

const Card = ({ title, content }) => {
    return (
        <div className="row mb-4">
            <div className="col-lg-2 fw-medium">{title}</div>
            <div className="col-lg-10">{content}</div>
        </div>
    );
};

const GeneralCard = ({ title, icon, text, image }) => {
    return (
        <div className="row mb-4">
            <div className="col-lg-2 fw-medium">{title}</div>
            <div className="col-lg-10 hstack gap-1">
                <a href="#" className="hstack gap-2">
                    {icon && (
                        <div className="avatar-text avatar-sm">
                            {getIcon(icon)}
                        </div>
                    )}
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
