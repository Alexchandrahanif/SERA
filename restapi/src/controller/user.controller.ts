import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from 'express'
import { User } from '../entity/user.entity'
import EmailService from "../Emailservice"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';



export class UserController {
  private userRepository = AppDataSource.getRepository(User)
  private emailService = new EmailService(); 

  private createSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .custom((value, helpers) => {
        const isUniqueEmail = true;
  
        if (!isUniqueEmail) {
          return helpers.message({ custom: 'email must be unique' });
        }
  
        return value;
      }),
    password: Joi.string().min(5).required(),
    phoneNumber: Joi.string()
      .optional()
      .custom((value, helpers) => {
        if (!value) return value;
  
        const isUniquePhoneNumber = true;
  
        if (!isUniquePhoneNumber) {
          return helpers.message({ custom: 'phone number must be unique' });
        }
  
        return value;
      }),
    address: Joi.string().optional(),
  });


  private loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  private updateSchema = Joi.object({
    username: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    phoneNumber: Joi.string().optional(),
    address: Joi.string().optional(),
  });


  async getAll(request: Request, response: Response, next: NextFunction) {
    const { page = 1, limit = 10 } = request.query
    const skip = (page - 1) * limit

    try {
      const [users, total] = await this.userRepository.findAndCount({
        skip,
        take: limit,
      })

      return response.status(200).json({
        message: 'Successfully Displaying User Data',
        data: users,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      })
    } catch (error) {
      console.log(error)
    }
  }

  async getOne(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id)

      const dataUser = await this.userRepository.findOne({
        where: { id },
      })

      if (!dataUser) {
        return response.status(404).json({ error: 'User not found' })
      }

      return response.status(200).json({
        message: 'Successfully Displaying User Data',
        data: dataUser,
      })
    } catch (error) {
      console.error(error)
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { error, value } = this.createSchema.validate(request.body);

      if (error) {
        return response.status(400).json({ error: error.details[0].message });
      }

      const { username, email, password, phoneNumber, address } = value;


      const hashedPassword = await bcrypt.hash(password, 10); 

      const user = this.userRepository.create({
        username,
        email,
        password : hashedPassword,
        phoneNumber,
        address,
      })

      const savedUser = await this.userRepository.save(user)

      return response.status(201).json({
        message: 'Registered successfully',
        data: savedUser,
      })
    } catch (error) {
      console.log(error)
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { error, value } = this.updateSchema.validate(request.body);

      if (error) {
        return response.status(400).json({ error: error.details[0].message });
      }

      const id = parseInt(request.params.id);
      const { username, email, password, phoneNumber, address } = value;

      const existingUser = await this.userRepository.findOne({
        where: {
          id,
        },
      })

      if (!existingUser) {
        response.status(404).json({ error: 'User not found' })
      }
      const hashedPassword = await bcrypt.hash(password, 10); 

      existingUser.username = username
      existingUser.email = email
      existingUser.password = hashedPassword
      existingUser.phoneNumber = phoneNumber
      existingUser.address = address

      const updatedUser = await this.userRepository.save(existingUser)

      return response.status(200).json({
        message: 'Successfully Updated User Data',
        data: updatedUser,
      })
    } catch (error) {
      console.error(error)
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id)

      const userToRemove = await this.userRepository.findOne({
        where: {
          id,
        },
      })

      if (!userToRemove) {
        response.status(404).json({ error: 'User not found' })
      }

      await this.userRepository.remove(userToRemove)

      return response.json({ message: 'Successfully Deleting User Data' })
    } catch (error) {
      console.error(error)
    }
  }

  async sendEmail(request: Request, response: Response, next: NextFunction) {
    try {
      const { userId, message } = request.body;

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      await this.emailService.sendEmail(user.email, message);

      return response.status(200).json({
        message: 'Email sent successfully',
        userEmail: user.email,
        emailMessage: message,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const { error, value } = this.loginSchema.validate(request.body);

      if (error) {
        return response.status(400).json({ error: error.details[0].message });
      }

      const { email, password } = value;
      
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        return response.status(401).json({ error: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return response.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, 'your-secret-key', {
        expiresIn: '1h',
      });

      return response.status(200).json({
        message: 'Login successful',
        token,
      });
    } catch (error) {
      console.error(error);
    }
  }
 
}
