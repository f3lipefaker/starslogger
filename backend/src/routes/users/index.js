import { Router } from 'express';
import { pool, jwt } from '../../../server.js';
import db from '../../functions/db.js';
import tables from '../../utils/tables.js';

const version = '/api/v1/:sector_id'
const router = Router();
const SCHEMA = process.env.SCHEMA;

//GET
router.get(version + '/users', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id } = req.params;

        const getContactsQuery = `SELECT up.*, u.* FROM "${SCHEMA}".users_permissions AS up JOIN "${SCHEMA}".users AS u ON up.user_id = u.id WHERE up.sector_id = $1 AND up.disabled = $2;`;
        const getContactsValues = [sector_id, false];
        const getContactsResult = await pool.query(getContactsQuery, getContactsValues);

        if (!getContactsResult || getContactsResult.rows.length > 0) {
            return res.status(200).json(getContactsResult.rows);
        } else {
            return res.status(400).json({ error: 'Sem dados' });
        }

    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get(version + '/contacts', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id } = req.params;

        const getUsersQuery = `SELECT up.*, u.* FROM "${SCHEMA}".contacts_permissions AS up JOIN "${SCHEMA}".contacts AS u ON up.user_id = u.id WHERE up.sector_id = $1 AND up.disabled = $2;`;
        const getUsersValues = [sector_id, false];
        const getUsersResult = await pool.query(getUsersQuery, getUsersValues);

        if (!getUsersResult || getUsersResult.rows.length > 0) {
            return res.status(200).json(getUsersResult.rows);
        } else {
            return res.status(400).json({ error: 'Sem dados' });
        }

    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get(version + '/users/:user_id', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id, user_id } = req.params;

        const getUsersQuery = `
            SELECT u.id, up.sector_id, up.type, u.first_name, u.profile_image, u.notify, u.notify_transfer, u.lunch, u.office, u.theme, u.email
            FROM "${SCHEMA}".users_permissions AS up 
            JOIN "${SCHEMA}".users AS u 
            ON up.user_id = u.id 
            WHERE up.user_id = $1 AND up.sector_id = $2 AND up.disabled = $3
        `;
        const getUsersValues = [parseInt(user_id), parseInt(sector_id), false];
        const getUsersResult = await pool.query(getUsersQuery, getUsersValues);

        if (!getUsersResult || getUsersResult.rows.length > 0) {
            return res.status(200).json(getUsersResult.rows);
        } else {
            return res.status(400).json({ error: 'Sem dados' });
        }

    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get(version + '/contacts/:user_id', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id, user_id } = req.params;

        const contactQuery = `SELECT up.*, u.* FROM "${SCHEMA}".contacts_permissions AS up JOIN "${SCHEMA}".contacts AS u ON up.user_id = u.id WHERE up.user_id = $1 AND sector_id = $2 AND up.disabled = $3;`;
        const contactValues = [parseInt(user_id), parseInt(sector_id), false];
        const contactResult = await pool.query(contactQuery, contactValues);

        if (!contactResult || contactResult.rows.length > 0) {
            return res.status(200).json(contactResult.rows);
        } else {
            return res.status(400).json({ error: 'Sem dados' });
        }

    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


//POST
router.post(version + '/users', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id } = req.params
        const { status, office, lunch } = req.body;

        const getUsersQuery = `SELECT up.type, u.id, u.office, u.lunch, u.first_name FROM "${SCHEMA}".users_permissions AS up JOIN "${SCHEMA}".users AS u ON up.user_id = u.id WHERE up.sector_id = $1 AND up.disabled = $2 AND (up.type = 'operator' OR up.type = 'manager') AND u.office = $3 AND u.lunch = $4`;
        const getUsersValues = [sector_id, status, office, lunch];
        const getUsersResult = await pool.query(getUsersQuery, getUsersValues);

        return res.status(200).json(getUsersResult.rows);

    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);
        return res.status(400).json({ error: 'Erro ao processar' });
    }
});

