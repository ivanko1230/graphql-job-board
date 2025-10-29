const { prisma } = require('../db/prisma');

const resolvers = {
  Query: {
    jobs: async (_, args) => {
      const { location, remote, tags, search, limit = 50, offset = 0 } = args;
      
      const where = {};
      
      if (location) {
        where.location = { contains: location, mode: 'insensitive' };
      }
      
      if (remote !== undefined) {
        where.remote = remote;
      }
      
      if (tags && tags.length > 0) {
        where.tags = { hasSome: tags };
      }
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
      
      const [jobs, total] = await Promise.all([
        prisma.job.findMany({
          where,
          include: {
            company: true,
            applications: true,
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.job.count({ where }),
      ]);
      
      return { jobs, total };
    },
    
    job: async (_, { id }) => {
      return prisma.job.findUnique({
        where: { id },
        include: {
          company: true,
          applications: true,
        },
      });
    },
    
    companies: async () => {
      return prisma.company.findMany({
        include: { jobs: true },
        orderBy: { name: 'asc' },
      });
    },
    
    company: async (_, { id }) => {
      return prisma.company.findUnique({
        where: { id },
        include: { jobs: true },
      });
    },
    
    applications: async () => {
      return prisma.application.findMany({
        include: { job: { include: { company: true } } },
        orderBy: { createdAt: 'desc' },
      });
    },
    
    application: async (_, { id }) => {
      return prisma.application.findUnique({
        where: { id },
        include: { job: { include: { company: true } } },
      });
    },
  },
  
  Mutation: {
    createJob: async (_, { input }) => {
      return prisma.job.create({
        data: {
          ...input,
          tags: input.tags || [],
        },
        include: { company: true },
      });
    },
    
    updateJob: async (_, { id, input }) => {
      return prisma.job.update({
        where: { id },
        data: input,
        include: { company: true },
      });
    },
    
    deleteJob: async (_, { id }) => {
      await prisma.job.delete({ where: { id } });
      return true;
    },
    
    createCompany: async (_, { input }) => {
      return prisma.company.create({ data: input });
    },
    
    updateCompany: async (_, { id, input }) => {
      return prisma.company.update({
        where: { id },
        data: input,
      });
    },
    
    deleteCompany: async (_, { id }) => {
      await prisma.company.delete({ where: { id } });
      return true;
    },
    
    createApplication: async (_, { input }) => {
      return prisma.application.create({
        data: input,
        include: { job: { include: { company: true } } },
      });
    },
    
    updateApplicationStatus: async (_, { id, status }) => {
      return prisma.application.update({
        where: { id },
        data: { status },
        include: { job: { include: { company: true } } },
      });
    },
    
    deleteApplication: async (_, { id }) => {
      await prisma.application.delete({ where: { id } });
      return true;
    },
  },
};

module.exports = { resolvers };
