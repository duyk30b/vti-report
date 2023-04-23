import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { escapeCharForSearch } from '@utils/common';
import { plainToInstance } from 'class-transformer';
import { flatMap, isEmpty, map, uniq, keyBy } from 'lodash';
import { DepartmentSettingResponseDto } from './dto/response/department-setting.response.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UserServiceInterface } from './interface/user.service.interface';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @Inject('USER_SERVICE_CLIENT')
    private readonly userServiceClient: ClientProxy,
  ) {}

  async getCompanies(condition): Promise<any> {
    return await this.userServiceClient
      .send('get_companies', {
        condition: condition,
      })
      .toPromise();
  }

  async getListCompanyByIds(ids: number[], serilize?: boolean): Promise<any> {
    const response = await this.userServiceClient
      .send('get_list_company_by_ids', {
        ids,
      })
      .toPromise();
    if (response.statusCode !== ResponseCodeEnum.SUCCESS)
      return serilize ? {} : [];

    return serilize ? keyBy(response.data, 'id') : response.data;
  }

  async getUserByIds(ids: number[], serilize?: boolean): Promise<any> {
    const response = await this.userServiceClient
      .send('get_users_by_ids', {
        userIds: ids,
      })
      .toPromise();
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
    return await this.userServiceClient
      .send('get_factories', {
        condition: condition,
      })
      .toPromise();
  }

  async getFactoriesByIds(ids, serilize?: boolean): Promise<any> {
    const response = await this.userServiceClient
      .send('get_factory_by_ids', {
        ids: ids,
      })
      .toPromise();
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
    return await this.userServiceClient
      .send('delete_user_warehouse_by_condition', {
        condition: condition,
      })
      .toPromise();
  }

  async getUsersByConditions(condition): Promise<any> {
    return await this.userServiceClient
      .send('get_users_by_conditions', {
        condition: condition,
      })
      .toPromise();
  }

  async getListCompanyByCodes(
    codes: string[],
    serilize?: boolean,
  ): Promise<any> {
    const response = await this.userServiceClient
      .send('get_list_company_by_codes', { codes: codes })
      .toPromise();

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
    return await this.userServiceClient
      .send('insert_permission', permissions)
      .toPromise();
  }

  public async deletePermissionNotActive(): Promise<any> {
    return await this.userServiceClient
      .send('delete_permission_not_active', {})
      .toPromise();
  }

  /**
   *
   * @param id
   * @returns
   */
  public async getUserById(id: number): Promise<any> {
    const responseUserService = await this.userServiceClient
      .send('detail', { id: id })
      .toPromise();
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
    const responseUserService = await this.userServiceClient
      .send('get_warehouse_list_by_user', {
        userId: id,
        isGetAll: '1',
        basicInfor: '1',
      })
      .toPromise();

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
    const response = await this.userServiceClient
      .send('get_factories_by_name_keyword', {
        nameKeyword: filterByName.text,
      })
      .toPromise();

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
    const result = await this.userServiceClient
      .send('get_users_by_role_codes', { roleCodes })
      .toPromise();
    if (result.statusCode !== ResponseCodeEnum.SUCCESS) return {};
    return result.data;
  }
  public async getFactoryById(id: number): Promise<any> {
    const responseUserService = await this.userServiceClient
      .send('detail_factory', { id: id })
      .toPromise();
    if (responseUserService.statusCode != ResponseCodeEnum.SUCCESS) {
      return {};
    }
    return responseUserService.data;
  }

  public async getListDepartment(): Promise<any> {
    const responseUserService = await this.userServiceClient
      .send('get_department_list', {})
      .toPromise();
    if (responseUserService.statusCode != ResponseCodeEnum.SUCCESS) {
      return [];
    }
    return responseUserService.data;
  }

  public async getDepartmentReceiptByIds(ids: number[]): Promise<any> {
    const response = await this.userServiceClient
      .send('get_department_receipt_by_ids', { ids })
      .toPromise();

    if (response.statusCode != ResponseCodeEnum.SUCCESS) {
      return [];
    }
    return response.data;
  }

  async getDepartmentSettingByIds(
    ids: number[],
    serilize?: boolean,
  ): Promise<any> {
    const response = await this.userServiceClient
      .send('get_department_setting_by_ids', {
        departmentSettingIds: ids,
      })
      .toPromise();
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