router.post(version + '/users/create', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id } = req.params
        const { sectorId = sector_id, first_name = "N/A", email, profile_image = null, theme = false, password, type = "user" } = req.body;;

        const usersResult = await db.SELECT(tables.users.schema,
            {
                [tables.users.columns.email]: email,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));


        if (!usersResult || usersResult.length === 0) {

            const insertUserResult = await db.INSERT(tables.users.schema,
                {
                    [tables.users.columns.first_name]: first_name,
                    [tables.users.columns.password]: password,
                    [tables.users.columns.profile_image]: profile_image,
                    [tables.users.columns.theme]: theme,
                    [tables.users.columns.email]: email,

                })
                // .then(result => console.log(result))
                .catch(error => console.error(error));

            const user_id = insertUserResult.id

            await db.INSERT(tables.users_permissions.schema,
                {
                    [tables.users_permissions.columns.user_id]: user_id,
                    [tables.users_permissions.columns.sector_id]: sectorId,
                    [tables.users_permissions.columns.type]: type,
                    [tables.users_permissions.columns.disabled]: false,
                })
                // .then(result => console.log(result))
                .catch(error => console.error(error));

            const getCompanyPermissionsResult = await db.SELECT(tables.company_permissions.schema,
                {
                    [tables.company_permissions.columns.id]: sector_id,
                })
                // .then(result => console.log(result))
                .catch(error => console.error(error));

            const getCompanyResult = await db.SELECT(tables.company.schema,
                {
                    [tables.company.columns.id]: getCompanyPermissionsResult[0].company_id,
                })
                // .then(result => console.log(result))
                .catch(error => console.error(error));


            // Gerar token JWT
            const payload = {
                id: user_id,
                first_name: first_name,
                email: email,
                profile_image: profile_image,
                theme: theme,
                company_name: getCompanyResult[0].company_name,
                sector_id: sectorId,
                type: type,
            };

            const token = jwt.sign({ data: payload }, 'FelipeBorges');

            await db.UPDATE(tables.users_permissions.schema,
                {
                    [tables.users_permissions.columns.token]: token,
                },
                {
                    [tables.users_permissions.columns.sector_id]: sectorId,
                    [tables.users_permissions.columns.user_id]: user_id,
                })
                // .then(result => console.log(result))
                .catch(error => console.error(error));

            return res.status(201).json("Usuario Criado");

        } else {

            const user_id = usersResult[0].id

            const usersPermissionsResult = await db.SELECT(tables.users_permissions.schema,
                {
                    [tables.users_permissions.columns.user_id]: user_id,
                    [tables.users_permissions.columns.sector_id]: sectorId,
                })
                // .then(result => console.log(result))
                .catch(error => console.error(error));


            if (!usersPermissionsResult || usersPermissionsResult.length === 0) {

                await db.INSERT(tables.users_permissions.schema,
                    {
                        [tables.users_permissions.columns.user_id]: user_id,
                        [tables.users_permissions.columns.sector_id]: sectorId,
                        [tables.users_permissions.columns.type]: type,
                        [tables.users_permissions.columns.disabled]: false,
                    })
                    // .then(result => console.log(result))
                    .catch(error => console.error(error));

                const getCompanyPermissionsResult = await db.SELECT(tables.company_permissions.schema,
                    {
                        [tables.company_permissions.columns.id]: sector_id,
                    })
                    // .then(result => console.log(result))
                    .catch(error => console.error(error));

                const getCompanyResult = await db.SELECT(tables.company.schema,
                    {
                        [tables.company.columns.id]: getCompanyPermissionsResult[0].company_id,
                    })
                    // .then(result => console.log(result))
                    .catch(error => console.error(error));


                // Gerar token JWT
                const payload = {
                    id: user_id,
                    first_name: first_name,
                    email: email,
                    profile_image: profile_image,
                    theme: theme,
                    company_name: getCompanyResult[0].company_name,
                    sector_id: sectorId,
                    type: type,
                };

                const token = jwt.sign({ data: payload }, 'FelipeBorges');

                await db.UPDATE(tables.users_permissions.schema,
                    {
                        [tables.users_permissions.columns.token]: token,
                    },
                    {
                        [tables.users_permissions.columns.sector_id]: sectorId,
                        [tables.users_permissions.columns.user_id]: user_id,
                    })
                    // .then(result => console.log(result))
                    .catch(error => console.error(error));

                return res.status(201).json("Usuario Criado");

            } else {

                await db.UPDATE(tables.users_permissions.schema,
                    {
                        [tables.users_permissions.columns.disabled]: false,
                    },
                    {
                        [tables.users_permissions.columns.sector_id]: sectorId,
                        [tables.users_permissions.columns.user_id]: user_id,
                    })
                    // .then(result => console.log(result))
                    .catch(error => console.error(error));

                return res.status(201).json("Usuario já cadastrado");
            }

        }

    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);

        if (error.code === "23505") {
            return res.status(409).json(error.detail);
        } else {
            return res.status(404).json(error);
        }
    }
});

