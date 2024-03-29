import { describe, it, before, after, beforeEach } from 'mocha'

import { expect } from 'chai'
import { createConnection, getConnection } from 'typeorm'
import { User } from '../src/entity/user.entity'
import { DataSource } from 'typeorm'
import { UserController } from '../src/controller/user.controller'
import AppDataSource from '../src/data-source'

describe('UserController', () => {
  let userController: UserController

  before(async () => {
    // await createConnection(); // Connect to the database
    userController = new UserController()
  })

  after(async () => {
    // await getConnection().close(); // Close the database connection
  })

  describe('Get All Users', () => {
    it('should return a list of users with pagination', async () => {
      const request = { query: { page: 1, limit: 10 } }
      const response = {
        status: (code: number) => ({ json: (data: any) => ({ code, data }) }),
      }

      await userController.getAll(request as any, response as any, () => {})

      // Add assertions based on your expected behavior
      // For example:
      // expect(response.code).to.equal(200);
      // expect(response.data.message).to.equal('Successfully Displaying User Data');
      // expect(response.data.data.length).to.equal(10);
    })
  })

  describe('Get One Users', () => {
    it('should return a single user by ID', async () => {
      const request = { params: { id: 1 } }
      const response = {
        status: (code: number) => ({ json: (data: any) => ({ code, data }) }),
      }

      await userController.getOne(request as any, response as any, () => {})

      // Add assertions based on your expected behavior
      // For example:
      // expect(response.code).to.equal(200);
      // expect(response.data.message).to.equal('Successfully Displaying User Data');
      // expect(response.data.data.id).to.equal(1);
    })
  })

  describe('Create Users', () => {
    it('Register User', async () => {
      const request = {
        body: {
          username: 'create',
          email: 'create@example.com',
          password: 'createpassword',
          phoneNumber: '1234567890',
          address: 'create Address',
        },
      }
      const response = {
        status: (code: number) => ({
          json: (data: any) => ({ code, data }),
        }),
      }

      await userController.create(request as any, response as any, () => {})

      // Add assertions based on your expected behavior
      // For example:
      // expect(response.code).to.equal(200);
      // expect(response.data.message).to.equal('Successfully Displaying User Data');
      // expect(response.data.data.id).to.equal(1);
    })
  })

  describe('Update Users', () => {
    it('Update User By Id', async () => {
      const request = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'testpassword',
          phoneNumber: '1234567890',
          address: 'Test Address',
        },
      }
      const response = {
        status: (code: number) => ({
          json: (data: any) => ({ code, data }),
        }),
      }

      await userController.update(request as any, response as any, () => {})

      // Add assertions based on your expected behavior
      // For example:
      // expect(response.code).to.equal(200);
      // expect(response.data.message).to.equal('Successfully Displaying User Data');
      // expect(response.data.data.id).to.equal(1);
    })
  })

  describe('Delete Users', () => {
    it('Delete User By Id', async () => {
      const request = { params: { id: 1 } }
      const response = {
        status: (code: number) => ({ json: (data: any) => ({ code, data }) }),
      }

      await userController.delete(request as any, response as any, () => {})

      // Add assertions based on your expected behavior
      // For example:
      // expect(response.code).to.equal(200);
      // expect(response.data.message).to.equal('Successfully Displaying User Data');
      // expect(response.data.data.id).to.equal(1);
    })
  })

  describe('sendEmail', () => {
    it('should send an email to the user', async () => {
      const request = { body: { userId: 1, message: 'Test message' } }
      const response = {
        status: (code: number) => ({ json: (data: any) => ({ code, data }) }),
      }

      await userController.sendEmail(request as any, response as any, () => {})

      // Add assertions based on your expected behavior
      // For example:
      // expect(response.code).to.equal(200);
      // expect(response.data.message).to.equal('Email sent successfully');
    })
  })

  describe('Login Users', () => {
    it('Login User ', async () => {
      const request = {
        body: {
          email: 'test@example.com',
          password: 'testpassword',
        },
      }
      const response = {
        status: (code: number) => ({
          json: (data: any) => ({ code, data }),
        }),
      }

      await userController.login(request as any, response as any, () => {})

      // Add assertions based on your expected behavior
      // For example:
      // expect(response.code).to.equal(200);
      // expect(response.data.message).to.equal('Successfully Displaying User Data');
      // expect(response.data.data.id).to.equal(1);
    })
  })
})
