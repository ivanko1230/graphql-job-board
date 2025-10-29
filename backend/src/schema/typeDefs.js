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

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
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
    category: Category
    categoryId: ID
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
      categoryId: ID
      search: String
      limit: Int
      offset: Int
    ): JobList!
    job(id: ID!): Job
    categories: [Category!]!
    category(id: ID!): Category
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
    categoryId: ID
    tags: [String!]
  }

  input CategoryInput {
    name: String!
    slug: String!
    description: String
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
    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
    createCompany(input: CompanyInput!): Company!
    updateCompany(id: ID!, input: CompanyInput!): Company!
    deleteCompany(id: ID!): Boolean!
    createApplication(input: ApplicationInput!): Application!
    updateApplicationStatus(id: ID!, status: String!): Application!
    deleteApplication(id: ID!): Boolean!
  }
`;

module.exports = { typeDefs };
