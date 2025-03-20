import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { Priority } from '@prisma/client';
@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEventDto: CreateEventDto, userId: number) {
    const event: CreateEventDto = { ...createEventDto, userId };
    return await this.prisma.event.create({ data: event });
  }

  async findAll(
    userId: number,
    page: number,
    limit: number,
    filter: FilterEventDto,
  ) {
    const skip = (page - 1) * limit;

    let dueDateFilter = undefined;
    if (filter.dueDate) {
      const startOfDay = new Date(filter.dueDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(filter.dueDate);
      endOfDay.setHours(23, 59, 59, 999);

      dueDateFilter = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const events = await this.prisma.event.findMany({
      where: {
        userId,
        isDeleted: false,
        title: {
          contains: filter.title,
          mode: 'insensitive',
        },
        priority: {
          in: filter.priority as Priority[],
        },
        dueDate: dueDateFilter,
      },
      skip,
      take: limit,
    });

    const total = await this.prisma.event.count({ where: { userId } });

    return {
      events,
      hasMore: total > skip + limit,
    };
  }

  async getDays(date: string, userId: number) {
    const now = new Date(date);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    const data = await this.prisma.event.findMany({
      where: {
        dueDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        userId,
      },
      select: {
        dueDate: true,
      },
    });
    return data.map((data) => data.dueDate);
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    return await this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  async findOne(id: number) {
    return await this.prisma.event.findUnique({
      where: { id },
    });
  }
  remove(id: number) {
    return this.prisma.event.delete({ where: { id } });
  }
}
