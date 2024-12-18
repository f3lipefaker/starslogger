import { Router } from 'express';
import { pool, io } from '../../../server.js';
import verfy from '../../functions/authorization.js';
import db from '../../functions/slq.js';
import tables from '../../db/tables.js';

const router = Router();
const version = '/api/v1/:sector_id'

//GET
router.get(version + '/theme', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id } = req.params;

        const verfytoken = await verfy.verifyToken(authorization, sector_id);
        if (verfytoken.error) {
            console.error('Erro de verificar token', req.url, verfytoken.error);
            return res.status(401).json({ error: 'Não autorizado' });
        }

        const token_authorization = authorization.replace('Bearer ', '');

        const getTokenResult = await db.SELECT(tables.users_permissions.schema,
            {
                [tables.users_permissions.columns.token]: token_authorization,
                [tables.users_permissions.columns.disabled]: false,
                [tables.users_permissions.columns.sector_id]: sector_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));


        const getUserResult = await db.SELECT(tables.users.schema,
            {
                [tables.users.columns.id]: getTokenResult[0].user_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        return res.status(200).json(getUserResult[0].theme);

    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);
        return res.status(400).json({ error: 'Erro ao processar a solicitação' });
    }
});

//PUT

router.put(version + '/theme/set', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id } = req.params;
        const { theme } = req.body;

        const verfytoken = await verfy.verifyToken(authorization, sector_id);
        if (verfytoken.error) {
            console.error('Erro de verificar token', req.url, verfytoken.error);
            return res.status(401).json({ error: 'Não autorizado' });
        }

        const token_authorization = authorization.replace('Bearer ', '');

        const getTokenResult = await db.SELECT(tables.users_permissions.schema,
            {
                [tables.users_permissions.columns.token]: token_authorization,
                [tables.users_permissions.columns.disabled]: false,
                [tables.users_permissions.columns.sector_id]: sector_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        const UpdateUserResult = await db.UPDATE(tables.users.schema,
            {
                [tables.users.columns.theme]: theme,
            },
            {
                [tables.users.columns.id]: getTokenResult[0].user_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        return res.status(200).json(UpdateUserResult.theme);
    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);

        if (error.code === "23505") {
            return res.status(409).json(error.detail);
        } else {
            return res.status(404).json(error.detail);
        }
    }
});
router.put(version + '/office', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id } = req.params;
        const { user_id, office } = req.body;

        const verfytoken = await verfy.verifyToken(authorization, sector_id);
        if (verfytoken.error) {
            console.error('Erro de verificar token', req.url, verfytoken.error);
            return res.status(401).json({ error: 'Não autorizado' });
        }

        let event;

        if (office === true) {
            event = 'Inicio Expediente'
        } else {
            event = 'Fim Expediente'
        }

        await db.UPDATE(tables.users.schema,
            {
                [tables.users.columns.office]: office,
            },
            {
                [tables.users.columns.id]: user_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        await db.UPDATE(tables.conversation.schema,
            {
                [tables.conversation.columns.attendant_id]: 0,
            },
            {
                [tables.conversation.columns.attendant_id]: user_id,
                [tables.conversation.columns.blocked]: true,
                [tables.conversation.columns.sector_id]: sector_id,
                [tables.conversation.columns.stopped]: false,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));


        await db.INSERT(tables.time_clock.schema,
            {
                [tables.time_clock.columns.user_id]: user_id,
                [tables.time_clock.columns.event]: event,
                [tables.time_clock.columns.sector_id]: sector_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        io.emit('users', sector_id);

        return res.status(200).json('Atualizado Expediente');

    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);
        return res.status(400).json({ error: 'Não há token' });
    }
});
router.put(version + '/lunch', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { sector_id } = req.params;
        const { user_id, lunch } = req.body;

        const verfytoken = await verfy.verifyToken(authorization, sector_id);
        if (verfytoken.error) {
            console.error('Erro de verificar token', req.url, verfytoken.error);
            return res.status(401).json({ error: 'Não autorizado' });
        }


        let event;

        if (lunch === true) {
            event = 'Inicio Almoço'
        } else {
            event = 'Fim Almoço'
        };

        await db.UPDATE(tables.users.schema,
            {
                [tables.users.columns.lunch]: lunch,
            },
            {
                [tables.users.columns.id]: user_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        await db.UPDATE(tables.conversation.schema,
            {
                [tables.conversation.columns.attendant_id]: 0,
            },
            {
                [tables.conversation.columns.attendant_id]: user_id,
                [tables.conversation.columns.blocked]: true,
                [tables.conversation.columns.sector_id]: sector_id,
                [tables.conversation.columns.stopped]: false,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));


        await db.INSERT(tables.time_clock.schema,
            {
                [tables.time_clock.columns.user_id]: user_id,
                [tables.time_clock.columns.event]: event,
                [tables.time_clock.columns.sector_id]: sector_id,
            })
            // .then(result => console.log(result))
            .catch(error => console.error(error));

        io.emit('users', sector_id);

        return res.status(200).json('Atualizado Almoço');

    } catch (error) {
        console.error('Erro detectado: ', error, 'Rota: ', req.url);
        return res.status(400).json({ error: 'Não há token' });
    }
});

export default router;