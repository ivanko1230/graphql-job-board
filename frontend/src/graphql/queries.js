import { gql } from '@apollo/client';

export const GET_JOBS = gql`
  query GetJobs($location: String, $remote: Boolean, $tags: [String!], $search: String, $limit: Int, $offset: Int) {
    jobs(location: $location, remote: $remote, tags: $tags, search: $search, limit: $limit, offset: $offset) {
      jobs {
        id
        title
        description
        location
        remote
        salary
        tags
        createdAt
        company {
          id
          name
          logo
        }
      }
      total
    }
  }
`;

export const GET_JOB = gql`
  query GetJob($id: ID!) {
    job(id: $id) {
      id
      title
      description
      location
      remote
      salary
      tags
      createdAt
      company {
        id
        name
        website
        logo
        description
      }
    }
  }
`;

export const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      id
      name
      website
      logo
    }
  }
`;

export const CREATE_APPLICATION = gql`
  mutation CreateApplication($input: ApplicationInput!) {
    createApplication(input: $input) {
      id
      name
      email
      status
      createdAt
    }
  }
`;
