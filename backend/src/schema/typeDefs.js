const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Company {
    id: ID!
    name: String!
    website: String
    logo: String
    description: String
    jobs: [Job!]!
    createdAt: String!
    updatedAt: String!
  }

  type Job {
    id: ID!
    title: String!
    description: String!
    location: String!
    remote: Boolean!
    salary: String
    company: Company!
    companyId: ID!
    tags: [String!]!
    applications: [Application!]!
    createdAt: String!
    updatedAt: String!
  }

  type Application {
    id: ID!
    job: Job!
    jobId: ID!
    name: String!
    email: String!
    resume: String
    coverLetter: String
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    jobs(
      location: String
      remote: Boolean
      tags: [String!]
      search: String
      limit: Int
      offset: Int
    ): JobList!
    job(id: ID!): Job
    companies: [Company!]!
    company(id: ID!): Company
    applications: [Application!]!
    application(id: ID!): Application
  }

  type JobList {
    jobs: [Job!]!
    total: Int!
  }

  input JobInput {
    title: String!
    description: String!
    location: String!
    remote: Boolean!
    salary: String
    companyId: ID!
    tags: [String!]
  }

  input CompanyInput {
    name: String!
    website: String
    logo: String
    description: String
  }

  input ApplicationInput {
    jobId: ID!
    name: String!
    email: String!
    resume: String
    coverLetter: String
  }

  type Mutation {
    createJob(input: JobInput!): Job!
    updateJob(id: ID!, input: JobInput!): Job!
    deleteJob(id: ID!): Boolean!
    createCompany(input: CompanyInput!): Company!
    updateCompany(id: ID!, input: CompanyInput!): Company!
    deleteCompany(id: ID!): Boolean!
    createApplication(input: ApplicationInput!): Application!
    updateApplicationStatus(id: ID!, status: String!): Application!
    deleteApplication(id: ID!): Boolean!
  }
`;

module.exports = { typeDefs };
