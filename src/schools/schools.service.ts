import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { School } from './school.model';
import { Section } from './section.model';
import { Class } from './class.model';
import { SchoolRequest } from './school-request.model';
import { Invitation } from './invitation.model';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { CreateSchoolRequestDto } from './dto/school-request.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { AddSchoolAdministratorDto } from './dto/add-school-admin.dto';
import { SendInvitationDto } from './dto/send-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { UsersService } from '../users/users.service';
import { EmailService } from '../common/email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectModel(School)
    private schoolModel: typeof School,
    @InjectModel(Section)
    private sectionModel: typeof Section,
    @InjectModel(Class)
    private classModel: typeof Class,
    @InjectModel(SchoolRequest)
    private schoolRequestModel: typeof SchoolRequest,
    @InjectModel(Invitation)
    private invitationModel: typeof Invitation,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    // Generate slug from name if not provided
    const slug = createSchoolDto.slug || this.generateSlug(createSchoolDto.name);
    return this.schoolModel.create({
      ...createSchoolDto,
      slug,
    } as any);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  }

  async findAll(): Promise<School[]> {
    return this.schoolModel.findAll();
  }

  async findOne(id: string): Promise<School> {
    const school = await this.schoolModel.findByPk(id, {
      include: [Section, Class],
    });
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const school = await this.findOne(id);
    await school.update(updateSchoolDto);
    return school;
  }

  async remove(id: string): Promise<void> {
    const school = await this.findOne(id);
    await school.destroy();
  }

  // Admin Actions

  async createEmptySchool(createSchoolDto: CreateSchoolDto): Promise<School> {
    return this.schoolModel.create({
      name: createSchoolDto.name,
      isActive: true,
    } as any);
  }

  async getSchoolDetails(id: string): Promise<School> {
    const school = await this.schoolModel.findByPk(id, {
      include: [
        { model: Section, as: 'sections' },
        { model: Class, as: 'classes' },
      ],
    });
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async createSchoolRequest(
    createSchoolRequestDto: CreateSchoolRequestDto,
  ): Promise<SchoolRequest> {
    return this.schoolRequestModel.create({
      school: createSchoolRequestDto.school,
      email: createSchoolRequestDto.email,
      phone: createSchoolRequestDto.phone,
      status: createSchoolRequestDto.status || 'pending',
    } as any);
  }

  async getAllSchoolRequests(): Promise<SchoolRequest[]> {
    return this.schoolRequestModel.findAll();
  }

  async updateSchoolRequestStatus(
    id: string,
    status: string,
  ): Promise<SchoolRequest> {
    const request = await this.schoolRequestModel.findByPk(id);
    if (!request) {
      throw new NotFoundException(`School request with ID ${id} not found`);
    }
    await request.update({ status } as any);
    return request;
  }

  async createSection(createSectionDto: CreateSectionDto): Promise<Section> {
    // Verify school exists
    const school = await this.findOne(createSectionDto.schoolId);
    if (!school) {
      throw new NotFoundException(
        `School with ID ${createSectionDto.schoolId} not found`,
      );
    }
    return this.sectionModel.create({
      name: createSectionDto.name,
      schoolId: createSectionDto.schoolId,
    } as any);
  }

  async getAllSections(): Promise<Section[]> {
    return this.sectionModel.findAll({
      include: [{ model: School, as: 'school' }],
    });
  }

  async getSectionsBySchool(schoolId: string): Promise<Section[]> {
    // Verify school exists
    await this.findOne(schoolId);
    return this.sectionModel.findAll({ where: { schoolId } });
  }

  async createClass(createClassDto: CreateClassDto): Promise<Class> {
    // Verify school exists
    const school = await this.findOne(createClassDto.schoolId);
    if (!school) {
      throw new NotFoundException(
        `School with ID ${createClassDto.schoolId} not found`,
      );
    }
    return this.classModel.create({
      class: createClassDto.class,
      schoolId: createClassDto.schoolId,
    } as any);
  }

  async getAllClasses(): Promise<Class[]> {
    return this.classModel.findAll({
      include: [{ model: School, as: 'school' }],
    });
  }

  async getClassesBySchool(schoolId: string): Promise<Class[]> {
    // Verify school exists
    await this.findOne(schoolId);
    return this.classModel.findAll({ where: { schoolId } });
  }

  async addSchoolAdministrator(
    addSchoolAdminDto: AddSchoolAdministratorDto,
  ): Promise<{ message: string }> {
    // Verify school exists
    const school = await this.findOne(addSchoolAdminDto.schoolId);
    if (!school) {
      throw new NotFoundException(
        `School with ID ${addSchoolAdminDto.schoolId} not found`,
      );
    }

    // Verify user exists
    const user = await this.usersService.findById(addSchoolAdminDto.userId);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${addSchoolAdminDto.userId} not found`,
      );
    }

    // Update user with school-admin role
    await user.update({ role: 'school-admin', schoolId: addSchoolAdminDto.schoolId });

    return { message: `User ${user.firstname} ${user.lastname} is now a school administrator for ${school.name}` };
  }

  // Invitation Methods

  async sendSchoolAdminInvitation(
    sendInvitationDto: SendInvitationDto,
    invitationLink: string,
  ): Promise<{ message: string; invitationId: string }> {
    // Verify school exists
    const school = await this.findOne(sendInvitationDto.schoolId);
    if (!school) {
      throw new NotFoundException(
        `School with ID ${sendInvitationDto.schoolId} not found`,
      );
    }

    // Check if invitation already exists and is pending
    const existingInvitation = await this.invitationModel.findOne({
      where: {
        email: sendInvitationDto.email,
        schoolId: sendInvitationDto.schoolId,
        status: 'pending',
      },
    });

    if (existingInvitation) {
      throw new BadRequestException(
        'An active invitation already exists for this email and school',
      );
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');

    // Create expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invitation
    const invitation = await this.invitationModel.create({
      email: sendInvitationDto.email,
      token,
      schoolId: sendInvitationDto.schoolId,
      status: 'pending',
      expiresAt,
    } as any);

    // Send invitation email
    await this.emailService.sendSchoolAdminInvitation(
      sendInvitationDto.email,
      school.name,
      invitationLink,
    );

    return {
      message: `Invitation sent to ${sendInvitationDto.email}`,
      invitationId: invitation.id,
    };
  }

  async acceptInvitation(
    acceptInvitationDto: AcceptInvitationDto,
  ): Promise<{ message: string; user: any }> {
    // Find invitation by token
    const invitation = await this.invitationModel.findOne({
      where: { token: acceptInvitationDto.token },
      include: [School],
    });

    if (!invitation) {
      throw new NotFoundException('Invalid or expired invitation link');
    }

    if (invitation.status !== 'pending') {
      throw new BadRequestException(
        `Invitation has already been ${invitation.status}`,
      );
    }

    // Check if invitation has expired
    if (new Date() > invitation.expiresAt) {
      await invitation.update({ status: 'expired' } as any);
      throw new BadRequestException('Invitation has expired');
    }

    // Check if user already exists with this email
    let user = await this.usersService.findByEmail(invitation.email);

    if (user) {
      // Update existing user
      await user.update({
        firstname: acceptInvitationDto.firstname,
        lastname: acceptInvitationDto.lastname,
        role: 'school-admin',
        schoolId: invitation.schoolId,
      });
    } else {
      // Create new user
      user = await this.usersService.create({
        email: invitation.email,
        firstname: acceptInvitationDto.firstname,
        lastname: acceptInvitationDto.lastname,
        password: acceptInvitationDto.password,
        role: 'school-admin',
        schoolId: invitation.schoolId,
      });
    }

    // Update invitation status
    await invitation.update({ status: 'accepted' } as any);

    return {
      message: `Welcome ${acceptInvitationDto.firstname}! You are now a school administrator for ${invitation.school?.name}`,
      user,
    };
  }

  async getInvitationStatus(token: string): Promise<{
    valid: boolean;
    email?: string;
    schoolName?: string;
    expiresAt?: Date;
  }> {
    const invitation = await this.invitationModel.findOne({
      where: { token },
      include: [School],
    });

    if (!invitation) {
      return { valid: false };
    }

    if (invitation.status !== 'pending') {
      return { valid: false };
    }

    if (new Date() > invitation.expiresAt) {
      await invitation.update({ status: 'expired' } as any);
      return { valid: false };
    }

    return {
      valid: true,
      email: invitation.email,
      schoolName: invitation.school?.name,
      expiresAt: invitation.expiresAt,
    };
  }

  // School Administrator Management

  async addSchoolAdminBySchoolAdmin(
    schoolId: string,
    userId: string,
  ): Promise<{ message: string }> {
    // Verify school exists
    const school = await this.findOne(schoolId);
    if (!school) {
      throw new NotFoundException(
        `School with ID ${schoolId} not found`,
      );
    }

    // Verify user exists
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found`,
      );
    }

    // Update user to school-admin
    await user.update({
      role: 'school-admin',
      schoolId,
    });

    return {
      message: `${user.firstname} ${user.lastname} is now a school administrator for ${school.name}`,
    };
  }

  async revokeSchoolAdmin(
    schoolId: string,
    userId: string,
  ): Promise<{ message: string }> {
    // Verify school exists
    const school = await this.findOne(schoolId);
    if (!school) {
      throw new NotFoundException(
        `School with ID ${schoolId} not found`,
      );
    }

    // Verify user exists and is a school-admin for this school
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found`,
      );
    }

    if (user.role !== 'school-admin' || user.schoolId !== schoolId) {
      throw new BadRequestException(
        `User is not a school administrator for this school`,
      );
    }

    // Revoke admin role - change to instructor or student
    await user.update({
      role: 'instructor',
      schoolId: undefined,
    });

    return {
      message: `${user.firstname} ${user.lastname}'s administrator privileges have been revoked`,
    };
  }

  async getSchoolAdmins(schoolId: string): Promise<any[]> {
    // Verify school exists
    await this.findOne(schoolId);

    return this.usersService.findByRoleAndSchool('school-admin', schoolId);
  }

  async updateSchoolInfo(
    schoolId: string,
    updateData: any,
  ): Promise<School> {
    const school = await this.findOne(schoolId);
    if (!school) {
      throw new NotFoundException(
        `School with ID ${schoolId} not found`,
      );
    }

    await school.update(updateData);
    return this.getSchoolDetails(schoolId);
  }
}
