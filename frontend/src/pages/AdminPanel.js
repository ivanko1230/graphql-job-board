import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_JOBS, GET_COMPANIES, GET_CATEGORIES } from '../graphql/queries';
import { CREATE_JOB, UPDATE_JOB, DELETE_JOB, CREATE_COMPANY, UPDATE_COMPANY, DELETE_COMPANY, CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY, GET_APPLICATIONS } from '../graphql/mutations';
import './AdminPanel.css';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [editingJob, setEditingJob] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const { data: jobsData, loading: jobsLoading } = useQuery(GET_JOBS);
  const { data: companiesData, loading: companiesLoading } = useQuery(GET_COMPANIES);
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES);
  const { data: applicationsData, loading: applicationsLoading } = useQuery(GET_APPLICATIONS);

  const [createJob] = useMutation(CREATE_JOB, {
    refetchQueries: [{ query: GET_JOBS }],
    onCompleted: () => {
      setShowJobForm(false);
      setEditingJob(null);
    },
  });

  const [updateJob] = useMutation(UPDATE_JOB, {
    refetchQueries: [{ query: GET_JOBS }],
    onCompleted: () => {
      setEditingJob(null);
    },
  });

  const [deleteJob] = useMutation(DELETE_JOB, {
    refetchQueries: [{ query: GET_JOBS }],
  });

  const [createCompany] = useMutation(CREATE_COMPANY, {
    refetchQueries: [{ query: GET_COMPANIES }],
    onCompleted: () => {
      setShowCompanyForm(false);
      setEditingCompany(null);
    },
  });

  const [updateCompany] = useMutation(UPDATE_COMPANY, {
    refetchQueries: [{ query: GET_COMPANIES }],
    onCompleted: () => {
      setEditingCompany(null);
    },
  });

  const [deleteCompany] = useMutation(DELETE_COMPANY, {
    refetchQueries: [{ query: GET_COMPANIES }],
  });

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
    onCompleted: () => {
      setShowCategoryForm(false);
      setEditingCategory(null);
    },
  });

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
    onCompleted: () => {
      setEditingCategory(null);
    },
  });

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description') || null,
    };

    if (editingCategory) {
      updateCategory({ variables: { id: editingCategory.id, input } });
    } else {
      createCategory({ variables: { input } });
    }
    e.target.reset();
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = {
      title: formData.get('title'),
      description: formData.get('description'),
      location: formData.get('location'),
      remote: formData.get('remote') === 'on',
      salary: formData.get('salary') || null,
      companyId: formData.get('companyId'),
      categoryId: formData.get('categoryId') || null,
      tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
    };

    if (editingJob) {
      updateJob({ variables: { id: editingJob.id, input } });
    } else {
      createJob({ variables: { input } });
    }
    e.target.reset();
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = {
      name: formData.get('name'),
      website: formData.get('website') || null,
      logo: formData.get('logo') || null,
      description: formData.get('description') || null,
    };

    if (editingCompany) {
      updateCompany({ variables: { id: editingCompany.id, input } });
    } else {
      createCompany({ variables: { input } });
    }
    e.target.reset();
  };

  const jobs = jobsData?.jobs?.jobs || [];
  const companies = companiesData?.companies || [];
  const categories = categoriesData?.categories || [];
  const applications = applicationsData?.applications || [];

  return (
    <div className="admin-panel-container">
      <h1>Admin Panel</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs
        </button>
        <button
          className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button
          className={`tab ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          Companies
        </button>
        <button
          className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Applications
        </button>
      </div>

      {activeTab === 'jobs' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Manage Jobs</h2>
            <button className="btn-primary" onClick={() => { setShowJobForm(true); setEditingJob(null); }}>
              + Add Job
            </button>
          </div>

          {showJobForm && (
            <div className="form-card">
              <h3>{editingJob ? 'Edit Job' : 'Create New Job'}</h3>
              <form onSubmit={handleJobSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Title *</label>
                    <input type="text" name="title" required defaultValue={editingJob?.title || ''} />
                  </div>
                  <div className="form-group">
                    <label>Company *</label>
                    <select name="companyId" required defaultValue={editingJob?.companyId || ''}>
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select name="categoryId" defaultValue={editingJob?.categoryId || ''}>
                      <option value="">No Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Location *</label>
                    <input type="text" name="location" required defaultValue={editingJob?.location || ''} />
                  </div>
                  <div className="form-group">
                    <label>Salary</label>
                    <input type="text" name="salary" defaultValue={editingJob?.salary || ''} />
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input type="checkbox" name="remote" defaultChecked={editingJob?.remote || false} />
                      Remote Position
                    </label>
                  </div>
                  <div className="form-group full-width">
                    <label>Tags (comma-separated)</label>
                    <input type="text" name="tags" defaultValue={editingJob?.tags?.join(', ') || ''} />
                  </div>
                  <div className="form-group full-width">
                    <label>Description *</label>
                    <textarea name="description" required rows="6" defaultValue={editingJob?.description || ''} />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">{editingJob ? 'Update' : 'Create'}</button>
                  <button type="button" className="btn-secondary" onClick={() => { setShowJobForm(false); setEditingJob(null); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {jobsLoading ? (
            <div className="loading">Loading jobs...</div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Remote</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>{job.company.name}</td>
                      <td>{job.location}</td>
                      <td>{job.remote ? 'Yes' : 'No'}</td>
                      <td>
                        <button className="btn-edit" onClick={() => { setEditingJob(job); setShowJobForm(true); }}>
                          Edit
                        </button>
                        <button className="btn-delete" onClick={() => {
                          if (window.confirm('Are you sure you want to delete this job?')) {
                            deleteJob({ variables: { id: job.id } });
                          }
                        }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Manage Categories</h2>
            <button className="btn-primary" onClick={() => { setShowCategoryForm(true); setEditingCategory(null); }}>
              + Add Category
            </button>
          </div>

          {showCategoryForm && (
            <div className="form-card">
              <h3>{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
              <form onSubmit={handleCategorySubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name *</label>
                    <input type="text" name="name" required defaultValue={editingCategory?.name || ''} />
                  </div>
                  <div className="form-group">
                    <label>Slug *</label>
                    <input type="text" name="slug" required defaultValue={editingCategory?.slug || ''} />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea name="description" rows="4" defaultValue={editingCategory?.description || ''} />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">{editingCategory ? 'Update' : 'Create'}</button>
                  <button type="button" className="btn-secondary" onClick={() => { setShowCategoryForm(false); setEditingCategory(null); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {categoriesLoading ? (
            <div className="loading">Loading categories...</div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.slug}</td>
                      <td>{category.description || '-'}</td>
                      <td>
                        <button className="btn-edit" onClick={() => { setEditingCategory(category); setShowCategoryForm(true); }}>
                          Edit
                        </button>
                        <button className="btn-delete" onClick={() => {
                          if (window.confirm('Are you sure you want to delete this category?')) {
                            deleteCategory({ variables: { id: category.id } });
                          }
                        }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'companies' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Manage Companies</h2>
            <button className="btn-primary" onClick={() => { setShowCompanyForm(true); setEditingCompany(null); }}>
              + Add Company
            </button>
          </div>

          {showCompanyForm && (
            <div className="form-card">
              <h3>{editingCompany ? 'Edit Company' : 'Create New Company'}</h3>
              <form onSubmit={handleCompanySubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name *</label>
                    <input type="text" name="name" required defaultValue={editingCompany?.name || ''} />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input type="url" name="website" defaultValue={editingCompany?.website || ''} />
                  </div>
                  <div className="form-group">
                    <label>Logo URL</label>
                    <input type="url" name="logo" defaultValue={editingCompany?.logo || ''} />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea name="description" rows="4" defaultValue={editingCompany?.description || ''} />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">{editingCompany ? 'Update' : 'Create'}</button>
                  <button type="button" className="btn-secondary" onClick={() => { setShowCompanyForm(false); setEditingCompany(null); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {companiesLoading ? (
            <div className="loading">Loading companies...</div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Website</th>
                    <th>Jobs</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id}>
                      <td>{company.name}</td>
                      <td>{company.website || '-'}</td>
                      <td>{company.jobs?.length || 0}</td>
                      <td>
                        <button className="btn-edit" onClick={() => { setEditingCompany(company); setShowCompanyForm(true); }}>
                          Edit
                        </button>
                        <button className="btn-delete" onClick={() => {
                          if (window.confirm('Are you sure you want to delete this company?')) {
                            deleteCompany({ variables: { id: company.id } });
                          }
                        }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="tab-content">
          <h2>Job Applications</h2>
          {applicationsLoading ? (
            <div className="loading">Loading applications...</div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>{app.name}</td>
                      <td>{app.email}</td>
                      <td>{app.job.title}</td>
                      <td>{app.job.company.name}</td>
                      <td>
                        <span className={`status-badge status-${app.status}`}>{app.status}</span>
                      </td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