router.post(version + '/contacts/create', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id } = req.params;
        const { sectorId = sector_id, phone_number, sur_name, email = null, type = "user" } = req.body;

        const rawNumber = String(phone_number);
        const cleanedNumber = rawNumber.replace(/\D/g, '');

        let formattedNumber;

        if (cleanedNumber.length === 11) {
            if (cleanedNumber[2] === '9') {
                formattedNumber = `55${cleanedNumber.substring(0, 2)}${cleanedNumber.substring(3)}`;
            } else {
                formattedNumber = `55${cleanedNumber}`;
            }
        } else if (cleanedNumber.length === 10) {
            formattedNumber = `55${cleanedNumber}`;
        } else {
            console.error('Número de telefone inválido');
            return res.status(400).json({ error: 'Número de telefone inválido' });
        }

        const Phone = `${formattedNumber}@c.us`;

        const contactResult = await db.SELECT(tables.contacts.schema, {
            [tables.contacts.columns.phone_number]: Phone,
        }).catch(error => {
            console.error('Erro ao buscar contato:', error);
            return null;
        });

        if (!contactResult || contactResult.length === 0) {
            const insertUserResult = await db.INSERT(tables.contacts.schema, {
                [tables.contacts.columns.phone_number]: Phone,
                [tables.contacts.columns.first_name]: sur_name,
                [tables.contacts.columns.email]: email,
            }).catch(error => {
                console.error('Erro ao inserir contato:', error);
                return null;
            });

            if (!insertUserResult || !insertUserResult.id) {
                console.error('Falha ao inserir usuário, resultado inesperado:', insertUserResult);
                return res.status(500).json({ error: 'Falha ao criar o usuário' });
            }

            const user_id = insertUserResult.id;

            await db.INSERT(tables.contacts_permissions.schema, {
                [tables.contacts_permissions.columns.user_id]: user_id,
                [tables.contacts_permissions.columns.sector_id]: sectorId,
                [tables.contacts_permissions.columns.sur_name]: sur_name,
                [tables.contacts_permissions.columns.type]: type,
                [tables.contacts_permissions.columns.disabled]: false,
            }).catch(error => {
                console.error('Erro ao inserir permissões de contato:', error);
                return res.status(500).json({ error: 'Falha ao criar permissões de usuário' });
            });

            return res.status(201).json({ user_id: user_id, message: "Usuário criado" });

        } else {
            const user_id = contactResult[0].id;

            const contactPermissionResult = await db.SELECT(tables.contacts_permissions.schema, {
                [tables.contacts_permissions.columns.user_id]: user_id,
                [tables.contacts_permissions.columns.sector_id]: sectorId,
            }).catch(error => {
                console.error('Erro ao buscar permissões de contato:', error);
                return null;
            });

            if (!contactPermissionResult || contactPermissionResult.length === 0) {
                await db.INSERT(tables.contacts_permissions.schema, {
                    [tables.contacts_permissions.columns.user_id]: user_id,
                    [tables.contacts_permissions.columns.sector_id]: sectorId,
                    [tables.contacts_permissions.columns.sur_name]: sur_name,
                    [tables.contacts_permissions.columns.type]: type,
                    [tables.contacts_permissions.columns.disabled]: false,
                }).catch(error => {
                    console.error('Erro ao inserir novas permissões de contato:', error);
                    return res.status(500).json({ error: 'Falha ao criar permissões de usuário' });
                });
            } else {
                await db.UPDATE(tables.contacts_permissions.schema, {
                    [tables.contacts_permissions.columns.disabled]: false,
                    [tables.contacts_permissions.columns.user_id]: user_id,
                    [tables.contacts_permissions.columns.sector_id]: sector_id,
                }).catch(error => {
                    console.error('Erro ao atualizar permissões de contato:', error);
                    return res.status(500).json({ error: 'Falha ao atualizar permissões de usuário' });
                });

                return res.status(400).json({ user_id: user_id, message: "Usuário já existe" });
            }
        }

    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);

        if (error.code === "23505") {
            return res.status(409).json({ error: 'Conflito: Chave duplicada' });
        } else {
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
});

