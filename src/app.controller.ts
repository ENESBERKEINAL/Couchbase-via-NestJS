import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { UserDTO } from './dto/userDto';
import { nameDTO } from './dto/documentDTO';

@ApiTags('CRUD Couchbase Datas')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({summary:'Get all document from couchbase'})
  @Get('/getUsers')
  getData(): Promise<any> {
    return this.appService.getUsers();
  }

  @ApiOperation({ summary: 'Post single document to Couchbase with Name' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('/postUsers/:documentName')
  postData(@Param('documentName') documentName: string): UserDTO {
    return this.appService.postUsers(documentName);
  }

  @ApiOperation({ summary: 'Delete single document with id' })
  @Delete('/deleteUser/:documentId')
  deleteData(@Param('documentId') documentId : number) {
    this.appService.deleteUser(documentId)
  }

  @ApiOperation({summary : 'Update document'})
  @Put('/deleteUser/:documentId')
  @ApiBody({required: true, schema: {
    properties: {
      'name': {type: 'string'}
    }
  }})
  updateData(@Param('documentId') documentId: number, @Body() wholeDocument : nameDTO){
    return this.appService.updateUser(documentId, wholeDocument)
  }

  @ApiOperation({ summary: 'Get Swagger' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
