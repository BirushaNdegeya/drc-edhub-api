import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { CreateSchoolRequestDto } from './dto/school-request.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { AddSchoolAdministratorDto } from './dto/add-school-admin.dto';
import { SendInvitationDto } from './dto/send-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { SchoolAdminGuard } from '../common/guards/school-admin.guard';

@ApiTags('Schools')
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create a new school' })
  @ApiResponse({ status: 201, description: 'School created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.create(createSchoolDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all schools' })
  @ApiResponse({ status: 200, description: 'List of all schools' })
  findAll() {
    return this.schoolsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get school by ID' })
  @ApiResponse({ status: 200, description: 'School found' })
  @ApiResponse({ status: 404, description: 'School not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update school by ID' })
  @ApiResponse({ status: 200, description: 'School updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'School not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    return this.schoolsService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Delete school by ID' })
  @ApiResponse({ status: 200, description: 'School deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'School not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.remove(id);
  }

  // Admin Actions

  @Post('admin/create-empty')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create an empty school (Admin only)' })
  @ApiResponse({ status: 201, description: 'School created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  async createEmptySchool(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.createEmptySchool(createSchoolDto);
  }

  @Get('admin/:id/details')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all school details including sections and classes (Admin only)' })
  @ApiResponse({ status: 200, description: 'School details retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async getSchoolDetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.getSchoolDetails(id);
  }

  @Post('admin/school-requests')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create a new school request (Admin only)' })
  @ApiResponse({ status: 201, description: 'School request created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  async createSchoolRequest(@Body() createSchoolRequestDto: CreateSchoolRequestDto) {
    return this.schoolsService.createSchoolRequest(createSchoolRequestDto);
  }

  @Get('admin/school-requests')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all school requests (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all school requests' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  async getAllSchoolRequests() {
    return this.schoolsService.getAllSchoolRequests();
  }

  @Patch('admin/school-requests/:id/status')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update school request status (Admin only)' })
  @ApiResponse({ status: 200, description: 'School request updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  @ApiResponse({ status: 404, description: 'School request not found' })
  async updateSchoolRequestStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: string },
  ) {
    return this.schoolsService.updateSchoolRequestStatus(id, body.status);
  }

  @Post('admin/sections')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create a new section/department (Admin only)' })
  @ApiResponse({ status: 201, description: 'Section created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async createSection(@Body() createSectionDto: CreateSectionDto) {
    return this.schoolsService.createSection(createSectionDto);
  }

  @Get('admin/sections')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all sections (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all sections' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  async getAllSections() {
    return this.schoolsService.getAllSections();
  }

  @Get('admin/:schoolId/sections')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all sections for a school (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of sections for school' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async getSectionsBySchool(@Param('schoolId', ParseUUIDPipe) schoolId: string) {
    return this.schoolsService.getSectionsBySchool(schoolId);
  }

  @Post('admin/classes')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create a new class (Admin only)' })
  @ApiResponse({ status: 201, description: 'Class created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async createClass(@Body() createClassDto: CreateClassDto) {
    return this.schoolsService.createClass(createClassDto);
  }

  @Get('admin/classes')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all classes (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all classes' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  async getAllClasses() {
    return this.schoolsService.getAllClasses();
  }

  @Get('admin/:schoolId/classes')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all classes for a school (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of classes for school' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async getClassesBySchool(@Param('schoolId', ParseUUIDPipe) schoolId: string) {
    return this.schoolsService.getClassesBySchool(schoolId);
  }

  @Post('admin/add-administrator')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Add a school administrator (Admin only)' })
  @ApiResponse({ status: 201, description: 'Administrator added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  @ApiResponse({ status: 404, description: 'School or User not found' })
  async addSchoolAdministrator(@Body() addSchoolAdminDto: AddSchoolAdministratorDto) {
    return this.schoolsService.addSchoolAdministrator(addSchoolAdminDto);
  }

  // Invitation Endpoints

  @Post('admin/send-invitation')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Send school administrator invitation via email (Admin only)' })
  @ApiResponse({ status: 201, description: 'Invitation sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  @ApiResponse({ status: 400, description: 'Invitation already exists' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async sendInvitation(
    @Body() sendInvitationDto: SendInvitationDto,
    @Request() req: any,
  ) {
    const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/accept-invitation?token=${sendInvitationDto}`;
    return this.schoolsService.sendSchoolAdminInvitation(
      sendInvitationDto,
      invitationLink,
    );
  }

  @Post('invitations/accept')
  @ApiOperation({ summary: 'Accept school administrator invitation' })
  @ApiResponse({ status: 200, description: 'Invitation accepted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired invitation' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  async acceptInvitation(@Body() acceptInvitationDto: AcceptInvitationDto) {
    return this.schoolsService.acceptInvitation(acceptInvitationDto);
  }

  @Get('invitations/:token/status')
  @ApiOperation({ summary: 'Check invitation status' })
  @ApiResponse({ status: 200, description: 'Invitation status retrieved' })
  async getInvitationStatus(@Param('token') token: string) {
    return this.schoolsService.getInvitationStatus(token);
  }

  @Get('admin/school')
  @UseGuards(SchoolAdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get school details for school administrator' })
  @ApiResponse({ status: 200, description: 'School details retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized - School admin token required' })
  async getSchoolForAdmin(@Request() req: any) {
    return this.schoolsService.getSchoolDetails(req.user.schoolId);
  }

  @Post('admin/update-info')
  @UseGuards(SchoolAdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update school information (School admin only)' })
  @ApiResponse({ status: 200, description: 'School information updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized - School admin token required' })
  async updateSchoolInfo(
    @Request() req: any,
    @Body() updateSchoolInfoDto: any,
  ) {
    return this.schoolsService.updateSchoolInfo(req.user.schoolId, updateSchoolInfoDto);
  }

  @Post('admin/add-admin')
  @UseGuards(SchoolAdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Add another school administrator (School admin only)' })
  @ApiResponse({ status: 201, description: 'Administrator added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - School admin token required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async addSchoolAdmin(
    @Request() req: any,
    @Body() manageAdminDto: any,
  ) {
    return this.schoolsService.addSchoolAdminBySchoolAdmin(
      req.user.schoolId,
      manageAdminDto.userId,
    );
  }

  @Post('admin/revoke-admin')
  @UseGuards(SchoolAdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Revoke school administrator privileges (School admin only)' })
  @ApiResponse({ status: 200, description: 'Administrator privileges revoked' })
  @ApiResponse({ status: 401, description: 'Unauthorized - School admin token required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async revokeSchoolAdmin(
    @Request() req: any,
    @Body() manageAdminDto: any,
  ) {
    return this.schoolsService.revokeSchoolAdmin(
      req.user.schoolId,
      manageAdminDto.userId,
    );
  }

  @Get('admin/admins')
  @UseGuards(SchoolAdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all school administrators (School admin only)' })
  @ApiResponse({ status: 200, description: 'List of school administrators' })
  @ApiResponse({ status: 401, description: 'Unauthorized - School admin token required' })
  async getSchoolAdmins(@Request() req: any) {
    return this.schoolsService.getSchoolAdmins(req.user.schoolId);
  }
}