//PUT

router.put(version + '/users/disabled/:user_id', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id, user_id } = req.params

        await db.UPDATE(tables.users_permissions.schema,
            {
                [tables.users_permissions.columns.disabled]: true,
            },
            {
                [tables.users_permissions.columns.user_id]: user_id,
                [tables.users_permissions.columns.sector_id]: sector_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        return res.status(200).json('Excluido Usuario');
    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);

        return res.status(498).json({ error: 'Não há token' });
    }
});

router.put(version + '/contacts/disabled/:user_id', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id, user_id } = req.params


        await db.UPDATE(tables.contacts_permissions.schema,
            {
                [tables.contacts_permissions.columns.disabled]: true,
            },
            {
                [tables.contacts_permissions.columns.user_id]: user_id,
                [tables.contacts_permissions.columns.sector_id]: sector_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        return res.status(200).json('Excluido Usuario');
    } catch (error) {
        return res.status(498).json({ error: 'Não há token' });
    }
});

router.put(version + '/users/edit', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id } = req.params;
        const { user_id, first_name, profile_image = null, email, password, type } = req.body;

        const UpdateUserResult = await db.UPDATE(tables.users.schema,
            {
                [tables.users.columns.first_name]: first_name,
                [tables.users.columns.email]: email,
                [tables.users.columns.password]: password,
            },
            {
                [tables.users.columns.id]: user_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        const UpdateUserPermissionResult = await db.UPDATE(tables.users_permissions.schema,
            {
                [tables.users_permissions.columns.type]: type,
            },
            {
                [tables.users_permissions.columns.user_id]: user_id,
                [tables.users_permissions.columns.sector_id]: sector_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        const getCompanyPermissionsResult = await db.SELECT(tables.company_permissions.schema,
            {
                [tables.company_permissions.columns.id]: sector_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        const getCompanyResult = await db.SELECT(tables.company.schema,
            {
                [tables.company.columns.id]: getCompanyPermissionsResult[0].company_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        // Gerar token JWT
        const payload = {
            id: user_id,
            first_name: first_name,
            email: email,
            profile_image: profile_image,
            theme: UpdateUserResult.theme,
            company_name: getCompanyResult[0].company_name,
            sector_id: sector_id,
            type: UpdateUserPermissionResult.type,
        };

        const token = jwt.sign({ data: payload }, 'FelipeBorges');


        const updateUserResult = await db.UPDATE(tables.users_permissions.schema,
            {
                [tables.users_permissions.columns.token]: token,
            },
            {
                [tables.users_permissions.columns.user_id]: user_id,
                [tables.users_permissions.columns.sector_id]: sector_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        return res.status(200).json(updateUserResult);
    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);

        if (error.code === "23505") {
            return res.status(409).json(error.detail);
        } else {
            return res.status(404).json(error.detail);
        }
    }
});

router.put(version + '/contacts/edit', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id } = req.params;
        const { user_id, sur_name, phone_number, email, profile_image } = req.body;

        await db.UPDATE(tables.contacts_permissions.schema,
            {
                [tables.contacts_permissions.columns.sur_name]: sur_name,
            },
            {
                [tables.contacts_permissions.columns.user_id]: user_id,
                [tables.contacts_permissions.columns.sector_id]: sector_id,
            })

        await db.UPDATE(tables.contacts.schema,
            {
                [tables.contacts.columns.phone_number]: phone_number,
                [tables.contacts.columns.email]: email,
            },
            {
                [tables.contacts.columns.id]: user_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        return res.status(200).json('Atualizado Contato');
    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);

        if (error.code === "23505") {
            return res.status(409).json(error.detail);
        } else {
            return res.status(404).json(error.detail);
        }
    }
});


export default router;
