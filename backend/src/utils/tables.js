const tables = {
    company: {
        schema: 'company',
        columns: {
            id: 'id',
            company_name: 'company_name',
            quotas: 'quotas',
            registration: 'registration'
        },
    },
    company_permissions: {
        schema: 'company_permissions',
        columns: {
            id: 'id',
            company_id: 'company_id',
            sector_name: 'sector_name',
            data_time: 'data_time',
            autodistribution: 'autodistribution',
            max_att: 'max_att',
            sector_icon: 'sector_icon',
            sector_session: 'sector_session',
            message_init_ticket: 'message_init_ticket',
            message_tranfence: 'message_tranfence',
            message_close_ticket: 'message_close_ticket',
            automation: 'automation',
            token_api: 'token_api',
            token_automation: 'token_automation',
        },
    },
    contacts: {
        schema: 'contacts',
        columns: {
            id: 'id',
            first_name: 'first_name',
            phone_number: 'phone_number',
            email: 'email',
            profile_image: 'profile_image',
            data_time: 'data_time',
            disabled: 'disabled'
        },
    },
    contacts_permissions: {
        schema: 'contacts_permissions',
        columns: {
            user_id: 'user_id',
            sector_id: 'sector_id',
            type: 'type',
            disabled: 'disabled',
            sur_name: 'sur_name'
        },
    },
    users: {
        schema: 'users',
        columns: {
            id: 'id',
            first_name: 'first_name',
            email: 'email',
            password: 'password',
            profile_image: 'profile_image',
            theme: 'theme',
            office: 'office',
            lunch: 'lunch',
            notify: 'notify',
            data_time: 'data_time',
            notify_transfer: 'notify_transfer'
        },
    },
    users_permissions: {
        schema: 'users_permissions',
        columns: {
            user_id: 'user_id',
            sector_id: 'sector_id',
            type: 'type',
            token: 'token',
            disabled: 'disabled',
        },
    },
    defects: {
        schema: 'defects',
        columns: {
            id: 'id',
            name: 'name',
            disabled: 'disabled',
            sector_id: 'sector_id'
        },
    },
    notify: {
        schema: 'notify',
        columns: {
            id: 'id',
            value_description: 'value_description',
            is_visualized: 'is_visualized',
            user_id: 'user_id',
            sender_id: 'sender_id',
            conversation_id: 'conversation_id',
            sector_id: 'sector_id',
            type_scheduled: 'type_scheduled'
        },
    },
    scheduled_messages: {
        schema: 'scheduled_messages',
        columns: {
            id: 'id',
            sector_id: 'sector_id',
            message_value: 'message_value',
            type_scheduled: 'type_scheduled',
            enabled: 'enabled'
        },
    },
    session: {
        schema: 'session',
        columns: {
            id: 'id',
            sector_id: 'sector_id',
            status: 'status',
            session_name: 'session_name',
            updatedat: 'updatedat',
            createdat: 'createdat',
            isdefault: 'isdefault',
            profile_image: 'profile_image',
            pushname: 'pushname'
        },
    },
    whatsapp_sessions: {
        schema: 'whatsapp_sessions',
        columns: {
            id: 'id',
            session: 'session',
            file_data: 'file_data',
            upload_date: 'upload_date'
        },
    },
    time_clock: {
        schema: 'time_clock',
        columns: {
            id: 'id',
            event: 'event',
            date_time: 'date_time',
            sector_id: 'sector_id',
            user_id: 'user_id'
        },
    },
    notes: {
        schema: 'notes',
        columns: {
            id: 'id',
            user_id: 'user_id',
            description: 'description',
            date_time: 'date_time'
        },
    },
    template: {
        schema: 'template',
        columns: {
            id: 'id',
            user_id: 'user_id',
            description: 'description',
            date_time: 'date_time'
        },
    },
    conversation: {
        schema: 'conversation',
        columns: {
            id: 'id',
            user_id: 'user_id',
            motive: 'motive',
            status: 'status',
            description: 'description',
            attendant_id: 'attendant_id',
            sector_id: 'sector_id',
            session_id: 'session_id',
            origin: 'origin',
            viewed: 'viewed',
            last_message: 'last_message',
            blocked: 'blocked',
            stopped: 'stopped',
            data_time: 'data_time',
            data_time_closed: 'data_time_closed',
            data_time_viewed: 'data_time_viewed',
            data_time_stopped: 'data_time_stopped',
            data_time_return: 'data_time_return'
        },
    },
    message: {
        schema: 'message',
        columns: {
            id: 'id',
            message_value: 'message_value',
            data_time: 'data_time',
            conversation_id: 'conversation_id',
            sender_id: 'sender_id',
            sector_id: 'sector_id',
            format: 'format',
            error: 'error',
            type_sender: 'type_sender',
            caption: 'caption',
            id_remote: 'id_remote',
            event: 'event',
            reaction: 'reaction',
        },
    },
    logs: {
        schema: 'logs',
        columns: {
            id: 'id',
            action: 'action',
            decription: 'decription',
            value: 'value',
            user_id: 'user_id',
            first_name: 'first_name',
            sector_id: 'sector_id'
        },
    },
    integrations_sigma_cloud: {
        schema: 'integrations_sigma_cloud',
        columns: {
            id: 'id',
            sector_id: 'sector_id',
            email: 'email',
            password: 'password',
            token: 'token',
            enabled: 'enabled',
            updatedat: 'updatedat',
        },
    },
    integrations_server_email: {
        schema: 'integrations_server_email',
        columns: {
            id: 'id',
            sector_id: 'sector_id',
            email: 'email',
            password: 'password',
            recep_port: 'recep_port',
            recep_host: 'recep_host',
            send_host: 'send_host',
            send_port: 'send_port',
            enabled: 'enabled',
            updatedat: 'updatedat',
        },
    },
    news: {
        schema: 'news',
        columns: {
            id: 'id',
            title: 'title',
            description: 'description',
            status: 'status',
            updatedat: 'updatedat',
            createdat: 'createdat',
            enabled: 'enabled'
        },
    },
    roles: {
        schema: 'roles',
        columns: {
            id: 'id',
            description: 'description',
            sector_id: 'sector_id',
            color: 'color',
            enabled: 'enabled'
        },
    },
    roles_permissions: {
        schema: 'roles_permissions',
        columns: {
            id: 'id',
            user_id: 'user_id',
            session_id: 'session_id',
            sector_id: 'sector_id',
            role_id: 'role_id'
        },
    },
    automation_stages: {
        schema: 'automation_stages',
        columns: {
            id: 'id',
            stage: 'stage',
            sector_id: 'sector_id',
            text: 'text',
            type: 'type',
            option: 'option',
            nextstage: 'nextstage',
        },
    },
    automation_conversations: {
        schema: 'automation_conversations',
        columns: {
            id: 'id',
            phone_number: 'phone_number',
            stage: 'stage',
            awaitingresponse: 'awaitingresponse',
            sector_id: 'sector_id'
        },
    },
    automation_types: {
        schema: 'automation_types',
        columns: {
            id: 'id',
            type: 'type',
        },
    },
    ready_message: {
        schema: 'ready_message',
        columns: {
            id: 'id',
            user_id: 'user_id',
            description: 'description',
            date_time: 'date_time'
        },
    },
    favorites: {
        schema: 'favorites',
        columns: {
            id: 'id',
            user_id: 'user_id',
            contact_id: 'contact_id',
            sector_id: 'sector_id'
        },
    },
};

export default tables;