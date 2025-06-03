import { Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { BaseService } from '../services/base.service';
import { ObjectLiteral } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

export class BaseController<T extends BaseEntity> {
  constructor(private readonly service: BaseService<T>) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne({ id } as any);
  }

  @Post()
  create(@Body() body: Partial<T>) {
    return this.service.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<T>) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
