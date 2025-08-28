/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type { AxiosInstance, AxiosRequestConfig, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseType;
    /** request body */
    body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
    securityWorker?: (
        securityData: SecurityDataType | null,
    ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
    secure?: boolean;
    format?: ResponseType;
}

export enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public instance: AxiosInstance;
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private secure?: boolean;
    private format?: ResponseType;

    constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
        this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:3333" });
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
        const method = params1.method || (params2 && params2.method);

        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }

    protected stringifyFormItem(formItem: unknown) {
        if (typeof formItem === "object" && formItem !== null) {
            return JSON.stringify(formItem);
        } else {
            return `${formItem}`;
        }
    }

    protected createFormData(input: Record<string, unknown>): FormData {
        if (input instanceof FormData) {
            return input;
        }
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            const propertyContent: any[] = property instanceof Array ? property : [property];

            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File;
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
            }

            return formData;
        }, new FormData());
    }

    public request = async <T = any, _E = any>({
        secure,
        path,
        type,
        query,
        format,
        body,
        ...params
    }: FullRequestParams): Promise<T> => {
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const responseFormat = format || this.format || undefined;

        if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
            body = this.createFormData(body as Record<string, unknown>);
        }

        if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
            body = JSON.stringify(body);
        }

        return this.instance
            .request({
                ...requestParams,
                headers: {
                    ...(requestParams.headers || {}),
                    ...(type ? { "Content-Type": type } : {}),
                },
                params: query,
                responseType: responseFormat,
                data: body,
                url: path,
            })
            .then((response) => response.data);
    };
}

/**
 * @title DocPal API
 * @version 1.0.0
 * @license MIT (https://opensource.org/licenses/MIT)
 * @baseUrl http://localhost:3333
 * @contact DocPal Team <support@docpal.com>
 *
 * Multi-tenant document management platform API
 */
