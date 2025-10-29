import { gql } from '@apollo/client';

export const CREATE_JOB = gql`
  mutation CreateJob($input: JobInput!) {
    createJob(input: $input) {
      id
      title
      description
      location
      remote
      salary
      tags
      category {
        id
        name
      }
      company {
        id
        name
      }
    }
  }
`;

export const UPDATE_JOB = gql`
  mutation UpdateJob($id: ID!, $input: JobInput!) {
    updateJob(id: $id, input: $input) {
      id
      title
      description
      location
      remote
      salary
      tags
      category {
        id
        name
      }
      company {
        id
        name
      }
    }
  }
`;

export const DELETE_JOB = gql`
  mutation DeleteJob($id: ID!) {
    deleteJob(id: $id)
  }
`;

export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CompanyInput!) {
    createCompany(input: $input) {
      id
      name
      website
      logo
      description
    }
  }
`;

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: ID!, $input: CompanyInput!) {
    updateCompany(id: $id, input: $input) {
      id
      name
      website
      logo
      description
    }
  }
`;

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id)
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
      name
      slug
      description
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      slug
      description
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export const GET_APPLICATIONS = gql`
  query GetApplications {
    applications {
      id
      name
      email
      status
      createdAt
      job {
        id
        title
        company {
          name
        }
      }
    }
  }
`;
