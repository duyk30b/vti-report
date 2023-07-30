import { ResponseCodeEnum } from '@constant/response-code.enum';
import { NatsClientService } from '@core/transporter/nats-transporter/nats-client.service';
import { Injectable } from '@nestjs/common';
import { escapeCharForSearch } from '@utils/common';
import { plainToInstance } from 'class-transformer';
import { flatMap, isEmpty, keyBy, map, uniq } from 'lodash';
import { DepartmentSettingResponseDto } from './dto/response/department-setting.response.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UserServiceInterface } from './interface/user.service.interface';
import { NATS_USER } from '@core/config/nats.config';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(private readonly natsClientService: NatsClientService) {}

  async getCompanies(condition): Promise<any> {
    return await this.natsClientService.send(`${NATS_USER}.get_companies`, {
      condition: condition,
    });
  }

  async getListCompanyByIds(ids: number[], serilize?: boolean): Promise<any> {
    const response = await this.natsClientService.send(
      `${NATS_USER}.get_list_company_by_ids`,
      {
        ids,
      },
    );
    if (response.statusCode !== ResponseCodeEnum.SUCCESS)
      return serilize ? {} : [];

    return serilize ? keyBy(response.data, 'id') : response.data;
  }

  async getUserByIds(ids: number[], serilize?: boolean): Promise<any> {
    const response = await this.natsClientService.send(
      `${NATS_USER}.get_users_by_ids`,
      { userIds: ids },
    );
    if (response.statusCode !== ResponseCodeEnum.SUCCESS) return [];

    const dataReturn = plainToInstance(UserResponseDto, <any[]>response.data, {
      excludeExtraneousValues: true,
    });
    const serilizeUsers = {};
    if (serilize) {
      response.data.forEach((user) => {
        serilizeUsers[user.id] = user;
      });

      return serilizeUsers;
    }
    return dataReturn;
  }

  async getFactories(condition?: any): Promise<any> {
    return await this.natsClientService.send(`${NATS_USER}.get_factories`, {
      condition: condition,
    });
  }

  async getFactoriesByIds(ids, serilize?: boolean): Promise<any> {
    const response = await this.natsClientService.send(
      `${NATS_USER}.get_factory_by_ids`,
      { ids: ids },
    );
    if (serilize) {
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) return [];
      const serilizeFactories = {};
      response.data.forEach((factory) => {
        serilizeFactories[factory.id] = factory;
      });

      return serilizeFactories;
    }

    return response;
  }

  async deleteRecordUserWarehouses(condition): Promise<any> {
    return await this.natsClientService.send(
      `${NATS_USER}.delete_user_warehouse_by_condition`,
      {
        condition: condition,
      },
    );
  }

  async getUsersByConditions(condition): Promise<any> {
    return await this.natsClientService.send(
      `${NATS_USER}.get_users_by_conditions`,
      { condition: condition },
    );
  }

  async getListCompanyByCodes(
    codes: string[],
    serilize?: boolean,
  ): Promise<any> {
    const response = await this.natsClientService.send(
      `${NATS_USER}.get_list_company_by_codes`,
      { codes: codes },
    );

    if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
      return [];
    }

    const serilizeCompanies = {};
    if (serilize) {
      response.data.forEach((company) => {
        serilizeCompanies[company.id] = company;
      });

      return serilizeCompanies;
    }
    return response.data;
  }

  async getUsersByUsernameOrFullName(filterByUser, onlyId?): Promise<any> {
    if (isEmpty(filterByUser)) {
      return [];
    }

    const users = await this.getUsersByConditions(
      'LOWER(username)LIKE ' +
        `LOWER(unaccent('%${escapeCharForSearch(
          filterByUser.text,
        )}%')) escape '\\'` +
        ' or LOWER(full_name) LIKE ' +
        `LOWER(unaccent('%${escapeCharForSearch(
          filterByUser.text,
        )}%')) escape '\\'`,
    );

    if (!isEmpty(users) && onlyId === true) {
      return uniq(map(flatMap(users), 'id'));
    }

    return users;
  }

  public async insertPermission(permissions): Promise<any> {
    return await this.natsClientService.send(
      `${NATS_USER}.insert_permission`,
      permissions,
    );
  }

  public async deletePermissionNotActive(): Promise<any> {
    return await this.natsClientService.send(
      `${NATS_USER}.delete_permission_not_active`,
      {},
    );
  }

  /**
   *
   * @param id
   * @returns
   */
  public async getUserById(id: number): Promise<any> {
    const responseUserService = await this.natsClientService.send(
      `${NATS_USER}.detail`,
      { id },
    );
    if (responseUserService.statusCode != ResponseCodeEnum.SUCCESS) {
      return {};
    }
    return responseUserService.data;
  }

  /**
   *
   * @param id
   * @returns
   */
  public async getUserWarehousesById(id: number): Promise<any> {
    const responseUserService = await this.natsClientService.send(
      `${NATS_USER}.get_warehouse_list_by_user`,
      {
        userId: id,
        isGetAll: '1',
        basicInfor: '1',
      },
    );

    if (responseUserService.statusCode != ResponseCodeEnum.SUCCESS) {
      return [];
    }
    return responseUserService.data.items;
  }

  async getFactoriesByNameKeyword(
    filterByName,
    onlyId?: boolean,
    serilize?: boolean,
  ): Promise<any> {
    const response = await this.natsClientService.send(
      `${NATS_USER}.get_factories_by_name_keyword`,
      { nameKeyword: filterByName.text },
    );

    if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
      return [];
    }

    if (!isEmpty(response.data) && onlyId === true) {
      return uniq(map(flatMap(response.data), 'id'));
    }

    if (serilize) {
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) return [];
      const serilizeFactories = [];
      response.data.forEach((factory) => {
        serilizeFactories[factory.id] = factory;
      });

      return serilizeFactories;
    }

    return response.data;
  }

  public async getUsersByRoleCodes(roleCodes?: string[]): Promise<any> {
    const result = await this.natsClientService.send(
      `${NATS_USER}.get_users_by_role_codes`,
      { roleCodes },
    );
    if (result.statusCode !== ResponseCodeEnum.SUCCESS) return {};
    return result.data;
  }

  public async getFactoryById(id: number): Promise<any> {
    const responseUserService = await this.natsClientService.send(
      `${NATS_USER}.detail_factory`,
      { id },
    );
    if (responseUserService.statusCode != ResponseCodeEnum.SUCCESS) {
      return {};
    }
    return responseUserService.data;
  }

  public async getListDepartment(): Promise<any> {
    const responseUserService = await this.natsClientService.send(
      `${NATS_USER}.get_department_list`,
      {},
    );
    if (responseUserService.statusCode != ResponseCodeEnum.SUCCESS) {
      return [];
    }
    return responseUserService.data;
  }

  public async getDepartmentReceiptByIds(ids: number[]): Promise<any> {
    const response = await this.natsClientService.send(
      `${NATS_USER}.get_department_receipt_by_ids`,
      { ids },
    );

    if (response.statusCode != ResponseCodeEnum.SUCCESS) {
      return [];
    }
    return response.data;
  }

  async getDepartmentSettingByIds(
    ids: number[],
    serilize?: boolean,
  ): Promise<any> {
    const response = await this.natsClientService.send(
      `${NATS_USER}.get_department_setting_by_ids`,
      { departmentSettingIds: ids },
    );
    if (response.statusCode !== ResponseCodeEnum.SUCCESS) return [];
    const dataReturn = plainToInstance(
      DepartmentSettingResponseDto,
      <any[]>response.data,
      {
        excludeExtraneousValues: true,
      },
    );
    return serilize ? keyBy(dataReturn, 'id') : dataReturn;
  }
}
