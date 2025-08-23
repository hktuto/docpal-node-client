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
                        user: {
                            id: string;
                            /** @format email */
                            email: string;
                            name: string;
                            companyId: string;
                            isCompanyAdmin: boolean;
                            permissions?: string[];
                        };
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
                        user: {
                            id: string;
                            /** @format email */
                            email: string;
                            name: string;
                            companyId: string;
                            isCompanyAdmin: boolean;
                            permissions?: string[];
                        };
                        session: {
                            id?: string;
                            token?: string;
                            /** @format date-time */
                            expiresAt: string;
                        };
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
        postAuthResetPassword: (
            data: {
                /**
                 * Email address to send reset link
                 * @format email
                 */
                email: string;
            },
            params: RequestParams = {},
        ) =>
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
                path: `/auth/reset-password`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
        postAuthResetPasswordConfirm: (
            data: {
                /** Password reset token */
                token: string;
                /**
                 * New password (minimum 8 characters)
                 * @minLength 8
                 */
                password: string;
            },
            params: RequestParams = {},
        ) =>
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
                path: `/auth/reset-password/confirm`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
        postAuthVerifyEmail: (
            data: {
                /** Email verification token */
                token: string;
            },
            params: RequestParams = {},
        ) =>
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
                path: `/auth/verify-email`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
                path: `/auth/verify-email/resend`,
                method: "POST",
                secure: true,
                format: "json",
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
                      success?: false;
                      error?: {
                          code?: "INSUFFICIENT_PERMISSIONS";
                          message?: string;
                      };
                  }
                | {
                      success?: false;
                      error?: {
                          code?: "COMPANY_NOT_FOUND";
                          message?: string;
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
                        /** Bitwise permissions for frontend UI optimization */
                        userPermissions: number;
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
                      success?: false;
                      error?: {
                          code?: "INSUFFICIENT_PERMISSIONS";
                          message?: string;
                      };
                  }
                | {
                      success?: false;
                      error?: {
                          code?: "COMPANY_NOT_FOUND";
                          message?: string;
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
                      success?: false;
                      error?: {
                          code?: "INSUFFICIENT_PERMISSIONS";
                          message?: string;
                      };
                  }
                | {
                      success?: false;
                      error?: {
                          code?: "COMPANY_NOT_FOUND";
                          message?: string;
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
                        user?: {
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
                        users: {
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
                        }[];
                        /** @min 0 */
                        total: number;
                        /** @min 1 */
                        page: number;
                        /** @min 1 */
                        limit: number;
                        /** @min 1 */
                        totalPages: number;
                        hasMore: boolean;
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
        getUsersId: (id: string, params: RequestParams = {}) =>
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
            id: string,
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
                /**
                 * @minLength 8
                 * @maxLength 128
                 */
                password?: string;
                /** @format uuid */
                roleId?: string | null;
                isCompanyAdmin?: boolean;
                isActive?: boolean;
                /** @format uri */
                image?: string | null;
                twoFactorEnabled?: boolean;
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
        deleteUsersId: (id: string, params: RequestParams = {}) =>
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
        getUsersIdGroups: (id: string, params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        groups: {
                            /** @format uuid */
                            id: string;
                            name: string;
                            description?: null | string;
                            slug: string;
                            isActive: boolean;
                            /** @min 0 */
                            memberCount: number;
                            status: "active" | "pending" | "suspended";
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
                path: `/users/${id}/groups`,
                method: "GET",
                secure: true,
                format: "json",
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
            id: string,
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
            id: string,
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
        getUsersIdRole: (id: string, params: RequestParams = {}) =>
            this.request<
                {
                    success: true;
                    data: {
                        role: {
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
                method: "GET",
                secure: true,
                format: "json",
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
            id: string,
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
        deleteUsersIdRole: (id: string, params: RequestParams = {}) =>
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
                method: "DELETE",
                secure: true,
                format: "json",
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
        postUsersIdReactivate: (id: string, params: RequestParams = {}) =>
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
        deleteUsersIdGroupsGroupid: (id: string, groupId: string, params: RequestParams = {}) =>
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
                path: `/users/${id}/groups/${groupId}`,
                method: "DELETE",
                secure: true,
                format: "json",
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
            this.request<
                {
                    success: true;
                    data: {
                        documents: {
                            /** @format uuid */
                            id: string;
                            title: string;
                            status: "draft" | "published" | "archived";
                            currentVersion: number;
                            documentType: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                description?: string | null;
                            };
                            createdBy: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                /** @format email */
                                email: string;
                            };
                            /** @format uuid */
                            parentId?: string | null;
                            hasFile: boolean;
                            permissions: {
                                canView?: boolean;
                                canEdit?: boolean;
                                canDelete?: boolean;
                            };
                            /** @format date-time */
                            createdAt: string;
                            /** @format date-time */
                            updatedAt: string;
                        }[];
                        pagination: {
                            page: number;
                            limit: number;
                            total: number;
                            totalPages: number;
                            hasNext: boolean;
                            hasPrev: boolean;
                        };
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
                path: `/documents`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
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
        postDocuments: (
            data: {
                /**
                 * Document title
                 * @minLength 1
                 * @maxLength 500
                 */
                title: string;
                /**
                 * Document description
                 * @maxLength 2000
                 */
                description?: string;
                /** Document content (optional) */
                content?: string | null;
                /**
                 * Document type ID
                 * @format uuid
                 */
                documentTypeId?: string;
                /**
                 * Parent folder ID (optional, null for root level)
                 * @format uuid
                 */
                parentId?: string | null;
                /** Document tags */
                tags?: string[];
                /** Document metadata based on document type schema */
                metadata?: object;
                /**
                 * Document status
                 * @default "draft"
                 */
                status?: "draft" | "published" | "archived";
                /** Document settings */
                settings?: {
                    isPublic?: boolean;
                    allowComments?: boolean;
                    allowDownload?: boolean;
                    allowPrint?: boolean;
                    watermark?: string;
                    /** @format date-time */
                    expiresAt?: string;
                    requireSignature?: boolean;
                    trackViews?: boolean;
                };
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        document: {
                            /** @format uuid */
                            id: string;
                            title: string;
                            content?: string | null;
                            status: "draft" | "published" | "archived";
                            currentVersion: number;
                            /** Filtered metadata based on user permissions */
                            metadata: object;
                            tags: string[];
                            fileInfo?: {
                                originalName?: string;
                                mimeType?: string;
                                size?: number;
                                storageKey?: string;
                                checksum?: string;
                            } | null;
                            documentType: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                description?: string | null;
                            };
                            createdBy: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                /** @format email */
                                email: string;
                            };
                            /** @format uuid */
                            parentId?: string | null;
                            /** @format uuid */
                            companyId: string;
                            /** User permissions for this document */
                            permissions: {
                                canView?: boolean;
                                canEdit?: boolean;
                                canDelete?: boolean;
                                canShare?: boolean;
                                canManagePermissions?: boolean;
                            };
                            /** Bitwise permissions for frontend UI optimization */
                            userPermissions: number;
                            /** @format date-time */
                            createdAt: string;
                            /** @format date-time */
                            updatedAt: string;
                        };
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
                path: `/documents`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
            this.request<
                {
                    success: true;
                    data: {
                        document: {
                            /** @format uuid */
                            id: string;
                            title: string;
                            content?: string | null;
                            status: "draft" | "published" | "archived";
                            currentVersion: number;
                            /** Filtered metadata based on user permissions */
                            metadata: object;
                            tags: string[];
                            fileInfo?: {
                                originalName?: string;
                                mimeType?: string;
                                size?: number;
                                storageKey?: string;
                                checksum?: string;
                            } | null;
                            documentType: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                description?: string | null;
                            };
                            createdBy: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                /** @format email */
                                email: string;
                            };
                            /** @format uuid */
                            parentId?: string | null;
                            /** @format uuid */
                            companyId: string;
                            /** User permissions for this document */
                            permissions: {
                                canView?: boolean;
                                canEdit?: boolean;
                                canDelete?: boolean;
                                canShare?: boolean;
                                canManagePermissions?: boolean;
                            };
                            /** Bitwise permissions for frontend UI optimization */
                            userPermissions: number;
                            /** @format date-time */
                            createdAt: string;
                            /** @format date-time */
                            updatedAt: string;
                        };
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
                path: `/documents/${documentId}`,
                method: "GET",
                secure: true,
                format: "json",
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
            data: {
                /**
                 * Document title
                 * @minLength 1
                 * @maxLength 500
                 */
                title?: string;
                /**
                 * Document description
                 * @maxLength 2000
                 */
                description?: string;
                /** Document content */
                content?: string;
                /**
                 * Document type ID
                 * @format uuid
                 */
                documentTypeId?: string;
                /**
                 * Parent folder ID (null for root level)
                 * @format uuid
                 */
                parentId?: string | null;
                /** Document tags */
                tags?: string[];
                /** Document metadata based on document type schema */
                metadata?: object;
                /** Document status */
                status?: "draft" | "published" | "archived";
                /** Document settings */
                settings?: {
                    isPublic?: boolean;
                    allowComments?: boolean;
                    allowDownload?: boolean;
                    allowPrint?: boolean;
                    watermark?: string;
                    /** @format date-time */
                    expiresAt?: string;
                    requireSignature?: boolean;
                    trackViews?: boolean;
                };
            },
            query?: {
                /** @default false */
                createVersion?: boolean;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        document: {
                            /** @format uuid */
                            id: string;
                            title: string;
                            content?: string | null;
                            status: "draft" | "published" | "archived";
                            currentVersion: number;
                            /** Filtered metadata based on user permissions */
                            metadata: object;
                            tags: string[];
                            fileInfo?: {
                                originalName?: string;
                                mimeType?: string;
                                size?: number;
                                storageKey?: string;
                                checksum?: string;
                            } | null;
                            documentType: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                description?: string | null;
                            };
                            createdBy: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                /** @format email */
                                email: string;
                            };
                            /** @format uuid */
                            parentId?: string | null;
                            /** @format uuid */
                            companyId: string;
                            /** User permissions for this document */
                            permissions: {
                                canView?: boolean;
                                canEdit?: boolean;
                                canDelete?: boolean;
                                canShare?: boolean;
                                canManagePermissions?: boolean;
                            };
                            /** Bitwise permissions for frontend UI optimization */
                            userPermissions: number;
                            /** @format date-time */
                            createdAt: string;
                            /** @format date-time */
                            updatedAt: string;
                        };
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
                path: `/documents/${documentId}`,
                method: "PUT",
                query: query,
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
            this.request<
                {
                    success: true;
                    message: string;
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
                path: `/documents/${documentId}`,
                method: "DELETE",
                query: query,
                secure: true,
                format: "json",
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
        postDocumentsDocumentidLock: (
            documentId: string,
            data: {
                /** Whether to lock or unlock the document */
                lock: boolean;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        /** @format uuid */
                        id: string;
                        title: string;
                        content?: string | null;
                        status: "draft" | "published" | "archived";
                        currentVersion: number;
                        /** Filtered metadata based on user permissions */
                        metadata: object;
                        tags: string[];
                        fileInfo?: {
                            originalName?: string;
                            mimeType?: string;
                            size?: number;
                            storageKey?: string;
                            checksum?: string;
                        } | null;
                        documentType: {
                            /** @format uuid */
                            id: string;
                            name: string;
                            description?: string | null;
                        };
                        createdBy: {
                            /** @format uuid */
                            id: string;
                            name: string;
                            /** @format email */
                            email: string;
                        };
                        /** @format uuid */
                        parentId?: string | null;
                        /** @format uuid */
                        companyId: string;
                        /** User permissions for this document */
                        permissions: {
                            canView?: boolean;
                            canEdit?: boolean;
                            canDelete?: boolean;
                            canShare?: boolean;
                            canManagePermissions?: boolean;
                        };
                        /** Bitwise permissions for frontend UI optimization */
                        userPermissions: number;
                        /** @format date-time */
                        createdAt: string;
                        /** @format date-time */
                        updatedAt: string;
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
                path: `/documents/${documentId}/lock`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
            this.request<
                {
                    success: true;
                    data: {
                        versions: {
                            /** @format uuid */
                            id: string;
                            /** @format uuid */
                            documentId: string;
                            versionNumber: number;
                            content?: string | null;
                            metadata?: object | null;
                            fileInfo?: {
                                originalName?: string;
                                mimeType?: string;
                                size?: number;
                                storageKey?: string;
                                checksum?: string;
                            } | null;
                            changeReason?: string | null;
                            createdBy: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                /** @format email */
                                email: string;
                            };
                            /** @format date-time */
                            createdAt: string;
                            /** @format date-time */
                            updatedAt: string;
                        }[];
                        pagination: {
                            page: number;
                            limit: number;
                            total: number;
                            totalPages: number;
                            hasNext: boolean;
                            hasPrev: boolean;
                        };
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
                path: `/documents/${documentId}/versions`,
                method: "GET",
                secure: true,
                format: "json",
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
            this.request<
                {
                    success: true;
                    data: {
                        children: {
                            /** @format uuid */
                            id: string;
                            title: string;
                            status: "draft" | "published" | "archived";
                            currentVersion: number;
                            documentType: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                description?: string | null;
                            };
                            createdBy: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                /** @format email */
                                email: string;
                            };
                            /** @format uuid */
                            parentId?: string | null;
                            hasFile: boolean;
                            permissions: {
                                canView?: boolean;
                                canEdit?: boolean;
                                canDelete?: boolean;
                            };
                            /** @format date-time */
                            createdAt: string;
                            /** @format date-time */
                            updatedAt: string;
                        }[];
                        parentPath: string;
                        count: number;
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
                path: `/documents/${documentId}/children`,
                method: "GET",
                secure: true,
                format: "json",
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
            this.request<
                {
                    success: true;
                    data: {
                        /** @format uuid */
                        id: string;
                        /** @format uuid */
                        documentId: string;
                        versionNumber: number;
                        content?: string | null;
                        metadata?: object | null;
                        fileInfo?: {
                            originalName?: string;
                            mimeType?: string;
                            size?: number;
                            storageKey?: string;
                            checksum?: string;
                        } | null;
                        changeReason?: string | null;
                        createdBy: {
                            /** @format uuid */
                            id: string;
                            name: string;
                            /** @format email */
                            email: string;
                        };
                        /** @format date-time */
                        createdAt: string;
                        /** @format date-time */
                        updatedAt: string;
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
                path: `/documents/${documentId}/versions/${version}`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
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
                path: `/documents/${documentId}/versions/${version}`,
                method: "DELETE",
                secure: true,
                format: "json",
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
            data: {
                /**
                 * Reason for restoring this version
                 * @maxLength 500
                 */
                changeReason?: string;
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
                        documentId: string;
                        versionNumber: number;
                        content?: string | null;
                        metadata?: object | null;
                        fileInfo?: {
                            originalName?: string;
                            mimeType?: string;
                            size?: number;
                            storageKey?: string;
                            checksum?: string;
                        } | null;
                        changeReason?: string | null;
                        createdBy: {
                            /** @format uuid */
                            id: string;
                            name: string;
                            /** @format email */
                            email: string;
                        };
                        /** @format date-time */
                        createdAt: string;
                        /** @format date-time */
                        updatedAt: string;
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
                path: `/documents/${documentId}/versions/${version}/restore`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
            this.request<
                {
                    success: true;
                    data: {
                        fromVersion: {
                            /** @format uuid */
                            id: string;
                            /** @format uuid */
                            documentId: string;
                            versionNumber: number;
                            content?: string | null;
                            metadata?: object | null;
                            fileInfo?: {
                                originalName?: string;
                                mimeType?: string;
                                size?: number;
                                storageKey?: string;
                                checksum?: string;
                            } | null;
                            changeReason?: string | null;
                            createdBy: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                /** @format email */
                                email: string;
                            };
                            /** @format date-time */
                            createdAt: string;
                            /** @format date-time */
                            updatedAt: string;
                        };
                        toVersion: {
                            /** @format uuid */
                            id: string;
                            /** @format uuid */
                            documentId: string;
                            versionNumber: number;
                            content?: string | null;
                            metadata?: object | null;
                            fileInfo?: {
                                originalName?: string;
                                mimeType?: string;
                                size?: number;
                                storageKey?: string;
                                checksum?: string;
                            } | null;
                            changeReason?: string | null;
                            createdBy: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                /** @format email */
                                email: string;
                            };
                            /** @format date-time */
                            createdAt: string;
                            /** @format date-time */
                            updatedAt: string;
                        };
                        differences: {
                            content?: object[];
                            metadata?: object[];
                        };
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
                path: `/documents/${documentId}/versions/${fromVersion}/compare/${toVersion}`,
                method: "GET",
                secure: true,
                format: "json",
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
            this.request<
                {
                    success: true;
                    data: {
                        totalVersions: number;
                        totalDocuments: number;
                        averageVersionsPerDocument: number;
                        storageUsed: number;
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
                path: `/documents/statistics/versions`,
                method: "GET",
                secure: true,
                format: "json",
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
            this.request<
                {
                    success: true;
                    data: {
                        children: {
                            /** @format uuid */
                            id: string;
                            title: string;
                            status: "draft" | "published" | "archived";
                            currentVersion: number;
                            documentType: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                description?: string | null;
                            };
                            createdBy: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                /** @format email */
                                email: string;
                            };
                            /** @format uuid */
                            parentId?: string | null;
                            hasFile: boolean;
                            permissions: {
                                canView?: boolean;
                                canEdit?: boolean;
                                canDelete?: boolean;
                            };
                            /** @format date-time */
                            createdAt: string;
                            /** @format date-time */
                            updatedAt: string;
                        }[];
                        parentPath: string;
                        count: number;
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
                path: `/documents/children-by-path`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
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
        postDocumentsCopy: (
            data: {
                /**
                 * Array of document IDs to copy
                 * @maxItems 100
                 * @minItems 1
                 */
                documentIds: string[];
                /**
                 * Target folder ID (null for root level)
                 * @format uuid
                 */
                targetFolderId?: string | null;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        copiedDocuments: {
                            /** @format uuid */
                            id: string;
                            title: string;
                            status: "draft" | "published" | "archived";
                            currentVersion: number;
                            documentType: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                description?: string | null;
                            };
                            createdBy: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                /** @format email */
                                email: string;
                            };
                            /** @format uuid */
                            parentId?: string | null;
                            hasFile: boolean;
                            permissions: {
                                canView?: boolean;
                                canEdit?: boolean;
                                canDelete?: boolean;
                            };
                            /** @format date-time */
                            createdAt: string;
                            /** @format date-time */
                            updatedAt: string;
                        }[];
                        count: number;
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
                path: `/documents/copy`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
        postDocumentsMove: (
            data: {
                /**
                 * Array of document IDs to move
                 * @maxItems 100
                 * @minItems 1
                 */
                documentIds: string[];
                /**
                 * Target folder ID (null for root level)
                 * @format uuid
                 */
                targetFolderId?: string | null;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        movedDocuments: {
                            /** @format uuid */
                            id: string;
                            title: string;
                            status: "draft" | "published" | "archived";
                            currentVersion: number;
                            documentType: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                description?: string | null;
                            };
                            createdBy: {
                                /** @format uuid */
                                id: string;
                                name: string;
                                /** @format email */
                                email: string;
                            };
                            /** @format uuid */
                            parentId?: string | null;
                            hasFile: boolean;
                            permissions: {
                                canView?: boolean;
                                canEdit?: boolean;
                                canDelete?: boolean;
                            };
                            /** @format date-time */
                            createdAt: string;
                            /** @format date-time */
                            updatedAt: string;
                        }[];
                        count: number;
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
                path: `/documents/move`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
        postDocumentsTrash: (
            data: {
                /**
                 * Array of document IDs to move to trash
                 * @maxItems 100
                 * @minItems 1
                 */
                documentIds: string[];
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        trashedCount: number;
                        errors: {
                            /** @format uuid */
                            documentId: string;
                            error: string;
                        }[];
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
                path: `/documents/trash`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
        postDocumentsEmptyTrash: (
            data: {
                /**
                 * Array of document IDs to permanently delete (empty array = delete all trash)
                 * @maxItems 100
                 */
                documentIds?: string[];
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        deletedCount: number;
                        errors: {
                            /** @format uuid */
                            documentId: string;
                            error: string;
                        }[];
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
                path: `/documents/empty-trash`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
        postDocumentsRestore: (
            data: {
                /**
                 * Array of document IDs to restore from trash
                 * @maxItems 100
                 * @minItems 1
                 */
                documentIds: string[];
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: true;
                    data: {
                        restoredCount: number;
                        errors: {
                            /** @format uuid */
                            documentId: string;
                            error: string;
                        }[];
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
                path: `/documents/restore`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
                {
                    success: true;
                    data: {
                        items: any[];
                        pagination: {
                            page: number;
                            limit: number;
                            total: number;
                            totalPages: number;
                            hasNext: boolean;
                            hasPrev: boolean;
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
                method: "GET",
                query: query,
                secure: true,
                format: "json",
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
        postAdminDocumentTypes: (
            data: {
                /**
                 * @minLength 1
                 * @maxLength 255
                 */
                name: string;
                /** @maxLength 1000 */
                description?: string;
                /**
                 * @minLength 1
                 * @maxLength 100
                 * @pattern ^[a-z0-9-_]+$
                 */
                slug?: string;
                /** @maxLength 50 */
                icon?: string;
                /** @pattern ^#[0-9a-fA-F]{6}$ */
                color?: string;
                metadataSchema?: {
                    fields: {
                        /** @minLength 1 */
                        id: string;
                        /** @minLength 1 */
                        name: string;
                        type:
                            | "text"
                            | "number"
                            | "date"
                            | "boolean"
                            | "select"
                            | "multiselect"
                            | "url"
                            | "email"
                            | "relation";
                        required: boolean;
                        defaultValue?: any;
                        options?: string[];
                        validation?: {
                            min?: number;
                            max?: number;
                            pattern?: string;
                            message?: string;
                        };
                        rules?: {
                            showFor?: string[];
                            hideFor?: string[];
                            readonlyFor?: string[];
                            maskFor?: string[];
                        };
                        relationConfig?: {
                            targetType?: "document" | "user" | "group";
                            multiple?: boolean;
                            allowedDocumentTypes?: string[];
                        };
                        /** @min 0 */
                        displayOrder?: number;
                    }[];
                };
                settings?: {
                    allowVersioning?: boolean;
                    requireApproval?: boolean;
                    autoArchive?: {
                        enabled: boolean;
                        /** @min 1 */
                        afterDays: number;
                    };
                    permissions?: {
                        defaultViewers?: string[];
                        defaultEditors?: string[];
                    };
                };
                /** @default true */
                isActive?: boolean;
                /** @min 0 */
                displayOrder?: number;
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
                body: data,
                secure: true,
                type: ContentType.Json,
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
                {
                    success: true;
                    data: {
                        /** @min 0 */
                        totalDocumentTypes: number;
                        /** @min 0 */
                        activeDocumentTypes: number;
                        /** @min 0 */
                        inactiveDocumentTypes: number;
                        /** @min 0 */
                        systemDocumentTypes: number;
                        /** @min 0 */
                        customDocumentTypes: number;
                        /** @min 0 */
                        documentTypesWithDocuments: number;
                        /** @min 0 */
                        emptyDocumentTypes: number;
                        /** @min 0 */
                        totalDocuments: number;
                        /** @min 0 */
                        avgDocumentsPerType: number;
                        mostUsedDocumentType: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            /** @min 0 */
                            documentCount?: number;
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
                path: `/admin/document-types/stats`,
                method: "GET",
                secure: true,
                format: "json",
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
                path: `/admin/document-types/${id}`,
                method: "GET",
                secure: true,
                format: "json",
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
        putAdminDocumentTypesId: (
            id: string,
            data: {
                /**
                 * @minLength 1
                 * @maxLength 255
                 */
                name?: string;
                /** @maxLength 1000 */
                description?: string | null;
                /**
                 * @minLength 1
                 * @maxLength 100
                 * @pattern ^[a-z0-9-_]+$
                 */
                slug?: string;
                /** @maxLength 50 */
                icon?: string | null;
                /** @pattern ^#[0-9a-fA-F]{6}$ */
                color?: string | null;
                metadataSchema?: {
                    fields: {
                        /** @minLength 1 */
                        id: string;
                        /** @minLength 1 */
                        name: string;
                        type:
                            | "text"
                            | "number"
                            | "date"
                            | "boolean"
                            | "select"
                            | "multiselect"
                            | "url"
                            | "email"
                            | "relation";
                        required: boolean;
                        defaultValue?: any;
                        options?: string[];
                        validation?: {
                            min?: number;
                            max?: number;
                            pattern?: string;
                            message?: string;
                        };
                        rules?: {
                            showFor?: string[];
                            hideFor?: string[];
                            readonlyFor?: string[];
                            maskFor?: string[];
                        };
                        relationConfig?: {
                            targetType?: "document" | "user" | "group";
                            multiple?: boolean;
                            allowedDocumentTypes?: string[];
                        };
                        /** @min 0 */
                        displayOrder?: number;
                    }[];
                };
                settings?: {
                    allowVersioning?: boolean;
                    requireApproval?: boolean;
                    autoArchive?: {
                        enabled: boolean;
                        /** @min 1 */
                        afterDays: number;
                    };
                    permissions?: {
                        defaultViewers?: string[];
                        defaultEditors?: string[];
                    };
                };
                isActive?: boolean;
                /** @min 0 */
                displayOrder?: number;
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
                path: `/admin/document-types/${id}`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
         * @description Grant can_apply permission for a document type
         *
         * @tags Document Type Permissions
         * @name PostAdminDocumentTypesIdPermissionsGrant
         * @request POST:/admin/document-types/{id}/permissions/grant
         * @secure
         */
        postAdminDocumentTypesIdPermissionsGrant: (
            id: string,
            data: {
                granteeType: "user" | "role" | "group";
                granteeId: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                void,
                {
                    success?: boolean;
                    error?: {
                        code?: string;
                        message?: string;
                    };
                }
            >({
                path: `/admin/document-types/${id}/permissions/grant`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Revoke can_apply permission for a document type
         *
         * @tags Document Type Permissions
         * @name PostAdminDocumentTypesIdPermissionsRevoke
         * @request POST:/admin/document-types/{id}/permissions/revoke
         * @secure
         */
        postAdminDocumentTypesIdPermissionsRevoke: (
            id: string,
            data: {
                granteeType: "user" | "role" | "group";
                granteeId: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<void, any>({
                path: `/admin/document-types/${id}/permissions/revoke`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description List all permissions for a document type
         *
         * @tags Document Type Permissions
         * @name GetAdminDocumentTypesIdPermissions
         * @request GET:/admin/document-types/{id}/permissions
         * @secure
         */
        getAdminDocumentTypesIdPermissions: (id: string, params: RequestParams = {}) =>
            this.request<
                {
                    success?: boolean;
                    data?: {
                        documentTypeId?: string;
                        permissions?: {
                            can_apply?: {
                                id?: string;
                                type?: "user" | "role" | "group";
                                name?: string;
                            }[];
                        };
                    };
                },
                any
            >({
                path: `/admin/document-types/${id}/permissions`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Check if a user can apply a document type
         *
         * @tags Document Type Permissions
         * @name GetAdminDocumentTypesIdPermissionsCheck
         * @request GET:/admin/document-types/{id}/permissions/check
         * @secure
         */
        getAdminDocumentTypesIdPermissionsCheck: (
            id: string,
            query: {
                userId: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success?: boolean;
                    data?: {
                        userId?: string;
                        documentTypeId?: string;
                        canApply?: boolean;
                    };
                },
                any
            >({
                path: `/admin/document-types/${id}/permissions/check`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get all document types the current user can apply
         *
         * @tags Document Type Permissions
         * @name GetAdminDocumentTypesApplicable
         * @request GET:/admin/document-types/applicable
         * @secure
         */
        getAdminDocumentTypesApplicable: (params: RequestParams = {}) =>
            this.request<
                {
                    success?: boolean;
                    data?: {
                        userId?: string;
                        documentTypeIds?: string[];
                    };
                },
                any
            >({
                path: `/admin/document-types/applicable`,
                method: "GET",
                secure: true,
                format: "json",
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
                {
                    success: true;
                    data: {
                        roles: {
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
                        }[];
                        /** @min 0 */
                        total: number;
                        /** @min 1 */
                        page: number;
                        /** @min 1 */
                        limit: number;
                        /** @min 1 */
                        totalPages: number;
                        hasMore: boolean;
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
                method: "GET",
                query: query,
                secure: true,
                format: "json",
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
        postAdminRoles: (
            data: {
                /**
                 * @minLength 1
                 * @maxLength 255
                 */
                name: string;
                /** @maxLength 1000 */
                description?: string;
                /**
                 * @minLength 1
                 * @maxLength 100
                 * @pattern ^[a-z0-9-_]+$
                 */
                slug?: string;
                /** @format uuid */
                parentId?: string;
                /** @uniqueItems true */
                permissions?: (
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
                /** @default true */
                isActive?: boolean;
                /** @pattern ^#[0-9a-fA-F]{6}$ */
                color?: string;
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
                body: data,
                secure: true,
                type: ContentType.Json,
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
                path: `/admin/roles/${id}`,
                method: "GET",
                secure: true,
                format: "json",
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
        putAdminRolesId: (
            id: string,
            data: {
                /**
                 * @minLength 1
                 * @maxLength 255
                 */
                name?: string;
                /** @maxLength 1000 */
                description?: string | null;
                /**
                 * @minLength 1
                 * @maxLength 100
                 * @pattern ^[a-z0-9-_]+$
                 */
                slug?: string;
                /** @format uuid */
                parentId?: string | null;
                /** @uniqueItems true */
                permissions?: (
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
                isActive?: boolean;
                /** @pattern ^#[0-9a-fA-F]{6}$ */
                color?: string | null;
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
                path: `/admin/roles/${id}`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
                path: `/admin/roles/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
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
                {
                    success: true;
                    data: {
                        hierarchy: {
                            /** @format uuid */
                            id: string;
                            name: string;
                            slug: string;
                            /** @min 0 */
                            level: number;
                            permissions: string[];
                            inheritedPermissions?: string[];
                            totalPermissions?: string[];
                            /** @min 0 */
                            userCount: number;
                            isActive: boolean;
                            children: any[];
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
                path: `/admin/roles/hierarchy/tree`,
                method: "GET",
                secure: true,
                format: "json",
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
                {
                    success: true;
                    data: {
                        /** @min 0 */
                        totalRoles: number;
                        /** @min 0 */
                        activeRoles: number;
                        /** @min 0 */
                        inactiveRoles: number;
                        /** @min 0 */
                        systemRoles: number;
                        /** @min 0 */
                        customRoles: number;
                        /** @min 0 */
                        rolesWithUsers: number;
                        /** @min 0 */
                        emptyRoles: number;
                        /** @min 0 */
                        maxLevel: number;
                        /** @min 0 */
                        avgUsersPerRole: number;
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
                path: `/admin/roles/stats`,
                method: "GET",
                secure: true,
                format: "json",
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
                {
                    success: true;
                    data: {
                        groups: {
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
                        }[];
                        /** @min 0 */
                        total: number;
                        /** @min 1 */
                        page: number;
                        /** @min 1 */
                        limit: number;
                        /** @min 1 */
                        totalPages: number;
                        hasMore: boolean;
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
                method: "GET",
                query: query,
                secure: true,
                format: "json",
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
        postAdminGroups: (
            data: {
                /**
                 * @minLength 1
                 * @maxLength 255
                 */
                name: string;
                /** @maxLength 1000 */
                description?: string;
                /**
                 * @minLength 1
                 * @maxLength 100
                 * @pattern ^[a-z0-9-_]+$
                 */
                slug?: string;
                /** @default true */
                isActive?: boolean;
                /** @pattern ^#[0-9a-fA-F]{6}$ */
                color?: string;
                settings?: {
                    /** @default false */
                    allowSelfJoin?: boolean;
                    /** @default true */
                    requireApproval?: boolean;
                    /** @min 1 */
                    maxMembers?: number;
                    /** @default "private" */
                    visibility?: "public" | "private" | "hidden";
                };
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
                body: data,
                secure: true,
                type: ContentType.Json,
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
                path: `/admin/groups/${id}`,
                method: "GET",
                secure: true,
                format: "json",
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
        putAdminGroupsId: (
            id: string,
            data: {
                /**
                 * @minLength 1
                 * @maxLength 255
                 */
                name?: string;
                /** @maxLength 1000 */
                description?: string | null;
                /**
                 * @minLength 1
                 * @maxLength 100
                 * @pattern ^[a-z0-9-_]+$
                 */
                slug?: string;
                isActive?: boolean;
                /** @pattern ^#[0-9a-fA-F]{6}$ */
                color?: string | null;
                settings?: {
                    allowSelfJoin?: boolean;
                    requireApproval?: boolean;
                    /** @min 1 */
                    maxMembers?: number | null;
                    visibility?: "public" | "private" | "hidden";
                };
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
                path: `/admin/groups/${id}`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
                path: `/admin/groups/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
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
                {
                    success: true;
                    data: {
                        groups: {
                            /** @format uuid */
                            id: string;
                            name: string;
                            description?: null | string;
                            slug: string;
                            isActive: boolean;
                            /** @min 0 */
                            memberCount: number;
                            status: "active" | "pending" | "suspended";
                            /** @format date-time */
                            joinedAt: string;
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
                path: `/admin/groups/user/${userId}`,
                method: "GET",
                secure: true,
                format: "json",
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
        postAdminGroupsIdMembers: (
            id: string,
            data: {
                /**
                 * @minItems 1
                 * @uniqueItems true
                 */
                userIds: string[];
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
                path: `/admin/groups/${id}/members`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
        deleteAdminGroupsIdMembers: (
            id: string,
            data: {
                /**
                 * @minItems 1
                 * @uniqueItems true
                 */
                userIds: string[];
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
                path: `/admin/groups/${id}/members`,
                method: "DELETE",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
        putAdminGroupsIdMembersUseridStatus: (
            id: string,
            userId: string,
            data: {
                status: "active" | "pending" | "suspended";
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
                path: `/admin/groups/${id}/members/${userId}/status`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
                {
                    success: true;
                    data: {
                        /** @min 0 */
                        totalGroups: number;
                        /** @min 0 */
                        activeGroups: number;
                        /** @min 0 */
                        inactiveGroups: number;
                        /** @min 0 */
                        publicGroups: number;
                        /** @min 0 */
                        privateGroups: number;
                        /** @min 0 */
                        hiddenGroups: number;
                        /** @min 0 */
                        groupsWithMembers: number;
                        /** @min 0 */
                        emptyGroups: number;
                        /** @min 0 */
                        totalMembers: number;
                        /** @min 0 */
                        avgMembersPerGroup: number;
                        largestGroup: {
                            /** @format uuid */
                            id?: string;
                            name?: string;
                            /** @min 0 */
                            memberCount?: number;
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
                path: `/admin/groups/stats`,
                method: "GET",
                secure: true,
                format: "json",
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
    permissions = {
        /**
         * @description Get permission metadata including base permissions, computed permissions, and presets
         *
         * @tags Permissions
         * @name GetPermissionsPermissionsMetadata
         * @request GET:/permissions/permissions/metadata
         * @secure
         */
        getPermissionsPermissionsMetadata: (params: RequestParams = {}) =>
            this.request<
                {
                    success: boolean;
                    data: {
                        basePermissions: {
                            name: string;
                            description: string;
                            category: "read" | "write" | "manage";
                        }[];
                        computedPermissions: {
                            name: string;
                            description: string;
                            implies: string[];
                        }[];
                        presets: {
                            name: string;
                            description: string;
                            permissions: string[];
                        }[];
                        categories: Record<string, string[]>;
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
                path: `/permissions/permissions/metadata`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Grant a permission to a user, role, or group
         *
         * @tags Permissions
         * @name PostPermissionsPermissionsGrant
         * @request POST:/permissions/permissions/grant
         * @secure
         */
        postPermissionsPermissionsGrant: (
            data: {
                /**
                 * Document ID to grant permission for
                 * @format uuid
                 */
                documentId: string;
                /** Type of entity receiving the permission */
                granteeType: "user" | "role" | "group";
                /**
                 * ID of the user, role, or group
                 * @format uuid
                 */
                granteeId: string;
                /** Permission to grant */
                permission:
                    | "can_view_content"
                    | "can_view_metadata"
                    | "can_view_permissions"
                    | "can_download"
                    | "can_print"
                    | "can_edit_content"
                    | "can_edit_metadata"
                    | "can_share"
                    | "can_create_child"
                    | "can_delete"
                    | "can_manage_permissions"
                    | "can_audit";
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: boolean;
                    message: string;
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
                path: `/permissions/permissions/grant`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Revoke a permission from a user, role, or group
         *
         * @tags Permissions
         * @name PostPermissionsPermissionsRevoke
         * @request POST:/permissions/permissions/revoke
         * @secure
         */
        postPermissionsPermissionsRevoke: (
            data: {
                /**
                 * Document ID to grant permission for
                 * @format uuid
                 */
                documentId: string;
                /** Type of entity receiving the permission */
                granteeType: "user" | "role" | "group";
                /**
                 * ID of the user, role, or group
                 * @format uuid
                 */
                granteeId: string;
                /** Permission to grant */
                permission:
                    | "can_view_content"
                    | "can_view_metadata"
                    | "can_view_permissions"
                    | "can_download"
                    | "can_print"
                    | "can_edit_content"
                    | "can_edit_metadata"
                    | "can_share"
                    | "can_create_child"
                    | "can_delete"
                    | "can_manage_permissions"
                    | "can_audit";
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: boolean;
                    message: string;
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
                path: `/permissions/permissions/revoke`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Grant a permission preset to a user, role, or group
         *
         * @tags Permissions
         * @name PostPermissionsPermissionsGrantPreset
         * @request POST:/permissions/permissions/grant-preset
         * @secure
         */
        postPermissionsPermissionsGrantPreset: (
            data: {
                /**
                 * Document ID to grant preset for
                 * @format uuid
                 */
                documentId: string;
                /** Type of entity receiving the preset */
                granteeType: "user" | "role" | "group";
                /**
                 * ID of the user, role, or group
                 * @format uuid
                 */
                granteeId: string;
                /** Permission preset to grant */
                preset: "owner" | "viewer" | "editor" | "contributor" | "manager";
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: boolean;
                    message: string;
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
                path: `/permissions/permissions/grant-preset`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Revoke a permission preset from a user, role, or group
         *
         * @tags Permissions
         * @name PostPermissionsPermissionsRevokePreset
         * @request POST:/permissions/permissions/revoke-preset
         * @secure
         */
        postPermissionsPermissionsRevokePreset: (
            data: {
                /**
                 * Document ID to grant preset for
                 * @format uuid
                 */
                documentId: string;
                /** Type of entity receiving the preset */
                granteeType: "user" | "role" | "group";
                /**
                 * ID of the user, role, or group
                 * @format uuid
                 */
                granteeId: string;
                /** Permission preset to grant */
                preset: "owner" | "viewer" | "editor" | "contributor" | "manager";
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: boolean;
                    message: string;
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
                path: `/permissions/permissions/revoke-preset`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Check if the current user has a specific permission on a document
         *
         * @tags Permissions
         * @name PostPermissionsPermissionsCheck
         * @request POST:/permissions/permissions/check
         * @secure
         */
        postPermissionsPermissionsCheck: (
            data: {
                /**
                 * Document ID to check permission for
                 * @format uuid
                 */
                documentId: string;
                /** Permission to check */
                permission:
                    | "can_view_content"
                    | "can_view_metadata"
                    | "can_view_permissions"
                    | "can_download"
                    | "can_print"
                    | "can_edit_content"
                    | "can_edit_metadata"
                    | "can_share"
                    | "can_create_child"
                    | "can_delete"
                    | "can_manage_permissions"
                    | "can_audit";
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: boolean;
                    data: {
                        allowed: boolean;
                        permission: string;
                        documentId: string;
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
                path: `/permissions/permissions/check`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Check multiple permissions at once for the current user
         *
         * @tags Permissions
         * @name PostPermissionsPermissionsBatchCheck
         * @request POST:/permissions/permissions/batch-check
         * @secure
         */
        postPermissionsPermissionsBatchCheck: (
            data: {
                /**
                 * @maxItems 100
                 * @minItems 1
                 */
                checks: {
                    /** @format uuid */
                    documentId: string;
                    permission:
                        | "can_view_content"
                        | "can_view_metadata"
                        | "can_view_permissions"
                        | "can_download"
                        | "can_print"
                        | "can_edit_content"
                        | "can_edit_metadata"
                        | "can_share"
                        | "can_create_child"
                        | "can_delete"
                        | "can_manage_permissions"
                        | "can_audit";
                }[];
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: boolean;
                    data: {
                        results: {
                            allowed: boolean;
                            permission: string;
                            documentId: string;
                        }[];
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
                path: `/permissions/permissions/batch-check`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Get all users who have access to a specific document
         *
         * @tags Permissions
         * @name GetPermissionsPermissionsUsersDocumentid
         * @request GET:/permissions/permissions/users/{documentId}
         * @secure
         */
        getPermissionsPermissionsUsersDocumentid: (
            documentId: string,
            query?: {
                permission?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: boolean;
                    data: {
                        users: {
                            userId: string;
                            userName: string;
                            email: string;
                            hasPermission: boolean;
                        }[];
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
                path: `/permissions/permissions/users/${documentId}`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Get a comprehensive permission summary for a document
         *
         * @tags Permissions
         * @name GetPermissionsPermissionsSummaryDocumentid
         * @request GET:/permissions/permissions/summary/{documentId}
         * @secure
         */
        getPermissionsPermissionsSummaryDocumentid: (documentId: string, params: RequestParams = {}) =>
            this.request<
                {
                    success: boolean;
                    data: {
                        documentId: string;
                        owner: string;
                        usersWithAccess: {
                            userId: string;
                            userName: string;
                            permissions: string[];
                            source: string;
                        }[];
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
                path: `/permissions/permissions/summary/${documentId}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Transfer ownership of a document to another user
         *
         * @tags Permissions
         * @name PostPermissionsPermissionsTransferOwnership
         * @request POST:/permissions/permissions/transfer-ownership
         * @secure
         */
        postPermissionsPermissionsTransferOwnership: (
            data: {
                /**
                 * Document ID to transfer ownership of
                 * @format uuid
                 */
                documentId: string;
                /**
                 * ID of the new owner
                 * @format uuid
                 */
                newOwnerId: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: boolean;
                    message: string;
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
                path: `/permissions/permissions/transfer-ownership`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
            this.request<
                {
                    success: boolean;
                    data: {
                        fileId: string;
                        /** @format uuid */
                        documentId: string;
                        filename: string;
                        size: number;
                        mimeType: string;
                        /** @format date-time */
                        uploadedAt: string;
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
                path: `/files/upload`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.FormData,
                format: "json",
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
        postFilesUploadUrl: (
            data: {
                /** @format uuid */
                documentId: string;
                /**
                 * @minLength 1
                 * @maxLength 255
                 */
                filename: string;
                /**
                 * @min 60
                 * @max 86400
                 * @default 3600
                 */
                expirySeconds?: number;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    success: boolean;
                    data: {
                        /** @format uri */
                        uploadUrl: string;
                        fileId: string;
                        /** @format date-time */
                        expiresAt: string;
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
                path: `/files/upload-url`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
            this.request<
                {
                    success: boolean;
                    data: {
                        /** @format uri */
                        downloadUrl: string;
                        filename: string;
                        /** @format date-time */
                        expiresAt: string;
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
                path: `/files/download-url/${storageKey}`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
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
            this.request<
                object,
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
                path: `/collections/collections/${collectionId}/activities`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params,
            }),
    };
}