export class api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    /**
     * @description API information
     *
     * @tags System
     * @name GetDeprecate
     * @request GET:/
     * @secure
     */
    getDeprecate = (params: RequestParams = {}) =>
        this.request<
            {
                name?: string;
                version?: string;
                description?: string;
                documentation?: string;
            },
            any
        >({
            path: `/`,
            method: "GET",
            secure: true,
            format: "json",
            ...params,
        });

    health = {
        /**
         * @description Health check endpoint
         *
         * @tags System
         * @name Get
         * @request GET:/health
         * @secure
         */
        get: (params: RequestParams = {}) =>
            this.request<
                {
                    status?: string;
                    timestamp?: string;
                    version?: string;
                    uptime?: number;
                },
                any
            >({
                path: `/health`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),
    };
    auth = {
        /**
         * @description User login with email and password
         *
         * @tags Authentication
         * @name PostLogin
         * @request POST:/auth/login
         * @secure
         */
        postLogin: (
            data: {
                /**
                 * User email address
                 * @format email
                 */
                email: string;
                /**
                 * User password
                 * @minLength 1
                 */
                password: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/auth/login`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description User logout
         *
         * @tags Authentication
         * @name PostLogout
         * @request POST:/auth/logout
         * @secure
         */
        postLogout: (params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/auth/logout`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Get current user session
         *
         * @tags Authentication
         * @name GetSession
         * @request GET:/auth/session
         * @secure
         */
        getSession: (params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/auth/session`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Request password reset
         *
         * @tags Authentication
         * @name PostResetPassword
         * @request POST:/auth/reset-password
         * @secure
         */
        postResetPassword: (params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/auth/reset-password`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Confirm password reset with token
         *
         * @tags Authentication
         * @name PostResetPasswordConfirm
         * @request POST:/auth/reset-password/confirm
         * @secure
         */
        postResetPasswordConfirm: (params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/auth/reset-password/confirm`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Verify email address
         *
         * @tags Authentication
         * @name PostVerifyEmail
         * @request POST:/auth/verify-email
         * @secure
         */
        postVerifyEmail: (params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/auth/verify-email`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Resend email verification
         *
         * @tags Authentication
         * @name PostVerifyEmailResend
         * @request POST:/auth/verify-email/resend
         * @secure
         */
        postVerifyEmailResend: (params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/auth/verify-email/resend`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Get current session information including renewal status
         *
         * @tags Authentication
         * @name GetSessionInfo
         * @request GET:/auth/session/info
         * @secure
         */
        getSessionInfo: (params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/auth/session/info`,
                method: "GET",
                secure: true,
                ...params,
            }),
    };
    companies = {
        /**
         * @description Register a new company with admin user
         *
         * @tags Companies
         * @name PostRegister
         * @request POST:/companies/register
         * @secure
         */
        postRegister: (
            data: {
                /**
                 * Name of the company to register
                 * @minLength 1
                 * @maxLength 255
                 */
                companyName: string;
                /** Admin user details for the company */
                adminUser: {
                    /**
                     * Full name of the admin user
                     * @minLength 1
                     * @maxLength 255
                     */
                    name: string;
                    /**
                     * Email address of the admin user
                     * @format email
                     */
                    email: string;
                    /**
                     * Password for the admin user (minimum 8 characters)
                     * @minLength 8
                     */
                    password: string;
                };
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/register`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Get company information
         *
         * @tags Companies
         * @name GetCompanyid
         * @request GET:/companies/{companyId}
         * @secure
         */
        getCompanyid: (companyId: string, params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/companies/${companyId}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Create a new user in public schema and their profile (admin only)
         *
         * @tags User Profiles
         * @name PostUser
         * @summary Create user and profile
         * @request POST:/companies/user
         * @secure
         */
        postUser: (
            data: {
                /**
                 * @format email
                 * @maxLength 255
                 */
                email: string;
                /** @maxLength 255 */
                name: string;
                /**
                 * @minLength 8
                 * @maxLength 128
                 */
                password: string;
                /** @default true */
                isActive?: boolean;
                /** @maxLength 100 */
                firstName: string;
                /** @maxLength 100 */
                lastName: string;
                /** @maxLength 500 */
                avatar?: string;
                /** @maxLength 20 */
                phoneNumber?: string;
                /** @maxLength 100 */
                department?: string;
                /** @maxLength 100 */
                jobTitle?: string;
                /**
                 * @maxLength 50
                 * @default "UTC"
                 */
                timezone?: string;
                /**
                 * @maxLength 10
                 * @default "en"
                 */
                locale?: string;
                preferences?: object;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    data?: {
                        user?: {
                            id?: string;
                            email?: string;
                            name?: string;
                            companyId?: string;
                            isActive?: boolean;
                            isCompanyAdmin?: boolean;
                            createdAt?: string;
                        };
                        profile?: {
                            id?: string;
                            user_id?: string;
                            first_name?: string;
                            last_name?: string;
                            avatar?: string;
                            phone_number?: string;
                            department?: string;
                            job_title?: string;
                            timezone?: string;
                            locale?: string;
                            preferences?: object;
                            created_at?: string;
                            updated_at?: string;
                        };
                    };
                },
                Record<string, any>
            >({
                path: `/companies/user`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Get all user profiles in the company
         *
         * @tags User Profiles
         * @name GetUser
         * @summary Get all user profiles
         * @request GET:/companies/user
         * @secure
         */
        getUser: (params: RequestParams = {}) =>
            this.request<
                {
                    success?: boolean;
                    data?: {
                        id?: string;
                        user_id?: string;
                        first_name?: string;
                        last_name?: string;
                        avatar?: string;
                        phone_number?: string;
                        department?: string;
                        job_title?: string;
                        timezone?: string;
                        locale?: string;
                        preferences?: object;
                        created_at?: string;
                        updated_at?: string;
                    }[];
                },
                Record<string, any>
            >({
                path: `/companies/user`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Query user profiles with advanced filtering, sorting, grouping, and pagination
         *
         * @tags User Profiles
         * @name PostUserQuery
         * @summary Query user profiles
         * @request POST:/companies/user/query
         * @secure
         */
        postUserQuery: (
            data: {
                /** Columns to select */
                select?: string[];
                filters?: {
                    column: string;
                    operator:
                        | "eq"
                        | "ne"
                        | "gt"
                        | "gte"
                        | "lt"
                        | "lte"
                        | "like"
                        | "ilike"
                        | "in"
                        | "not_in"
                        | "is_null"
                        | "is_not_null"
                        | "between";
                    value: any;
                    value2?: any;
                }[];
                sorts?: {
                    column: string;
                    direction: "asc" | "desc";
                }[];
                groups?: {
                    column: string;
                    aggregateFunction?: "count" | "sum" | "avg" | "min" | "max";
                }[];
                /**
                 * Page number for pagination
                 * @min 1
                 * @default 1
                 */
                page?: number;
                /**
                 * Number of records per page
                 * @min 1
                 * @max 100
                 * @default 20
                 */
                pageSize?: number;
                /**
                 * Include virtual/computed columns in results
                 * @default false
                 */
                includeVirtualColumns?: boolean;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    data?: Record<string, any>[];
                    pagination?: {
                        page?: number;
                        pageSize?: number;
                        total?: number;
                        totalPages?: number;
                    };
                    metadata?: {
                        columns?: Record<string, any>[];
                        availableOperators?: Record<string, any>;
                    };
                },
                Record<string, any>
            >({
                path: `/companies/user/query`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Get a specific user profile by ID
         *
         * @tags User Profiles
         * @name GetUserId
         * @summary Get user profile by ID
         * @request GET:/companies/user/{id}
         * @secure
         */
        getUserId: (id: string, params: RequestParams = {}) =>
            this.request<
                {
                    success?: boolean;
                    data?: {
                        id?: string;
                        user_id?: string;
                        first_name?: string;
                        last_name?: string;
                        avatar?: string;
                        phone_number?: string;
                        department?: string;
                        job_title?: string;
                        timezone?: string;
                        locale?: string;
                        preferences?: object;
                        created_at?: string;
                        updated_at?: string;
                    };
                },
                Record<string, any>
            >({
                path: `/companies/user/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Update user profile data
         *
         * @tags User Profiles
         * @name PutUserId
         * @summary Update user profile
         * @request PUT:/companies/user/{id}
         * @secure
         */
        putUserId: (
            id: string,
            data: {
                /** @maxLength 100 */
                first_name?: string;
                /** @maxLength 100 */
                last_name?: string;
                /** @maxLength 500 */
                avatar?: string;
                /** @maxLength 20 */
                phone_number?: string;
                /** @maxLength 100 */
                department?: string;
                /** @maxLength 100 */
                job_title?: string;
                /** @maxLength 50 */
                timezone?: string;
                /** @maxLength 10 */
                locale?: string;
                preferences?: object;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    data?: {
                        id?: string;
                        user_id?: string;
                        first_name?: string;
                        last_name?: string;
                        avatar?: string;
                        phone_number?: string;
                        department?: string;
                        job_title?: string;
                        timezone?: string;
                        locale?: string;
                        preferences?: object;
                        created_at?: string;
                        updated_at?: string;
                    };
                },
                Record<string, any>
            >({
                path: `/companies/user/${id}`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description List all custom tables for the company
         *
         * @tags Companies/Data/Schema
         * @name GetDataSchema
         * @request GET:/companies/data/schema
         * @secure
         */
        getDataSchema: (params: RequestParams = {}) =>
            this.request<
                {
                    success?: boolean;
                    data?: {
                        id?: string;
                        table_name?: string;
                        display_name?: string;
                        description?: string;
                        table_type?: string;
                        is_active?: boolean;
                        created_by?: string;
                        created_at?: string;
                        updated_at?: string;
                    }[];
                },
                any
            >({
                path: `/companies/data/schema`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Create a new custom table
         *
         * @tags Companies/Data/Schema
         * @name PostDataSchema
         * @request POST:/companies/data/schema
         * @secure
         */
        postDataSchema: (
            data: {
                definition: {
                    table_name: string;
                    display_name: string;
                    description?: string;
                    table_type?: string;
                    columns: {
                        name: string;
                        type: string;
                        primary_key?: boolean;
                        notNull?: boolean;
                        unique?: boolean;
                        default?: any;
                        default_random?: boolean;
                        default_now?: boolean;
                        with_timezone?: boolean;
                        foreign_key?: {
                            table?: string;
                            column?: string;
                            onDelete?: "cascade" | "restrict" | "set null";
                        };
                    }[];
                    indexes?: {
                        name?: string;
                        columns?: string[];
                    }[];
                    unique?: {
                        name?: string;
                        columns?: string[];
                    }[];
                };
                metadata: {
                    column_name: string;
                    display_name: string;
                    data_type: string;
                    can_sort?: boolean;
                    can_filter?: boolean;
                    can_group?: boolean;
                    filter_type: string;
                    is_visible?: boolean;
                    is_system?: boolean;
                    is_virtual?: boolean;
                    foreign_key_info?: object;
                    virtual_config?: object;
                    display_order?: number;
                }[];
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/schema`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Check if a table name is valid and available
         *
         * @tags Companies/Data/Schema
         * @name GetDataSchemaValidateNameTablename
         * @request GET:/companies/data/schema/validate-name/{tableName}
         * @secure
         */
        getDataSchemaValidateNameTablename: (tableName: string, params: RequestParams = {}) =>
            this.request<
                {
                    success?: boolean;
                    data?: {
                        isValid?: boolean;
                        isAvailable?: boolean;
                        error?: string;
                        suggestions?: string[];
                    };
                },
                any
            >({
                path: `/companies/data/schema/validate-name/${tableName}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get custom table by name
         *
         * @tags Companies/Data/Schema
         * @name GetDataSchemaTablename
         * @request GET:/companies/data/schema/{tableName}
         * @secure
         */
        getDataSchemaTablename: (tableName: string, params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/schema/${tableName}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Update custom table
         *
         * @tags Companies/Data/Schema
         * @name PutDataSchemaTablename
         * @request PUT:/companies/data/schema/{tableName}
         * @secure
         */
        putDataSchemaTablename: (
            tableName: string,
            data: {
                displayName?: string;
                description?: string;
                tableType?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/schema/${tableName}`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Delete custom table
         *
         * @tags Companies/Data/Schema
         * @name DeleteDataSchemaTablename
         * @request DELETE:/companies/data/schema/{tableName}
         * @secure
         */
        deleteDataSchemaTablename: (tableName: string, params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/schema/${tableName}`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * @description Get custom table relations
         *
         * @tags Companies/Data/Schema
         * @name GetDataSchemaTablenameRelations
         * @request GET:/companies/data/schema/{tableName}/relations
         * @secure
         */
        getDataSchemaTablenameRelations: (tableName: string, params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/schema/${tableName}/relations`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Add custom table relation
         *
         * @tags Companies/Data/Schema
         * @name PostDataSchemaTablenameRelations
         * @request POST:/companies/data/schema/{tableName}/relations
         * @secure
         */
        postDataSchemaTablenameRelations: (
            tableName: string,
            data: {
                sourceColumn: string;
                targetTable: string;
                targetColumn: string;
                relationType: "foreign_key" | "one_to_many" | "many_to_many";
                onDelete?: "cascade" | "restrict" | "set null";
                onUpdate?: "cascade" | "restrict" | "set null";
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/schema/${tableName}/relations`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Add a new column to an existing custom table
         *
         * @tags Companies/Data/Schema
         * @name PostDataSchemaTablenameColumns
         * @request POST:/companies/data/schema/{tableName}/columns
         * @secure
         */
        postDataSchemaTablenameColumns: (
            tableName: string,
            data: {
                column: {
                    name: string;
                    type: string;
                    primaryKey?: boolean;
                    notNull?: boolean;
                    unique?: boolean;
                    default?: any;
                    defaultRandom?: boolean;
                    defaultNow?: boolean;
                    withTimezone?: boolean;
                    foreignKey?: {
                        table?: string;
                        column?: string;
                        onDelete?: "cascade" | "restrict" | "set null";
                    };
                };
                metadata: {
                    column_name: string;
                    display_name: string;
                    data_type: string;
                    can_sort?: boolean;
                    can_filter?: boolean;
                    can_group?: boolean;
                    filter_type: string;
                    is_visible?: boolean;
                    is_system?: boolean;
                    is_virtual?: boolean;
                    foreign_key_info?: object | null;
                    virtual_config?: object | null;
                    display_order?: number;
                };
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/schema/${tableName}/columns`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Grant permission to custom table
         *
         * @tags Companies/Data/Schema
         * @name PostDataSchemaTablenamePermissions
         * @request POST:/companies/data/schema/{tableName}/permissions
         * @secure
         */
        postDataSchemaTablenamePermissions: (
            tableName: string,
            data: {
                granteeType: "user" | "role" | "group";
                granteeId: string;
                relation: "owner" | "editor" | "viewer";
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/schema/${tableName}/permissions`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Revoke permission from custom table
         *
         * @tags Companies/Data/Schema
         * @name DeleteDataSchemaTablenamePermissions
         * @request DELETE:/companies/data/schema/{tableName}/permissions
         * @secure
         */
        deleteDataSchemaTablenamePermissions: (
            tableName: string,
            data: {
                granteeType: "user" | "role" | "group";
                granteeId: string;
                relation: "owner" | "editor" | "viewer";
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/schema/${tableName}/permissions`,
                method: "DELETE",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Get list of all available tables for the company
         *
         * @tags Companies/Data/Records
         * @name GetDataRecords
         * @summary Get available tables
         * @request GET:/companies/data/records
         * @secure
         */
        getDataRecords: (params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/records`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Get column metadata and configuration for a specific table
         *
         * @tags Companies/Data/Records
         * @name GetDataRecordsTablenameMetadata
         * @summary Get table metadata
         * @request GET:/companies/data/records/{tableName}/metadata
         * @secure
         */
        getDataRecordsTablenameMetadata: (tableName: string, params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/records/${tableName}/metadata`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Get row count and other statistics for a specific table
         *
         * @tags Companies/Data/Records
         * @name GetDataRecordsTablenameStats
         * @summary Get table statistics
         * @request GET:/companies/data/records/{tableName}/stats
         * @secure
         */
        getDataRecordsTablenameStats: (tableName: string, params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/records/${tableName}/stats`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Query records with advanced filtering, sorting, grouping, and pagination for table display
         *
         * @tags Companies/Data/Records
         * @name PostDataRecordsTablenameQuerytable
         * @summary Query table records (table view)
         * @request POST:/companies/data/records/{tableName}/queryTable
         * @secure
         */
        postDataRecordsTablenameQuerytable: (
            tableName: string,
            data: {
                /** Columns to select */
                select?: string[];
                filters?: {
                    column: string;
                    operator:
                        | "eq"
                        | "ne"
                        | "gt"
                        | "gte"
                        | "lt"
                        | "lte"
                        | "like"
                        | "ilike"
                        | "in"
                        | "not_in"
                        | "is_null"
                        | "is_not_null"
                        | "between";
                    value: any;
                    value2?: any;
                }[];
                sorts?: {
                    column: string;
                    direction: "asc" | "desc";
                }[];
                groups?: {
                    column: string;
                    aggregateFunction?: "count" | "sum" | "avg" | "min" | "max";
                }[];
                /**
                 * @min 1
                 * @default 1
                 */
                page?: number;
                /**
                 * @min 1
                 * @max 100
                 * @default 20
                 */
                pageSize?: number;
                /** @default false */
                includeVirtualColumns?: boolean;
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/records/${tableName}/queryTable`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Query records and group them hierarchically by specified columns. Returns nested data structure.
         *
         * @tags Companies/Data/Records
         * @name PostDataRecordsTablenameQuerygroup
         * @summary Query table records with hierarchical grouping
         * @request POST:/companies/data/records/{tableName}/queryGroup
         * @secure
         */
        postDataRecordsTablenameQuerygroup: (
            tableName: string,
            data: {
                /** Columns to select */
                select?: string[];
                filters?: {
                    column: string;
                    operator:
                        | "eq"
                        | "ne"
                        | "gt"
                        | "gte"
                        | "lt"
                        | "lte"
                        | "like"
                        | "ilike"
                        | "in"
                        | "not_in"
                        | "is_null"
                        | "is_not_null"
                        | "between";
                    value: any;
                    value2?: any;
                }[];
                sorts?: {
                    column: string;
                    direction: "asc" | "desc";
                }[];
                /**
                 * Array of column names to group by hierarchically (e.g., ["tag", "created_by"])
                 * @minItems 1
                 */
                groupBy: string[];
                /** @default false */
                includeVirtualColumns?: boolean;
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/records/${tableName}/queryGroup`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Query records organized by status columns for kanban board display
         *
         * @tags Companies/Data/Records
         * @name PostDataRecordsTablenameQuerykanban
         * @summary Query table records (kanban view)
         * @request POST:/companies/data/records/{tableName}/queryKanban
         * @secure
         */
        postDataRecordsTablenameQuerykanban: (
            tableName: string,
            data: {
                /** Column name that contains status values for kanban columns */
                statusColumn: string;
                /** Columns to select */
                select?: string[];
                filters?: {
                    column: string;
                    operator:
                        | "eq"
                        | "ne"
                        | "gt"
                        | "gte"
                        | "lt"
                        | "lte"
                        | "like"
                        | "ilike"
                        | "in"
                        | "not_in"
                        | "is_null"
                        | "is_not_null"
                        | "between";
                    value: any;
                    value2?: any;
                }[];
                sorts?: {
                    column: string;
                    direction: "asc" | "desc";
                }[];
                /** @default false */
                includeVirtualColumns?: boolean;
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/records/${tableName}/queryKanban`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Query records with date/time information for calendar display
         *
         * @tags Companies/Data/Records
         * @name PostDataRecordsTablenameQuerycalendar
         * @summary Query table records (calendar view)
         * @request POST:/companies/data/records/{tableName}/queryCalendar
         * @secure
         */
        postDataRecordsTablenameQuerycalendar: (
            tableName: string,
            data: {
                /** Column name that contains date/time values for calendar events */
                dateColumn: string;
                /** Columns to select */
                select?: string[];
                filters?: {
                    column: string;
                    operator:
                        | "eq"
                        | "ne"
                        | "gt"
                        | "gte"
                        | "lt"
                        | "lte"
                        | "like"
                        | "ilike"
                        | "in"
                        | "not_in"
                        | "is_null"
                        | "is_not_null"
                        | "between";
                    value: any;
                    value2?: any;
                }[];
                dateRange?: {
                    /** @format date */
                    start?: string;
                    /** @format date */
                    end?: string;
                };
                /** @default false */
                includeVirtualColumns?: boolean;
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/records/${tableName}/queryCalendar`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Query records with start/end dates for gantt chart display
         *
         * @tags Companies/Data/Records
         * @name PostDataRecordsTablenameQuerygantt
         * @summary Query table records (gantt view)
         * @request POST:/companies/data/records/{tableName}/queryGantt
         * @secure
         */
        postDataRecordsTablenameQuerygantt: (
            tableName: string,
            data: {
                /** Column name that contains start date values */
                startDateColumn: string;
                /** Column name that contains end date values */
                endDateColumn: string;
                /** Columns to select */
                select?: string[];
                filters?: {
                    column: string;
                    operator:
                        | "eq"
                        | "ne"
                        | "gt"
                        | "gte"
                        | "lt"
                        | "lte"
                        | "like"
                        | "ilike"
                        | "in"
                        | "not_in"
                        | "is_null"
                        | "is_not_null"
                        | "between";
                    value: any;
                    value2?: any;
                }[];
                dateRange?: {
                    /** @format date */
                    start?: string;
                    /** @format date */
                    end?: string;
                };
                /** @default false */
                includeVirtualColumns?: boolean;
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/records/${tableName}/queryGantt`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Get a single record by ID from a specific table
         *
         * @tags Companies/Data/Records
         * @name GetDataRecordsTablenameRecordsRecordid
         * @summary Get single record
         * @request GET:/companies/data/records/{tableName}/records/{recordId}
         * @secure
         */
        getDataRecordsTablenameRecordsRecordid: (tableName: string, recordId: string, params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/records/${tableName}/records/${recordId}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Update an existing record by ID in a specific table
         *
         * @tags Companies/Data/Records
         * @name PutDataRecordsTablenameRecordsRecordid
         * @summary Update record
         * @request PUT:/companies/data/records/{tableName}/records/{recordId}
         * @secure
         */
        putDataRecordsTablenameRecordsRecordid: (
            tableName: string,
            recordId: string,
            data: object,
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/records/${tableName}/records/${recordId}`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Delete a record by ID from a specific table
         *
         * @tags Companies/Data/Records
         * @name DeleteDataRecordsTablenameRecordsRecordid
         * @summary Delete record
         * @request DELETE:/companies/data/records/{tableName}/records/{recordId}
         * @secure
         */
        deleteDataRecordsTablenameRecordsRecordid: (tableName: string, recordId: string, params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/records/${tableName}/records/${recordId}`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * @description Create a new record in a specific table
         *
         * @tags Companies/Data/Records
         * @name PostDataRecordsTablenameRecords
         * @summary Create record
         * @request POST:/companies/data/records/{tableName}/records
         * @secure
         */
        postDataRecordsTablenameRecords: (tableName: string, data: object, params: RequestParams = {}) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/records/${tableName}/records`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Delete multiple records by IDs from a specific table
         *
         * @tags Companies/Data/Records
         * @name DeleteDataRecordsTablenameRecords
         * @summary Bulk delete records
         * @request DELETE:/companies/data/records/{tableName}/records
         * @secure
         */
        deleteDataRecordsTablenameRecords: (
            tableName: string,
            data: {
                /** @minItems 1 */
                recordIds: string[];
            },
            params: RequestParams = {},
        ) =>
            this.request<any, Record<string, any>>({
                path: `/companies/data/records/${tableName}/records`,
                method: "DELETE",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),
    };
}
