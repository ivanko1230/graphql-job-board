import React, { useState, useEffect, useMemo } from 'react';
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
    sortBy: 'date',
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const { loading, error, data } = useQuery(GET_JOBS, {
    variables: {
      search: filters.search || undefined,
      location: filters.location || undefined,
      remote: filters.remote,
      tags: filters.tags.length > 0 ? filters.tags : undefined,
      categoryId: filters.categoryId || undefined,
    },
    fetchPolicy: 'cache-and-network',
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  // Auto-refetch when filters change (debounced for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Query will automatically update
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const toggleTag = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const clearFilter = (filterType) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (filterType === 'search') newFilters.search = '';
      else if (filterType === 'location') newFilters.location = '';
      else if (filterType === 'remote') newFilters.remote = null;
      else if (filterType === 'categoryId') newFilters.categoryId = null;
      else if (filterType === 'tags') newFilters.tags = [];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      location: '',
      remote: null,
      tags: [],
      categoryId: null,
      sortBy: 'date',
    });
  };

  const hasActiveFilters = useMemo(() => {
    return filters.search || filters.location || filters.remote !== null || 
           filters.tags.length > 0 || filters.categoryId;
  }, [filters]);

  const commonTags = ['JavaScript', 'React', 'Node.js', 'Python', 'Full Stack', 'Remote', 'Frontend', 'Backend'];

  if (loading && !data) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  let jobs = data?.jobs?.jobs || [];
  const total = data?.jobs?.total || 0;

  // Client-side sorting
  jobs = [...jobs].sort((a, b) => {
    if (filters.sortBy === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (filters.sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="job-list-container">
      <div className="header-section">
        <h1>Job Listings</h1>
        <div className="sort-controls">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="sort-select"
          >
            <option value="date">Newest First</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>
      
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search jobs by title or description..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="search-input"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => clearFilter('search')}
                className="clear-filter-btn"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <div className="location-input-wrapper">
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="location-input"
            />
            {filters.location && (
              <button
                type="button"
                onClick={() => clearFilter('location')}
                className="clear-filter-btn"
                aria-label="Clear location"
              >
                ×
              </button>
            )}
          </div>
          <label className="remote-filter">
            <input
              type="checkbox"
              checked={filters.remote === true}
              onChange={(e) => setFilters({ ...filters, remote: e.target.checked ? true : null })}
            />
            Remote Only
          </label>
        </form>

        {/* Active Filters Chips */}
        {hasActiveFilters && (
          <div className="active-filters">
            <span className="active-filters-label">Active filters:</span>
            {filters.search && (
              <span className="filter-chip">
                Search: "{filters.search}"
                <button onClick={() => clearFilter('search')} className="chip-remove">×</button>
              </span>
            )}
            {filters.location && (
              <span className="filter-chip">
                Location: {filters.location}
                <button onClick={() => clearFilter('location')} className="chip-remove">×</button>
              </span>
            )}
            {filters.remote && (
              <span className="filter-chip">
                Remote Only
                <button onClick={() => clearFilter('remote')} className="chip-remove">×</button>
              </span>
            )}
            {filters.categoryId && categoriesData?.categories && (
              <span className="filter-chip">
                Category: {categoriesData.categories.find(c => c.id === filters.categoryId)?.name}
                <button onClick={() => clearFilter('categoryId')} className="chip-remove">×</button>
              </span>
            )}
            {filters.tags.map((tag) => (
              <span key={tag} className="filter-chip">
                {tag}
                <button onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    tags: prev.tags.filter(t => t !== tag)
                  }));
                }} className="chip-remove">×</button>
              </span>
            ))}
            <button onClick={clearAllFilters} className="clear-all-btn">
              Clear All
            </button>
          </div>
        )}

        <div className="filter-sections">
          {(categoriesData?.categories || []).length > 0 && (
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="categories-container">
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, categoryId: null })}
                  className={`category-btn ${!filters.categoryId ? 'active' : ''}`}
                >
                  All
                </button>
                {categoriesData.categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFilters({ ...filters, categoryId: cat.id })}
                    className={`category-btn ${filters.categoryId === cat.id ? 'active' : ''}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="filter-section">
            <div className="filter-section-header">
              <h3>Skills & Technologies</h3>
              {!showAdvancedFilters && filters.tags.length === 0 && (
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters(true)}
                  className="toggle-filters-btn"
                >
                  Show More
                </button>
              )}
            </div>
            {(showAdvancedFilters || filters.tags.length > 0) && (
              <div className="tags-container">
                {commonTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`tag ${filters.tags.includes(tag) ? 'active' : ''}`}
                  >
                    {tag}
                  </button>
                ))}
                {showAdvancedFilters && (
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(false)}
                    className="toggle-filters-btn"
                  >
                    Show Less
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="results-info">
        <p>
          {loading ? (
            <>Searching...</>
          ) : (
            <>
              Found <strong>{total}</strong> job{total !== 1 ? 's' : ''}
              {hasActiveFilters && ' matching your filters'}
            </>
          )}
        </p>
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
