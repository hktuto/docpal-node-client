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
         * @name GetHealth
         * @request GET:/health
         * @secure
         */
        getHealth: (params: RequestParams = {}) =>
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
         * @name PostAuthLogin
         * @request POST:/auth/login
         * @secure
         */
        postAuthLogin: (
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
            this.request<
                {
                    success: true;
                    data: {
                        id: string;
                        /** @format email */
                        email: string;
                        name: string;
                        companyId: string;
                        isCompanyAdmin: boolean;
                        permissions?: string[];
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "FORBIDDEN" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/auth/login`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description User logout
         *
         * @tags Authentication
         * @name PostAuthLogout
         * @request POST:/auth/logout
         * @secure
         */
        postAuthLogout: (params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        message: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "FORBIDDEN" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/auth/logout`,
                method: "POST",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get current user session
         *
         * @tags Authentication
         * @name GetAuthSession
         * @request GET:/auth/session
         * @secure
         */
        getAuthSession: (params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        id: string;
                        /** @format email */
                        email: string;
                        name: string;
                        companyId: string;
                        isCompanyAdmin: boolean;
                        permissions?: string[];
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "FORBIDDEN" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/auth/session`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Request password reset
         *
         * @tags Authentication
         * @name PostAuthResetPassword
         * @request POST:/auth/reset-password
         * @secure
         */
        postAuthResetPassword: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/auth/reset-password`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Confirm password reset with token
         *
         * @tags Authentication
         * @name PostAuthResetPasswordConfirm
         * @request POST:/auth/reset-password/confirm
         * @secure
         */
        postAuthResetPasswordConfirm: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/auth/reset-password/confirm`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Verify email address
         *
         * @tags Authentication
         * @name PostAuthVerifyEmail
         * @request POST:/auth/verify-email
         * @secure
         */
        postAuthVerifyEmail: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/auth/verify-email`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Resend email verification
         *
         * @tags Authentication
         * @name PostAuthVerifyEmailResend
         * @request POST:/auth/verify-email/resend
         * @secure
         */
        postAuthVerifyEmailResend: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/auth/verify-email/resend`,
                method: "POST",
                secure: true,
                ...params,
            }),
    };
    companies = {
        /**
         * @description Register a new company with admin user
         *
         * @tags Companies
         * @name PostCompaniesRegister
         * @request POST:/companies/register
         * @secure
         */
        postCompaniesRegister: (
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
            this.request<
                {
                    success: true;
                    data: {
                        company: {
                            /** @format uuid */
                            id: string;
                            name: string;
                            slug: string;
                            isActive: boolean;
                            /** @format date-time */
                            createdAt: string;
                        };
                        systemResources: {
                            adminRole: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                slug: string;
                            };
                            defaultGroup: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                slug: string;
                                isDefault: boolean;
                            };
                        };
                        adminUser: {
                            /** @format uuid */
                            id: string;
                            /** @format email */
                            email: string;
                            name: string;
                            isCompanyAdmin: boolean;
                            role: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                slug: string;
                            };
                            groups: string[];
                        };
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "FORBIDDEN" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/companies/register`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Get company information
         *
         * @tags Companies
         * @name GetCompaniesCompanyid
         * @request GET:/companies/{companyId}
         * @secure
         */
        getCompaniesCompanyid: (companyId: string, params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        /** @format uuid */
                        id: string;
                        name: string;
                        slug: string;
                        isActive: boolean;
                        settings?: {
                            allowPublicRegistration?: boolean;
                            requireEmailVerification?: boolean;
                            defaultUserRole?: string;
                            /** @min 1 */
                            maxUsers?: null | number;
                            features?: {
                                documentsEnabled?: boolean;
                                groupsEnabled?: boolean;
                                collectionsEnabled?: boolean;
                                analyticsEnabled?: boolean;
                            };
                        };
                        /** @format date-time */
                        createdAt: string;
                        /** @format date-time */
                        updatedAt: string;
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "FORBIDDEN" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/companies/${companyId}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get company statistics
         *
         * @tags Companies
         * @name GetCompaniesCompanyidStats
         * @request GET:/companies/{companyId}/stats
         * @secure
         */
        getCompaniesCompanyidStats: (companyId: string, params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        /** @min 0 */
                        users: number;
                        /** @min 0 */
                        documents: number;
                        /** @min 0 */
                        roles: number;
                        /** @min 0 */
                        groups?: number;
                        /** @min 0 */
                        collections?: number;
                        storage?: {
                            /** @min 0 */
                            used?: number;
                            /** @min 0 */
                            limit?: null | number;
                            /**
                             * @min 0
                             * @max 100
                             */
                            percentage?: number;
                        };
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "FORBIDDEN" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/companies/${companyId}/stats`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),
    };
    invitations = {
        /**
         * @description Invite a user to join the company
         *
         * @tags Invitations
         * @name PostInvitationsInvite
         * @request POST:/invitations/invite
         * @secure
         */
        postInvitationsInvite: (
            data: {
                /** @format email */
                email: string;
                /** @format uuid */
                roleId?: string;
                groupIds?: string[];
                /** @maxLength 500 */
                message?: string;
                /**
                 * @min 1
                 * @max 30
                 */
                expiresInDays?: number;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    data?: {
                        id?: string;
                        email?: string;
                        token?: string;
                        expiresAt?: string;
                        invitedBy?: {
                            id?: string;
                            name?: string;
                            email?: string;
                        };
                        role?: {
                            id?: string;
                            name?: string;
                            slug?: string;
                        };
                        groups?: {
                            id?: string;
                            name?: string;
                            slug?: string;
                        }[];
                        message?: string;
                        invitationUrl?: string;
                    };
                },
                {
                    success?: boolean;
                    error?: {
                        code?: string;
                        message?: string;
                    };
                }
            >({
                path: `/invitations/invite`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Accept an invitation and create user account
         *
         * @tags Invitations
         * @name PostInvitationsAccept
         * @request POST:/invitations/accept
         * @secure
         */
        postInvitationsAccept: (
            data: {
                /** @minLength 1 */
                token: string;
                userData: {
                    /**
                     * @minLength 1
                     * @maxLength 255
                     */
                    name: string;
                    /** @minLength 8 */
                    password: string;
                };
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    data?: {
                        userId?: {
                            id?: string;
                            email?: string;
                            name?: string;
                            isCompanyAdmin?: boolean;
                            role?: {
                                id?: string;
                                name?: string;
                                slug?: string;
                                permissions?: string[];
                            };
                            groups?: string[];
                            auth?: {
                                accessToken?: string;
                                refreshToken?: string;
                                expiresIn?: number;
                            };
                        };
                        company?: {
                            id?: string;
                            name?: string;
                            slug?: string;
                        };
                    };
                },
                {
                    success?: boolean;
                    error?: {
                        code?: string;
                        message?: string;
                    };
                }
            >({
                path: `/invitations/accept`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Get pending invitations for the company
         *
         * @tags Invitations
         * @name GetInvitationsPending
         * @request GET:/invitations/pending
         * @secure
         */
        getInvitationsPending: (
            query?: {
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
                limit?: number;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    data?: {
                        invitations?: {
                            id?: string;
                            email?: string;
                            status?: string;
                            expiresAt?: string;
                            createdAt?: string;
                            invitedBy?: {
                                id?: string;
                                name?: string;
                                email?: string;
                            };
                            role?: {
                                id?: string;
                                name?: string;
                                slug?: string;
                            };
                            groups?: {
                                id?: string;
                                name?: string;
                                slug?: string;
                            }[];
                            message?: string;
                        }[];
                        total?: number;
                        page?: number;
                        totalPages?: number;
                    };
                },
                {
                    success?: boolean;
                    error?: {
                        code?: string;
                        message?: string;
                    };
                }
            >({
                path: `/invitations/pending`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Cancel a pending invitation
         *
         * @tags Invitations
         * @name DeleteInvitationsInvitationid
         * @request DELETE:/invitations/{invitationId}
         * @secure
         */
        deleteInvitationsInvitationid: (invitationId: string, params: RequestParams = {}) =>
            this.request<
                {
                    success?: boolean;
                    message?: string;
                },
                {
                    success?: boolean;
                    error?: {
                        code?: string;
                        message?: string;
                    };
                }
            >({
                path: `/invitations/${invitationId}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Resend a pending invitation with new token and extended expiry
         *
         * @tags Invitations
         * @name PostInvitationsInvitationidResend
         * @request POST:/invitations/{invitationId}/resend
         * @secure
         */
        postInvitationsInvitationidResend: (invitationId: string, params: RequestParams = {}) =>
            this.request<
                {
                    success?: boolean;
                    data?: {
                        id?: string;
                        email?: string;
                        token?: string;
                        expiresAt?: string;
                        invitationUrl?: string;
                    };
                },
                {
                    success?: boolean;
                    error?: {
                        code?: string;
                        message?: string;
                    };
                }
            >({
                path: `/invitations/${invitationId}/resend`,
                method: "POST",
                secure: true,
                format: "json",
                ...params,
            }),
    };
    users = {
        /**
         * @description List all users in company with filtering and pagination
         *
         * @tags Users
         * @name GetUsers
         * @request GET:/users
         * @secure
         */
        getUsers: (
            query?: {
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
                limit?: number;
                /** @minLength 1 */
                search?: string;
                /** @format uuid */
                roleId?: string;
                /** @format uuid */
                groupId?: string;
                isActive?: boolean;
                isAdmin?: boolean;
                /** @default "createdAt" */
                sortBy?: "name" | "email" | "createdAt" | "updatedAt" | "lastLoginAt";
                /** @default "desc" */
                sortOrder?: "asc" | "desc";
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        /** @format uuid */
                        id: string;
                        /** @format uuid */
                        companyId: string;
                        /** @format email */
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        /** @format uri */
                        image?: null | string;
                        /** @format uuid */
                        roleId?: null | string;
                        isActive: boolean;
                        isCompanyAdmin: boolean;
                        isEmailVerified: boolean;
                        /** @format uuid */
                        invitedBy?: null | string;
                        /** @format date-time */
                        invitedAt?: null | string;
                        /** @format date-time */
                        acceptedAt?: null | string;
                        twoFactorEnabled: boolean;
                        /** @format date-time */
                        lastLoginAt?: null | string;
                        lastLoginIp?: null | string;
                        /** @min 0 */
                        failedLoginAttempts: number;
                        /** @format date-time */
                        lockedUntil?: null | string;
                        /** @format date-time */
                        createdAt: string;
                        /** @format date-time */
                        updatedAt: string;
                        role?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            description?: null | string;
                            slug?: string;
                            level?: number;
                            isSystemRole?: boolean;
                            isActive?: boolean;
                            color?: null | string;
                        };
                        groups?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            description?: null | string;
                            slug?: string;
                            isActive?: boolean;
                            /** @min 0 */
                            memberCount?: number;
                            status?: "active" | "pending" | "suspended";
                        }[];
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Create new user
         *
         * @tags Users
         * @name PostUsers
         * @request POST:/users
         * @secure
         */
        postUsers: (
            data: {
                /**
                 * @format email
                 * @maxLength 255
                 */
                email: string;
                /**
                 * @minLength 1
                 * @maxLength 255
                 */
                name: string;
                /**
                 * @minLength 8
                 * @maxLength 128
                 */
                password?: string;
                /** @format uuid */
                roleId?: string;
                /** @uniqueItems true */
                groupIds?: string[];
                /** @default false */
                isCompanyAdmin?: boolean;
                /** @default true */
                isActive?: boolean;
                /** @format uri */
                image?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        /** @format uuid */
                        id: string;
                        /** @format uuid */
                        companyId: string;
                        /** @format email */
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        /** @format uri */
                        image?: null | string;
                        /** @format uuid */
                        roleId?: null | string;
                        isActive: boolean;
                        isCompanyAdmin: boolean;
                        isEmailVerified: boolean;
                        /** @format uuid */
                        invitedBy?: null | string;
                        /** @format date-time */
                        invitedAt?: null | string;
                        /** @format date-time */
                        acceptedAt?: null | string;
                        twoFactorEnabled: boolean;
                        /** @format date-time */
                        lastLoginAt?: null | string;
                        lastLoginIp?: null | string;
                        /** @min 0 */
                        failedLoginAttempts: number;
                        /** @format date-time */
                        lockedUntil?: null | string;
                        /** @format date-time */
                        createdAt: string;
                        /** @format date-time */
                        updatedAt: string;
                        role?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            description?: null | string;
                            slug?: string;
                            level?: number;
                            isSystemRole?: boolean;
                            isActive?: boolean;
                            color?: null | string;
                        };
                        groups?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            description?: null | string;
                            slug?: string;
                            isActive?: boolean;
                            /** @min 0 */
                            memberCount?: number;
                            status?: "active" | "pending" | "suspended";
                        }[];
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Get current user profile
         *
         * @tags Users
         * @name GetUsersMe
         * @request GET:/users/me
         * @secure
         */
        getUsersMe: (params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        /** @format uuid */
                        id: string;
                        /** @format uuid */
                        companyId: string;
                        /** @format email */
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        /** @format uri */
                        image?: null | string;
                        /** @format uuid */
                        roleId?: null | string;
                        isActive: boolean;
                        isCompanyAdmin: boolean;
                        isEmailVerified: boolean;
                        /** @format uuid */
                        invitedBy?: null | string;
                        /** @format date-time */
                        invitedAt?: null | string;
                        /** @format date-time */
                        acceptedAt?: null | string;
                        twoFactorEnabled: boolean;
                        /** @format date-time */
                        lastLoginAt?: null | string;
                        lastLoginIp?: null | string;
                        /** @min 0 */
                        failedLoginAttempts: number;
                        /** @format date-time */
                        lockedUntil?: null | string;
                        /** @format date-time */
                        createdAt: string;
                        /** @format date-time */
                        updatedAt: string;
                        role?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            description?: null | string;
                            slug?: string;
                            level?: number;
                            isSystemRole?: boolean;
                            isActive?: boolean;
                            color?: null | string;
                        };
                        groups?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            description?: null | string;
                            slug?: string;
                            isActive?: boolean;
                            /** @min 0 */
                            memberCount?: number;
                            status?: "active" | "pending" | "suspended";
                        }[];
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/me`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get user by ID
         *
         * @tags Users
         * @name GetUsersId
         * @request GET:/users/{id}
         * @secure
         */
        getUsersId: (id: string | null, params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        /** @format uuid */
                        id: string;
                        /** @format uuid */
                        companyId: string;
                        /** @format email */
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        /** @format uri */
                        image?: null | string;
                        /** @format uuid */
                        roleId?: null | string;
                        isActive: boolean;
                        isCompanyAdmin: boolean;
                        isEmailVerified: boolean;
                        /** @format uuid */
                        invitedBy?: null | string;
                        /** @format date-time */
                        invitedAt?: null | string;
                        /** @format date-time */
                        acceptedAt?: null | string;
                        twoFactorEnabled: boolean;
                        /** @format date-time */
                        lastLoginAt?: null | string;
                        lastLoginIp?: null | string;
                        /** @min 0 */
                        failedLoginAttempts: number;
                        /** @format date-time */
                        lockedUntil?: null | string;
                        /** @format date-time */
                        createdAt: string;
                        /** @format date-time */
                        updatedAt: string;
                        role?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            description?: null | string;
                            slug?: string;
                            level?: number;
                            isSystemRole?: boolean;
                            isActive?: boolean;
                            color?: null | string;
                        };
                        groups?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            description?: null | string;
                            slug?: string;
                            isActive?: boolean;
                            /** @min 0 */
                            memberCount?: number;
                            status?: "active" | "pending" | "suspended";
                        }[];
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Update user
         *
         * @tags Users
         * @name PutUsersId
         * @request PUT:/users/{id}
         * @secure
         */
        putUsersId: (
            id: string | null,
            data: {
                /**
                 * @minLength 1
                 * @maxLength 255
                 */
                name?: string;
                /**
                 * @format email
                 * @maxLength 255
                 */
                email?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        /** @format uuid */
                        id: string;
                        /** @format uuid */
                        companyId: string;
                        /** @format email */
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        /** @format uri */
                        image?: null | string;
                        /** @format uuid */
                        roleId?: null | string;
                        isActive: boolean;
                        isCompanyAdmin: boolean;
                        isEmailVerified: boolean;
                        /** @format uuid */
                        invitedBy?: null | string;
                        /** @format date-time */
                        invitedAt?: null | string;
                        /** @format date-time */
                        acceptedAt?: null | string;
                        twoFactorEnabled: boolean;
                        /** @format date-time */
                        lastLoginAt?: null | string;
                        lastLoginIp?: null | string;
                        /** @min 0 */
                        failedLoginAttempts: number;
                        /** @format date-time */
                        lockedUntil?: null | string;
                        /** @format date-time */
                        createdAt: string;
                        /** @format date-time */
                        updatedAt: string;
                        role?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            description?: null | string;
                            slug?: string;
                            level?: number;
                            isSystemRole?: boolean;
                            isActive?: boolean;
                            color?: null | string;
                        };
                        groups?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            description?: null | string;
                            slug?: string;
                            isActive?: boolean;
                            /** @min 0 */
                            memberCount?: number;
                            status?: "active" | "pending" | "suspended";
                        }[];
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/${id}`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Delete user permanently
         *
         * @tags Users
         * @name DeleteUsersId
         * @request DELETE:/users/{id}
         * @secure
         */
        deleteUsersId: (id: string | null, params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        message: string;
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get user groups
         *
         * @tags Users
         * @name GetUsersIdGroups
         * @request GET:/users/{id}/groups
         * @secure
         */
        getUsersIdGroups: (id: string | null, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/${id}/groups`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Add user to groups
         *
         * @tags Users
         * @name PostUsersIdGroups
         * @request POST:/users/{id}/groups
         * @secure
         */
        postUsersIdGroups: (
            id: string | null,
            data: {
                /**
                 * @minItems 1
                 * @uniqueItems true
                 */
                groupIds: string[];
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        message: string;
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/${id}/groups`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Remove user from groups
         *
         * @tags Users
         * @name DeleteUsersIdGroups
         * @request DELETE:/users/{id}/groups
         * @secure
         */
        deleteUsersIdGroups: (
            id: string | null,
            data: {
                /**
                 * @minItems 1
                 * @uniqueItems true
                 */
                groupIds: string[];
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        message: string;
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/${id}/groups`,
                method: "DELETE",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Get user role
         *
         * @tags Users
         * @name GetUsersIdRole
         * @request GET:/users/{id}/role
         * @secure
         */
        getUsersIdRole: (id: string | null, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/${id}/role`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Assign role to user
         *
         * @tags Users
         * @name PostUsersIdRole
         * @request POST:/users/{id}/role
         * @secure
         */
        postUsersIdRole: (
            id: string | null,
            data: {
                /** @format uuid */
                roleId: string | null;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        message: string;
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/${id}/role`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Remove role from user
         *
         * @tags Users
         * @name DeleteUsersIdRole
         * @request DELETE:/users/{id}/role
         * @secure
         */
        deleteUsersIdRole: (id: string | null, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/${id}/role`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * @description Deactivate user
         *
         * @tags Users
         * @name PostUsersIdDeactivate
         * @request POST:/users/{id}/deactivate
         * @secure
         */
        postUsersIdDeactivate: (id: string, params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        message: string;
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/${id}/deactivate`,
                method: "POST",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Reactivate user
         *
         * @tags Users
         * @name PostUsersIdReactivate
         * @request POST:/users/{id}/reactivate
         * @secure
         */
        postUsersIdReactivate: (id: string | null, params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        message: string;
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/${id}/reactivate`,
                method: "POST",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get user statistics
         *
         * @tags Users
         * @name GetUsersStats
         * @request GET:/users/stats
         * @secure
         */
        getUsersStats: (params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        /** @min 0 */
                        totalUsers: number;
                        /** @min 0 */
                        activeUsers: number;
                        /** @min 0 */
                        inactiveUsers: number;
                        /** @min 0 */
                        adminUsers: number;
                        /** @min 0 */
                        invitedUsers: number;
                        /** @min 0 */
                        verifiedUsers: number;
                        /** @min 0 */
                        unverifiedUsers: number;
                        /** @min 0 */
                        usersWithTwoFactor: number;
                        /** @min 0 */
                        recentLogins: number;
                        /** @min 0 */
                        lockedUsers: number;
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/stats`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Remove user from specific group
         *
         * @tags Users
         * @name DeleteUsersIdGroupsGroupid
         * @request DELETE:/users/{id}/groups/{groupId}
         * @secure
         */
        deleteUsersIdGroupsGroupid: (id: string | null, groupId: string, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/users/${id}/groups/${groupId}`,
                method: "DELETE",
                secure: true,
                ...params,
            }),
    };
    documents = {
        /**
         * @description List documents with filtering and pagination
         *
         * @tags Documents
         * @name GetDocuments
         * @request GET:/documents
         * @secure
         */
        getDocuments: (
            query?: {
                /** @format uuid */
                parentId?: string;
                status?: "draft" | "published" | "archived" | "deleted";
                /** @format uuid */
                documentTypeId?: string;
                tags?: string;
                search?: string;
                /** @default "updatedAt" */
                sortBy?: "title" | "createdAt" | "updatedAt" | "publishedAt";
                /** @default "desc" */
                sortOrder?: "asc" | "desc";
                /**
                 * @min 1
                 * @max 100
                 * @default 50
                 */
                limit?: number;
                /**
                 * @min 0
                 * @default 0
                 */
                offset?: number;
                /**
                 * Filter by creator user ID
                 * @format uuid
                 */
                createdBy?: string;
                /**
                 * Filter documents created after this date
                 * @format date-time
                 */
                createdAfter?: string;
                /**
                 * Filter documents created before this date
                 * @format date-time
                 */
                createdBefore?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<any, any>({
                path: `/documents`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Create new document
         *
         * @tags Documents
         * @name PostDocuments
         * @request POST:/documents
         * @secure
         */
        postDocuments: (params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/documents`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Get document by ID
         *
         * @tags Documents
         * @name GetDocumentsDocumentid
         * @request GET:/documents/{documentId}
         * @secure
         */
        getDocumentsDocumentid: (documentId: string, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/documents/${documentId}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Update document
         *
         * @tags Documents
         * @name PutDocumentsDocumentid
         * @request PUT:/documents/{documentId}
         * @secure
         */
        putDocumentsDocumentid: (
            documentId: string,
            query?: {
                /** @default false */
                createVersion?: boolean;
            },
            params: RequestParams = {},
        ) =>
            this.request<any, any>({
                path: `/documents/${documentId}`,
                method: "PUT",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Delete document (soft delete by default)
         *
         * @tags Documents
         * @name DeleteDocumentsDocumentid
         * @request DELETE:/documents/{documentId}
         * @secure
         */
        deleteDocumentsDocumentid: (
            documentId: string,
            query?: {
                /** @default false */
                permanent?: boolean;
            },
            params: RequestParams = {},
        ) =>
            this.request<any, any>({
                path: `/documents/${documentId}`,
                method: "DELETE",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Lock or unlock document
         *
         * @tags Documents
         * @name PostDocumentsDocumentidLock
         * @request POST:/documents/{documentId}/lock
         * @secure
         */
        postDocumentsDocumentidLock: (documentId: string, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/documents/${documentId}/lock`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Get document versions
         *
         * @tags Documents
         * @name GetDocumentsDocumentidVersions
         * @request GET:/documents/{documentId}/versions
         * @secure
         */
        getDocumentsDocumentidVersions: (documentId: string, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/documents/${documentId}/versions`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Get document children
         *
         * @tags Documents
         * @name GetDocumentsDocumentidChildren
         * @request GET:/documents/{documentId}/children
         * @secure
         */
        getDocumentsDocumentidChildren: (documentId: string, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/documents/${documentId}/children`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Get specific document version
         *
         * @tags Documents
         * @name GetDocumentsDocumentidVersionsVersion
         * @request GET:/documents/{documentId}/versions/{version}
         * @secure
         */
        getDocumentsDocumentidVersionsVersion: (
            documentId: string,
            version: string,
            query?: {
                /** @default true */
                includeContent?: boolean;
            },
            params: RequestParams = {},
        ) =>
            this.request<any, any>({
                path: `/documents/${documentId}/versions/${version}`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Delete specific document version
         *
         * @tags Documents
         * @name DeleteDocumentsDocumentidVersionsVersion
         * @request DELETE:/documents/{documentId}/versions/{version}
         * @secure
         */
        deleteDocumentsDocumentidVersionsVersion: (documentId: string, version: string, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/documents/${documentId}/versions/${version}`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * @description Restore document to specific version
         *
         * @tags Documents
         * @name PostDocumentsDocumentidVersionsVersionRestore
         * @request POST:/documents/{documentId}/versions/{version}/restore
         * @secure
         */
        postDocumentsDocumentidVersionsVersionRestore: (
            documentId: string,
            version: string,
            params: RequestParams = {},
        ) =>
            this.request<any, any>({
                path: `/documents/${documentId}/versions/${version}/restore`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Compare two document versions
         *
         * @tags Documents
         * @name GetDocumentsDocumentidVersionsFromversionCompareToversion
         * @request GET:/documents/{documentId}/versions/{fromVersion}/compare/{toVersion}
         * @secure
         */
        getDocumentsDocumentidVersionsFromversionCompareToversion: (
            documentId: string,
            fromVersion: string,
            toVersion: string,
            params: RequestParams = {},
        ) =>
            this.request<any, any>({
                path: `/documents/${documentId}/versions/${fromVersion}/compare/${toVersion}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Get version statistics
         *
         * @tags Documents
         * @name GetDocumentsStatisticsVersions
         * @request GET:/documents/statistics/versions
         * @secure
         */
        getDocumentsStatisticsVersions: (params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/documents/statistics/versions`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Get children of a folder by path with sorting
         *
         * @tags Documents
         * @name GetDocumentsChildrenByPath
         * @request GET:/documents/children-by-path
         * @secure
         */
        getDocumentsChildrenByPath: (
            query: {
                /**
                 * Parent folder path (e.g., "/folder1/subfolder")
                 * @minLength 1
                 */
                parentPath: string;
                /**
                 * Sort field
                 * @default "title"
                 */
                sortBy?: "title" | "createdAt" | "updatedAt";
                /**
                 * Sort order
                 * @default "asc"
                 */
                sortOrder?: "asc" | "desc";
            },
            params: RequestParams = {},
        ) =>
            this.request<any, any>({
                path: `/documents/children-by-path`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Copy documents to a new location
         *
         * @tags Documents
         * @name PostDocumentsCopy
         * @request POST:/documents/copy
         * @secure
         */
        postDocumentsCopy: (params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/documents/copy`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Move documents to a new location
         *
         * @tags Documents
         * @name PostDocumentsMove
         * @request POST:/documents/move
         * @secure
         */
        postDocumentsMove: (params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/documents/move`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Move documents to trash (soft delete with recovery)
         *
         * @tags Documents
         * @name PostDocumentsTrash
         * @request POST:/documents/trash
         * @secure
         */
        postDocumentsTrash: (params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/documents/trash`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Permanently delete documents from trash
         *
         * @tags Documents
         * @name PostDocumentsEmptyTrash
         * @request POST:/documents/empty-trash
         * @secure
         */
        postDocumentsEmptyTrash: (params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/documents/empty-trash`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Restore documents from trash
         *
         * @tags Documents
         * @name PostDocumentsRestore
         * @request POST:/documents/restore
         * @secure
         */
        postDocumentsRestore: (params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/documents/restore`,
                method: "POST",
                secure: true,
                ...params,
            }),
    };
    admin = {
        /**
         * @description List all document types with filtering and pagination
         *
         * @tags Document Types
         * @name GetAdminDocumentTypes
         * @request GET:/admin/document-types
         * @secure
         */
        getAdminDocumentTypes: (
            query?: {
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
                limit?: number;
                /** @maxLength 255 */
                search?: string | null;
                isActive?: boolean | null;
                /** @default "displayOrder" */
                sortBy?: "name" | "createdAt" | "updatedAt" | "displayOrder";
                /** @default "asc" */
                sortOrder?: "asc" | "desc";
            },
            params: RequestParams = {},
        ) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/document-types`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Create new document type
         *
         * @tags Document Types
         * @name PostAdminDocumentTypes
         * @request POST:/admin/document-types
         * @secure
         */
        postAdminDocumentTypes: (params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        /** @format uuid */
                        id: string;
                        /** @format uuid */
                        companyId: string;
                        name: string;
                        description?: null | string;
                        slug: string;
                        icon?: null | string;
                        color?: null | string;
                        metadataSchema?: {
                            fields?: {
                                id?: string;
                                name?: string;
                                type?:
                                    | "text"
                                    | "number"
                                    | "date"
                                    | "boolean"
                                    | "select"
                                    | "multiselect"
                                    | "url"
                                    | "email"
                                    | "relation";
                                required?: boolean;
                                defaultValue?: any;
                                options?: string[];
                                validation?: object;
                                rules?: object;
                                relationConfig?: object;
                                displayOrder?: number;
                            }[];
                        };
                        settings?: {
                            allowVersioning?: boolean;
                            requireApproval?: boolean;
                            autoArchive?: object;
                            permissions?: object;
                        };
                        isActive: boolean;
                        /** @min 0 */
                        displayOrder: number;
                        /** @min 0 */
                        documentCount: number;
                        /**
                         * Bitwise permissions for the current user on this document type
                         * @min 0
                         */
                        userPermissions: number;
                        /** @format date-time */
                        createdAt: string;
                        /** @format date-time */
                        updatedAt: string;
                        createdBy?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            /** @format email */
                            email?: string;
                        };
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/document-types`,
                method: "POST",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get document type statistics overview
         *
         * @tags Document Types
         * @name GetAdminDocumentTypesStats
         * @request GET:/admin/document-types/stats
         * @secure
         */
        getAdminDocumentTypesStats: (params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/document-types/stats`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Get document type by ID
         *
         * @tags Document Types
         * @name GetAdminDocumentTypesId
         * @request GET:/admin/document-types/{id}
         * @secure
         */
        getAdminDocumentTypesId: (id: string, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/document-types/${id}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Update document type
         *
         * @tags Document Types
         * @name PutAdminDocumentTypesId
         * @request PUT:/admin/document-types/{id}
         * @secure
         */
        putAdminDocumentTypesId: (id: string, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/document-types/${id}`,
                method: "PUT",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @name DeleteAdminDocumentTypesId
         * @request DELETE:/admin/document-types/{id}
         * @secure
         */
        deleteAdminDocumentTypesId: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/admin/document-types/${id}`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @name PostAdminDocumentTypesBulk
         * @request POST:/admin/document-types/bulk
         * @secure
         */
        postAdminDocumentTypesBulk: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/admin/document-types/bulk`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description List all roles with filtering and pagination
         *
         * @tags Roles
         * @name GetAdminRoles
         * @request GET:/admin/roles
         * @secure
         */
        getAdminRoles: (
            query?: {
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
                limit?: number;
                /** @minLength 1 */
                search?: string;
                /** @format uuid */
                parentId?: string;
                isActive?: boolean;
                /** @default "createdAt" */
                sortBy?: "name" | "level" | "createdAt" | "updatedAt";
                /** @default "desc" */
                sortOrder?: "asc" | "desc";
            },
            params: RequestParams = {},
        ) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/roles`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Create new role
         *
         * @tags Roles
         * @name PostAdminRoles
         * @request POST:/admin/roles
         * @secure
         */
        postAdminRoles: (params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        /** @format uuid */
                        id: string;
                        /** @format uuid */
                        companyId: string;
                        name: string;
                        description?: null | string;
                        slug: string;
                        /** @format uuid */
                        parentId?: null | string;
                        /** @min 0 */
                        level: number;
                        path: string;
                        permissions: (
                            | "view_file"
                            | "edit_file"
                            | "delete_file"
                            | "create_folder"
                            | "edit_folder"
                            | "delete_folder"
                            | "view_metadata"
                            | "edit_metadata"
                            | "manage_permissions"
                            | "manage_users"
                            | "manage_roles"
                            | "manage_groups"
                            | "manage_templates"
                            | "manage_workflows"
                            | "manage_integrations"
                            | "view_analytics"
                            | "manage_settings"
                            | "manage_billing"
                            | "super_admin"
                        )[];
                        isSystemRole: boolean;
                        isActive: boolean;
                        color?: null | string;
                        /** @format date-time */
                        createdAt: string;
                        /** @format date-time */
                        updatedAt: string;
                        /** Bitwise permissions for frontend UI optimization */
                        userPermissions?: number;
                        parent?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            slug?: string;
                            level?: number;
                        };
                        children?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            slug?: string;
                            level?: number;
                            /** @min 0 */
                            userCount?: number;
                        }[];
                        /** @min 0 */
                        userCount?: number;
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/roles`,
                method: "POST",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get role by ID
         *
         * @tags Roles
         * @name GetAdminRolesId
         * @request GET:/admin/roles/{id}
         * @secure
         */
        getAdminRolesId: (id: string, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/roles/${id}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Update role
         *
         * @tags Roles
         * @name PutAdminRolesId
         * @request PUT:/admin/roles/{id}
         * @secure
         */
        putAdminRolesId: (id: string, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/roles/${id}`,
                method: "PUT",
                secure: true,
                ...params,
            }),

        /**
         * @description Delete role
         *
         * @tags Roles
         * @name DeleteAdminRolesId
         * @request DELETE:/admin/roles/{id}
         * @secure
         */
        deleteAdminRolesId: (id: string, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/roles/${id}`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * @description Get role hierarchy tree
         *
         * @tags Roles
         * @name GetAdminRolesHierarchyTree
         * @request GET:/admin/roles/hierarchy/tree
         * @secure
         */
        getAdminRolesHierarchyTree: (params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/roles/hierarchy/tree`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Get role statistics
         *
         * @tags Roles
         * @name GetAdminRolesStats
         * @request GET:/admin/roles/stats
         * @secure
         */
        getAdminRolesStats: (params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/roles/stats`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description List all groups with filtering and pagination
         *
         * @tags Groups
         * @name GetAdminGroups
         * @request GET:/admin/groups
         * @secure
         */
        getAdminGroups: (
            query?: {
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
                limit?: number;
                /** @minLength 1 */
                search?: string;
                isActive?: boolean;
                /** @default "createdAt" */
                sortBy?: "name" | "memberCount" | "createdAt" | "updatedAt";
                /** @default "desc" */
                sortOrder?: "asc" | "desc";
            },
            params: RequestParams = {},
        ) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/groups`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Create new group
         *
         * @tags Groups
         * @name PostAdminGroups
         * @request POST:/admin/groups
         * @secure
         */
        postAdminGroups: (params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        /** @format uuid */
                        id: string;
                        /** @format uuid */
                        companyId: string;
                        name: string;
                        description?: null | string;
                        slug: string;
                        isActive: boolean;
                        color?: null | string;
                        /** @min 0 */
                        memberCount: number;
                        settings?: {
                            allowSelfJoin?: boolean;
                            requireApproval?: boolean;
                            /** @min 1 */
                            maxMembers?: null | number;
                            visibility?: "public" | "private" | "hidden";
                        };
                        /** @format date-time */
                        createdAt: string;
                        /** @format date-time */
                        updatedAt: string;
                        /** Bitwise permissions for frontend UI optimization */
                        userPermissions?: number;
                        createdBy?: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            /** @format email */
                            email?: string;
                        };
                        members?: {
                            /** @format uuid */
                            id: string;
                            name: string;
                            /** @format email */
                            email: string;
                            status: "active" | "pending" | "suspended";
                            /** @format date-time */
                            joinedAt: string;
                            role?: null | string;
                        }[];
                    };
                    meta?: {
                        /** @format date-time */
                        timestamp?: string;
                        requestId?: string;
                        message?: string;
                    };
                },
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/groups`,
                method: "POST",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get group by ID
         *
         * @tags Groups
         * @name GetAdminGroupsId
         * @request GET:/admin/groups/{id}
         * @secure
         */
        getAdminGroupsId: (id: string, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/groups/${id}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Update group
         *
         * @tags Groups
         * @name PutAdminGroupsId
         * @request PUT:/admin/groups/{id}
         * @secure
         */
        putAdminGroupsId: (id: string, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/groups/${id}`,
                method: "PUT",
                secure: true,
                ...params,
            }),

        /**
         * @description Delete group
         *
         * @tags Groups
         * @name DeleteAdminGroupsId
         * @request DELETE:/admin/groups/{id}
         * @secure
         */
        deleteAdminGroupsId: (id: string, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/groups/${id}`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * @description Get user groups
         *
         * @tags Groups
         * @name GetAdminGroupsUserUserid
         * @request GET:/admin/groups/user/{userId}
         * @secure
         */
        getAdminGroupsUserUserid: (userId: string, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/groups/user/${userId}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Add members to group
         *
         * @tags Groups
         * @name PostAdminGroupsIdMembers
         * @request POST:/admin/groups/{id}/members
         * @secure
         */
        postAdminGroupsIdMembers: (id: string, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/groups/${id}/members`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Remove members from group
         *
         * @tags Groups
         * @name DeleteAdminGroupsIdMembers
         * @request DELETE:/admin/groups/{id}/members
         * @secure
         */
        deleteAdminGroupsIdMembers: (id: string, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/groups/${id}/members`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * @description Update member status in group
         *
         * @tags Groups
         * @name PutAdminGroupsIdMembersUseridStatus
         * @request PUT:/admin/groups/{id}/members/{userId}/status
         * @secure
         */
        putAdminGroupsIdMembersUseridStatus: (id: string, userId: string, params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/groups/${id}/members/${userId}/status`,
                method: "PUT",
                secure: true,
                ...params,
            }),

        /**
         * @description Get group statistics
         *
         * @tags Groups
         * @name GetAdminGroupsStats
         * @request GET:/admin/groups/stats
         * @secure
         */
        getAdminGroupsStats: (params: RequestParams = {}) =>
            this.request<
                any,
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "VALIDATION_ERROR" | null;
                          message: string;
                          field?: string;
                          details?: {
                              validationErrors?: {
                                  field?: string;
                                  message?: string;
                                  value?: any;
                              }[];
                          };
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "UNAUTHORIZED" | null;
                          message: "Authentication required";
                      };
                  }
                | {
                      success: false;
                      error: {
                          code: string;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code: "NOT_FOUND" | null;
                          message: string;
                      };
                  }
                | {
                      /** @default false */
                      success?: false;
                      error: {
                          code?: "INTERNAL_ERROR" | null;
                          message: "Internal server error";
                      };
                  }
            >({
                path: `/admin/groups/stats`,
                method: "GET",
                secure: true,
                ...params,
            }),
    };
    documentTags = {
        /**
         * No description
         *
         * @name PostDocumentTags
         * @request POST:/document-tags
         * @secure
         */
        postDocumentTags: (
            data: {
                /**
                 * @minLength 1
                 * @maxLength 100
                 */
                name: string;
                /**
                 * @minLength 1
                 * @maxLength 100
                 * @pattern ^[a-z0-9-_]+$
                 */
                slug?: string;
                /** @maxLength 500 */
                description?: string;
                /** @pattern ^#[0-9A-F]{6}$ */
                color?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<void, any>({
                path: `/document-tags`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @name GetDocumentTags
         * @request GET:/document-tags
         * @secure
         */
        getDocumentTags: (
            query?: {
                /** @maxLength 100 */
                search?: string;
                /**
                 * @min 1
                 * @max 100
                 * @default 50
                 */
                limit?: number;
                /**
                 * @min 0
                 * @default 0
                 */
                offset?: number;
                /** @default "name" */
                sortBy?: "name" | "useCount" | "createdAt";
                /** @default "asc" */
                sortOrder?: "asc" | "desc";
            },
            params: RequestParams = {},
        ) =>
            this.request<void, any>({
                path: `/document-tags`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @name GetDocumentTagsSearch
         * @request GET:/document-tags/search
         * @secure
         */
        getDocumentTagsSearch: (
            query: {
                /**
                 * @minLength 1
                 * @maxLength 100
                 */
                q: string;
                /**
                 * @min 1
                 * @max 50
                 * @default 10
                 */
                limit?: number;
            },
            params: RequestParams = {},
        ) =>
            this.request<void, any>({
                path: `/document-tags/search`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @name GetDocumentTagsStats
         * @request GET:/document-tags/stats
         * @secure
         */
        getDocumentTagsStats: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/document-tags/stats`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @name GetDocumentTagsTagid
         * @request GET:/document-tags/{tagId}
         * @secure
         */
        getDocumentTagsTagid: (tagId: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/document-tags/${tagId}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @name PutDocumentTagsTagid
         * @request PUT:/document-tags/{tagId}
         * @secure
         */
        putDocumentTagsTagid: (
            tagId: string,
            data: {
                /**
                 * @minLength 1
                 * @maxLength 100
                 */
                name?: string;
                /**
                 * @minLength 1
                 * @maxLength 100
                 * @pattern ^[a-z0-9-_]+$
                 */
                slug?: string;
                /** @maxLength 500 */
                description?: string;
                /** @pattern ^#[0-9A-F]{6}$ */
                color?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<void, any>({
                path: `/document-tags/${tagId}`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @name DeleteDocumentTagsTagid
         * @request DELETE:/document-tags/{tagId}
         * @secure
         */
        deleteDocumentTagsTagid: (tagId: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/document-tags/${tagId}`,
                method: "DELETE",
                secure: true,
                ...params,
            }),
    };
    audit = {
        /**
         * @description Get company audit logs
         *
         * @tags Audit
         * @name GetAuditLogs
         * @request GET:/audit/logs
         * @secure
         */
        getAuditLogs: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/audit/logs`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Get user activities
         *
         * @tags Audit
         * @name GetAuditUsersUseridActivities
         * @request GET:/audit/users/{userId}/activities
         * @secure
         */
        getAuditUsersUseridActivities: (userId: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/audit/users/${userId}/activities`,
                method: "GET",
                secure: true,
                ...params,
            }),
    };
    search = {
        /**
         * @description Search documents in company
         *
         * @tags Search
         * @name GetSearchDocuments
         * @request GET:/search/documents
         * @secure
         */
        getSearchDocuments: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/search/documents`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Advanced search with filters
         *
         * @tags Search
         * @name PostSearchAdvanced
         * @request POST:/search/advanced
         * @secure
         */
        postSearchAdvanced: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/search/advanced`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Get search suggestions
         *
         * @tags Search
         * @name GetSearchSuggestions
         * @request GET:/search/suggestions
         * @secure
         */
        getSearchSuggestions: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/search/suggestions`,
                method: "GET",
                secure: true,
                ...params,
            }),
    };
    files = {
        /**
         * @description Upload a file to a document
         *
         * @tags Files
         * @name PostFilesUpload
         * @request POST:/files/upload
         * @secure
         */
        postFilesUpload: (
            data: {
                /** @format binary */
                file: File;
                /** @format uuid */
                documentId: string;
                validateMimeType?: boolean;
                maxFileSize?: number;
            },
            params: RequestParams = {},
        ) =>
            this.request<void, any>({
                path: `/files/upload`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.FormData,
                ...params,
            }),

        /**
         * @description Generate a presigned upload URL for a file
         *
         * @tags Files
         * @name PostFilesUploadUrl
         * @request POST:/files/upload-url
         * @secure
         */
        postFilesUploadUrl: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/files/upload-url`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @name GetFilesDownloadStoragekey
         * @request GET:/files/download/{storageKey}
         * @secure
         */
        getFilesDownloadStoragekey: (storageKey: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/files/download/${storageKey}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Generate a presigned download URL for a file
         *
         * @tags Files
         * @name PostFilesDownloadUrlStoragekey
         * @request POST:/files/download-url/{storageKey}
         * @secure
         */
        postFilesDownloadUrlStoragekey: (
            storageKey: string,
            data: {
                /**
                 * @min 60
                 * @max 86400
                 * @default 3600
                 */
                expirySeconds?: number;
            },
            params: RequestParams = {},
        ) =>
            this.request<void, any>({
                path: `/files/download-url/${storageKey}`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @name GetFilesInfoStoragekey
         * @request GET:/files/info/{storageKey}
         * @secure
         */
        getFilesInfoStoragekey: (storageKey: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/files/info/${storageKey}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @name DeleteFilesStoragekey
         * @request DELETE:/files/{storageKey}
         * @secure
         */
        deleteFilesStoragekey: (storageKey: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/files/${storageKey}`,
                method: "DELETE",
                secure: true,
                ...params,
            }),
    };
    collections = {
        /**
         * @description Create a new collection for organizing documents
         *
         * @tags Collections
         * @name PostCollectionsCollections
         * @summary Create a new collection
         * @request POST:/collections/collections
         * @secure
         */
        postCollectionsCollections: (
            data: {
                /**
                 * Collection name
                 * @minLength 1
                 * @maxLength 255
                 */
                name: string;
                /**
                 * Collection description
                 * @maxLength 1000
                 */
                description?: string;
                /**
                 * Collection slug (lowercase letters, numbers, and hyphens only)
                 * @minLength 1
                 * @maxLength 100
                 * @pattern ^[a-z0-9-]+$
                 */
                slug?: string;
                /**
                 * Collection type
                 * @default "standard"
                 */
                type?: "standard" | "project" | "team" | "client" | "temporary";
                /**
                 * Collection icon
                 * @maxLength 50
                 */
                icon?: string;
                /**
                 * Collection color (hex format, e.g., #FF0000)
                 * @pattern ^#[0-9A-Fa-f]{6}$
                 */
                color?: string;
                /**
                 * Whether the collection is public
                 * @default false
                 */
                isPublic?: boolean;
                /** Collection metadata */
                metadata?: object;
                /** Collection settings */
                settings?: {
                    /** Allow duplicate documents in collection */
                    allowDuplicateDocuments?: boolean;
                    /** Automatically add new document versions */
                    autoAddNewVersions?: boolean;
                    /** Send notifications on collection changes */
                    notifyOnChanges?: boolean;
                    /** Require approval to add documents */
                    requireApprovalToAdd?: boolean;
                    /**
                     * Maximum number of documents allowed
                     * @min 1
                     */
                    maxDocuments?: number;
                    /**
                     * Collection expiration date
                     * @format date-time
                     */
                    expiresAt?: string;
                };
                /**
                 * Collection owner ID
                 * @format uuid
                 */
                ownerId?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    message?: string;
                    data?: object;
                },
                any
            >({
                path: `/collections/collections`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Get a paginated list of collections with filtering options
         *
         * @tags Collections
         * @name GetCollectionsCollections
         * @summary List collections
         * @request GET:/collections/collections
         * @secure
         */
        getCollectionsCollections: (
            query?: {
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
                limit?: number;
                /**
                 * Sort field
                 * @default "updatedAt"
                 */
                sortBy?: "name" | "createdAt" | "updatedAt" | "lastActivityAt" | "documentCount";
                /**
                 * Sort order
                 * @default "desc"
                 */
                sortOrder?: "asc" | "desc";
                /** Filter by collection type */
                type?: "standard" | "project" | "team" | "client" | "temporary";
                /** Filter by archived status */
                isArchived?: boolean;
                /** Filter by public status */
                isPublic?: boolean;
                /** Show only collections owned by current user */
                ownedByUser?: boolean;
                /** Show only collections where user is a member */
                memberOfUser?: boolean;
                /**
                 * Search in collection name and description
                 * @maxLength 255
                 */
                search?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    collections?: any[];
                    total?: number;
                    hasMore?: boolean;
                    limit?: number;
                    offset?: number;
                },
                any
            >({
                path: `/collections/collections`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get detailed information about a specific collection
         *
         * @tags Collections
         * @name GetCollectionsCollectionsCollectionid
         * @summary Get collection by ID
         * @request GET:/collections/collections/{collectionId}
         * @secure
         */
        getCollectionsCollectionsCollectionid: (collectionId: string, params: RequestParams = {}) =>
            this.request<object, any>({
                path: `/collections/collections/${collectionId}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Update collection information and settings
         *
         * @tags Collections
         * @name PutCollectionsCollectionsCollectionid
         * @summary Update collection
         * @request PUT:/collections/collections/{collectionId}
         * @secure
         */
        putCollectionsCollectionsCollectionid: (
            collectionId: string,
            data: {
                /**
                 * Collection name
                 * @minLength 1
                 * @maxLength 255
                 */
                name?: string;
                /**
                 * Collection description
                 * @maxLength 1000
                 */
                description?: string;
                /**
                 * Collection slug (lowercase letters, numbers, and hyphens only)
                 * @minLength 1
                 * @maxLength 100
                 * @pattern ^[a-z0-9-]+$
                 */
                slug?: string;
                /** Collection type */
                type?: "standard" | "project" | "team" | "client" | "temporary";
                /**
                 * Collection icon
                 * @maxLength 50
                 */
                icon?: string;
                /**
                 * Collection color (hex format, e.g., #FF0000)
                 * @pattern ^#[0-9A-Fa-f]{6}$
                 */
                color?: string;
                /** Whether the collection is public */
                isPublic?: boolean;
                /** Whether the collection is archived */
                isArchived?: boolean;
                /** Collection metadata */
                metadata?: object;
                /** Collection settings */
                settings?: {
                    /** Allow duplicate documents in collection */
                    allowDuplicateDocuments?: boolean;
                    /** Automatically add new document versions */
                    autoAddNewVersions?: boolean;
                    /** Send notifications on collection changes */
                    notifyOnChanges?: boolean;
                    /** Require approval to add documents */
                    requireApprovalToAdd?: boolean;
                    /**
                     * Maximum number of documents allowed
                     * @min 1
                     */
                    maxDocuments?: number;
                    /**
                     * Collection expiration date
                     * @format date-time
                     */
                    expiresAt?: string;
                };
                /**
                 * Collection owner ID
                 * @format uuid
                 */
                ownerId?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    message?: string;
                    data?: object;
                },
                any
            >({
                path: `/collections/collections/${collectionId}`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Delete a collection (only owner can delete)
         *
         * @tags Collections
         * @name DeleteCollectionsCollectionsCollectionid
         * @summary Delete collection
         * @request DELETE:/collections/collections/{collectionId}
         * @secure
         */
        deleteCollectionsCollectionsCollectionid: (collectionId: string, params: RequestParams = {}) =>
            this.request<
                {
                    success?: boolean;
                    message?: string;
                },
                any
            >({
                path: `/collections/collections/${collectionId}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get paginated list of documents in a collection
         *
         * @tags Collections
         * @name GetCollectionsCollectionsCollectionidDocuments
         * @summary Get collection documents
         * @request GET:/collections/collections/{collectionId}/documents
         * @secure
         */
        getCollectionsCollectionsCollectionidDocuments: (
            collectionId: string,
            query?: {
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
                limit?: number;
                /**
                 * Sort field
                 * @default "position"
                 */
                sortBy?: "position" | "addedAt" | "name";
                /**
                 * Sort order
                 * @default "asc"
                 */
                sortOrder?: "asc" | "desc";
                /**
                 * Filter by section name
                 * @maxLength 100
                 */
                section?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    documents?: any[];
                    total?: number;
                    hasMore?: boolean;
                    limit?: number;
                    offset?: number;
                },
                any
            >({
                path: `/collections/collections/${collectionId}/documents`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Add a document to a collection
         *
         * @tags Collections
         * @name PostCollectionsCollectionsCollectionidDocuments
         * @summary Add document to collection
         * @request POST:/collections/collections/{collectionId}/documents
         * @secure
         */
        postCollectionsCollectionsCollectionidDocuments: (
            collectionId: string,
            data: {
                /**
                 * Document ID to add to collection
                 * @format uuid
                 */
                documentId: string;
                /**
                 * Position of document in collection
                 * @min 0
                 */
                position?: number;
                /**
                 * Section name within collection
                 * @maxLength 100
                 */
                section?: string;
                /** Collection-specific metadata for the document */
                collectionMetadata?: {
                    /**
                     * Notes about this document in the collection
                     * @maxLength 1000
                     */
                    notes?: string;
                    /** Tags for this document in the collection */
                    tags?: string[];
                    /** Importance level of document in collection */
                    importance?: "low" | "medium" | "high" | "critical";
                    /** Custom metadata fields */
                    customFields?: object;
                };
                /**
                 * Whether adding this document requires approval
                 * @default false
                 */
                requiresApproval?: boolean;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    message?: string;
                    data?: object;
                },
                any
            >({
                path: `/collections/collections/${collectionId}/documents`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Remove a document from a collection
         *
         * @tags Collections
         * @name DeleteCollectionsCollectionsCollectionidDocumentsDocumentid
         * @summary Remove document from collection
         * @request DELETE:/collections/collections/{collectionId}/documents/{documentId}
         * @secure
         */
        deleteCollectionsCollectionsCollectionidDocumentsDocumentid: (
            collectionId: string,
            documentId: string,
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    message?: string;
                },
                any
            >({
                path: `/collections/collections/${collectionId}/documents/${documentId}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Update the position and section of a document within a collection
         *
         * @tags Collections
         * @name PutCollectionsCollectionsCollectionidDocumentsDocumentidPosition
         * @summary Update document position
         * @request PUT:/collections/collections/{collectionId}/documents/{documentId}/position
         * @secure
         */
        putCollectionsCollectionsCollectionidDocumentsDocumentidPosition: (
            collectionId: string,
            documentId: string,
            data: {
                /**
                 * New position for the document
                 * @min 0
                 */
                position: number;
                /**
                 * New section for the document
                 * @maxLength 100
                 */
                section?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    message?: string;
                },
                any
            >({
                path: `/collections/collections/${collectionId}/documents/${documentId}/position`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Get paginated list of collection members
         *
         * @tags Collections
         * @name GetCollectionsCollectionsCollectionidMembers
         * @summary Get collection members
         * @request GET:/collections/collections/{collectionId}/members
         * @secure
         */
        getCollectionsCollectionsCollectionidMembers: (
            collectionId: string,
            query?: {
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
                limit?: number;
                sortBy?: string;
                /** @default "desc" */
                sortOrder?: "asc" | "desc";
                /** Filter by member role */
                role?: "owner" | "admin" | "editor" | "viewer" | "member";
                /** Filter by member status */
                status?: "active" | "inactive" | "pending";
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    members?: any[];
                    total?: number;
                    hasMore?: boolean;
                    limit?: number;
                    offset?: number;
                },
                any
            >({
                path: `/collections/collections/${collectionId}/members`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Add a user as a member of a collection
         *
         * @tags Collections
         * @name PostCollectionsCollectionsCollectionidMembers
         * @summary Add member to collection
         * @request POST:/collections/collections/{collectionId}/members
         * @secure
         */
        postCollectionsCollectionsCollectionidMembers: (
            collectionId: string,
            data: {
                /**
                 * User ID to add as member
                 * @format uuid
                 */
                userId: string;
                /**
                 * Role to assign to the member
                 * @default "member"
                 */
                role?: "owner" | "admin" | "editor" | "viewer" | "member";
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    message?: string;
                    data?: object;
                },
                any
            >({
                path: `/collections/collections/${collectionId}/members`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Update a collection member's role and permissions
         *
         * @tags Collections
         * @name PutCollectionsCollectionsCollectionidMembersUserid
         * @summary Update collection member
         * @request PUT:/collections/collections/{collectionId}/members/{userId}
         * @secure
         */
        putCollectionsCollectionsCollectionidMembersUserid: (
            collectionId: string,
            userId: string,
            data: {
                /** New role for the member */
                role?: "owner" | "admin" | "editor" | "viewer" | "member";
                /** New status for the member */
                status?: "active" | "inactive" | "pending";
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    message?: string;
                },
                any
            >({
                path: `/collections/collections/${collectionId}/members/${userId}`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Remove a user from a collection
         *
         * @tags Collections
         * @name DeleteCollectionsCollectionsCollectionidMembersUserid
         * @summary Remove member from collection
         * @request DELETE:/collections/collections/{collectionId}/members/{userId}
         * @secure
         */
        deleteCollectionsCollectionsCollectionidMembersUserid: (
            collectionId: string,
            userId: string,
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    message?: string;
                },
                any
            >({
                path: `/collections/collections/${collectionId}/members/${userId}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get paginated list of collection activities and audit log
         *
         * @tags Collections
         * @name GetCollectionsCollectionsCollectionidActivities
         * @summary Get collection activities
         * @request GET:/collections/collections/{collectionId}/activities
         * @secure
         */
        getCollectionsCollectionsCollectionidActivities: (
            collectionId: string,
            query?: {
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
                limit?: number;
                sortBy?: string;
                /** @default "desc" */
                sortOrder?: "asc" | "desc";
                /**
                 * Filter by activity action
                 * @maxLength 50
                 */
                action?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    activities?: any[];
                    total?: number;
                    hasMore?: boolean;
                    limit?: number;
                    offset?: number;
                },
                any
            >({
                path: `/collections/collections/${collectionId}/activities`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params,
            }),
    };
}
