import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_JOB, CREATE_APPLICATION } from '../graphql/queries';
import './JobDetail.css';

function JobDetail() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: '',
    coverLetter: '',
  });

  const { loading, error, data } = useQuery(GET_JOB, {
    variables: { id },
  });

  const [createApplication, { loading: submitting }] = useMutation(CREATE_APPLICATION, {
    refetchQueries: [{ query: GET_JOB, variables: { id } }],
    onCompleted: () => {
      alert('Application submitted successfully!');
      setFormData({ name: '', email: '', resume: '', coverLetter: '' });
    },
    onError: (err) => {
      alert('Error submitting application: ' + err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createApplication({
      variables: {
        input: {
          jobId: id,
          ...formData,
        },
      },
    });
  };

  if (loading) return <div className="loading">Loading job details...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!data?.job) return <div className="error">Job not found</div>;

  const job = data.job;

  return (
    <div className="job-detail-container">
      <div className="job-detail">
        <div className="job-header">
          <h1>{job.title}</h1>
          {job.remote && <span className="remote-badge">Remote</span>}
        </div>

        <div className="job-company-section">
          {job.company.logo && (
            <img src={job.company.logo} alt={job.company.name} className="company-logo-large" />
          )}
          <div>
            <h2>{job.company.name}</h2>
            {job.company.website && (
              <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="company-website">
                Visit Website
              </a>
            )}
          </div>
        </div>

        <div className="job-info">
          <div className="info-item">
            <span className="info-label">📍 Location:</span>
            <span>{job.location}</span>
          </div>
          {job.salary && (
            <div className="info-item">
              <span className="info-label">💰 Salary:</span>
              <span>{job.salary}</span>
            </div>
          )}
          <div className="info-item">
            <span className="info-label">📅 Posted:</span>
            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {job.tags.length > 0 && (
          <div className="job-tags-section">
            <h3>Tags:</h3>
            <div className="tags-container">
              {job.tags.map((tag, idx) => (
                <span key={idx} className="tag-badge">{tag}</span>
              ))}
            </div>
          </div>
        )}

        <div className="job-description-section">
          <h3>Job Description</h3>
          <div className="description-content">
            {job.description.split('\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>

        {job.company.description && (
          <div className="company-description-section">
            <h3>About {job.company.name}</h3>
            <p>{job.company.description}</p>
          </div>
        )}
      </div>

      <div className="application-form-section">
        <h2>Apply for this Position</h2>
        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="resume">Resume URL</label>
            <input
              type="url"
              id="resume"
              value={formData.resume}
              onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverLetter">Cover Letter</label>
            <textarea
              id="coverLetter"
              rows="6"
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              placeholder="Tell us why you're interested in this position..."
            />
          </div>

          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JobDetail;