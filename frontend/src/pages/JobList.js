import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_JOBS, GET_CATEGORIES } from '../graphql/queries';
import './JobList.css';

function JobList() {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    remote: null,
    tags: [],
    categoryId: null,
  });

  const { loading, error, data, refetch } = useQuery(GET_JOBS, {
    variables: {
      search: filters.search || undefined,
      location: filters.location || undefined,
      remote: filters.remote,
      tags: filters.tags.length > 0 ? filters.tags : undefined,
      categoryId: filters.categoryId || undefined,
    },
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const toggleTag = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const commonTags = ['JavaScript', 'React', 'Node.js', 'Python', 'Full Stack', 'Remote', 'Frontend', 'Backend'];

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const jobs = data?.jobs?.jobs || [];
  const total = data?.jobs?.total || 0;

  return (
    <div className="job-list-container">
      <h1>Job Listings</h1>
      
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search jobs..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="location-input"
          />
          <label className="remote-filter">
            <input
              type="checkbox"
              checked={filters.remote === true}
              onChange={(e) => setFilters({ ...filters, remote: e.target.checked ? true : null })}
            />
            Remote Only
          </label>
          <button type="submit" className="search-button">Search</button>
        </form>

        {(categoriesData?.categories || []).length > 0 && (
          <div className="categories-section">
            <h3>Filter by Category:</h3>
            <div className="categories-container">
              <button
                onClick={() => setFilters({ ...filters, categoryId: null })}
                className={`category-btn ${!filters.categoryId ? 'active' : ''}`}
              >
                All Categories
              </button>
              {categoriesData.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters({ ...filters, categoryId: cat.id })}
                  className={`category-btn ${filters.categoryId === cat.id ? 'active' : ''}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="tags-section">
          <h3>Filter by Tags:</h3>
          <div className="tags-container">
            {commonTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`tag ${filters.tags.includes(tag) ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="results-info">
        <p>Found {total} job{total !== 1 ? 's' : ''}</p>
      </div>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <Link key={job.id} to={`/job/${job.id}`} className="job-card">
            <div className="job-header">
              <h2>{job.title}</h2>
              {job.remote && <span className="remote-badge">Remote</span>}
            </div>
            <div className="job-company">
              {job.company.logo && (
                <img src={job.company.logo} alt={job.company.name} className="company-logo" />
              )}
              <span className="company-name">{job.company.name}</span>
            </div>
            {job.category && (
              <span className="job-category">{job.category.name}</span>
            )}
            <p className="job-location">📍 {job.location}</p>
            <p className="job-description">{job.description.substring(0, 150)}...</p>
            {job.salary && <p className="job-salary">💰 {job.salary}</p>}
            <div className="job-tags">
              {job.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="tag-badge">{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="no-jobs">No jobs found. Try adjusting your filters.</div>
      )}
    </div>
  );
}

export default JobList;
