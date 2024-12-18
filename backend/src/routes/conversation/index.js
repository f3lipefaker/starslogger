import { Router } from 'express';
import {pool } from '../../../server.js';
import db from '../../functions/db.js';
import tables from '../../utils/tables.js';

const router = Router();
const version = '/api/v1/:sector_id'
const SCHEMA = process.env.SCHEMA;

// //GET

// router.get(version + '/conversation/:conversation_id', async (req, res) => {
//     try {
//         const { authorization } = req.headers;
//         const { sector_id, conversation_id } = req.params;


//         const conversationResult = await db.SELECT(tables.conversation.schema, { [tables.conversation.columns.sector_id]: sector_id, [tables.conversation.columns.id]: conversation_id })
//         if (conversationResult.error) {
//             console.error(conversationResult.error);
//             return res.status(400).json(conversationResult.error);
//         };

//         if (!conversationResult || conversationResult.length === 0) {
//             return res.status(204).json({ error: 'Nenhuma conversa encontrada' });
//         }

//         const formattedData = [];

//         for (const notification of conversationResult) {
//             const user_id = notification.user_id;

//             const contactQuery = `SELECT up.*, u.* FROM "${SCHEMA}".contacts_permissions AS up JOIN "${SCHEMA}".contacts AS u ON up.user_id = u.id WHERE up.user_id = $1 AND up.disabled = $2;`;
//             const contactValues = [user_id, false];
//             const contactResult = await pool.query(contactQuery, contactValues);

//             if (!contactResult || contactResult.length === 0) {
//                 return res.status(404).json({ error: 'Detalhes do usuário não encontrados' });
//             };

//             const formattedNotification = {
//                 id: contactResult.rows[0].id,
//                 sur_name: contactResult.rows[0].sur_name,
//                 phone_number: contactResult.rows[0].phone_number,
//                 profile_image: contactResult.rows[0].profile_image,

//                 conversation_id: notification.id,
//                 motive: notification.motive,
//                 description: notification.description,
//                 attendant_id: notification.attendant_id,

//                 origin: notification.origin,
//                 status: notification.status,
//                 viewed: notification.viewed,
//                 blocked: notification.blocked,
//                 stopped: notification.stopped,

//                 last_message: notification.last_message,

//                 data_time: notification.data_time,
//                 data_time_closed: notification.data_time,
//                 data_time_stopped: notification.data_time,
//                 data_time_return: notification.data_time,
//             };

//             formattedData.push(formattedNotification);
//         }

//         return res.status(200).json(formattedData);

//     } catch (error) {
//         console.error('Erro detectado: ', error, 'Rota: ', req.url);
//         return res.status(400).json({ error: 'Erro ao processar a solicitação' });
//     }
// });

// router.get(version + '/conversation/browseAll/view/:type', async (req, res) => {
//     try {
//         const { authorization } = req.headers;
//         const { sector_id, type } = req.params;


//         let getNotifyResult;

//         if (type === 'open') {

//             getNotifyResult = await db.SELECT(tables.conversation.schema, { [tables.conversation.columns.sector_id]: sector_id, [tables.conversation.columns.status]: false })
//             if (getNotifyResult.error) {
//                 console.error(getNotifyResult.error);
//                 return res.status(400).json(getNotifyResult.error);
//             };

//             if (!getNotifyResult || getNotifyResult.length === 0) {
//                 return res.status(404).json({ error: 'Nenhuma conversa encontrada' });
//             };

//         } else if (type === 'closed') {

//             getNotifyResult = await db.SELECT(tables.conversation.schema, { [tables.conversation.columns.sector_id]: sector_id, [tables.conversation.columns.status]: true })
//             if (getNotifyResult.error) {
//                 console.error(getNotifyResult.error);
//                 return res.status(400).json(getNotifyResult.error);
//             };

//             if (!getNotifyResult || getNotifyResult.length === 0) {
//                 return res.status(404).json({ error: 'Nenhuma conversa encontrada' });
//             };

//         } else {

//             getNotifyResult = await db.SELECT(tables.conversation.schema, { [tables.conversation.columns.sector_id]: sector_id })
//             if (getNotifyResult.error) {
//                 console.error(getNotifyResult.error);
//                 return res.status(400).json(getNotifyResult.error);
//             };

//             if (!getNotifyResult || getNotifyResult.length === 0) {
//                 return res.status(404).json({ error: 'Nenhuma conversa encontrada' });
//             };
//         };

//         const formattedData = [];

//         for (const notification of getNotifyResult) {
//             const user_id = notification.user_id;

//             const contactQuery = `SELECT up.*, u.* FROM "${SCHEMA}".contacts_permissions AS up JOIN "${SCHEMA}".contacts AS u ON up.user_id = u.id WHERE up.user_id = $1 AND up.disabled = $2;`;
//             const contactValues = [user_id, false];
//             const contactResult = await pool.query(contactQuery, contactValues);

//             let attendant_name, attendant_profile_image;

//             if (notification.attendant_id === 0) {

//                 attendant_name = null;
//                 attendant_profile_image = null;

//             } else {

//                 const userAttendantResult = await db.SELECT(tables.users.schema, { [tables.users.columns.id]: notification.attendant_id })
//                 if (userAttendantResult.error) {
//                     console.error(userAttendantResult.error);
//                     return res.status(400).json(userAttendantResult.error);
//                 };

//                 attendant_name = userAttendantResult[0].first_name;
//                 attendant_profile_image = userAttendantResult[0].profile_image;
//             };

//             if (!contactResult || contactResult.length === 0) {
//                 return res.status(404).json({ error: 'Detalhes do usuário não encontrados' });
//             };

//             const formattedNotification = {
//                 id: contactResult.rows[0].id,
//                 sur_name: contactResult.rows[0].sur_name,
//                 phone_number: contactResult.rows[0].phone_number,
//                 profile_image: contactResult.rows[0].profile_image,

//                 conversation_id: notification.id,
//                 motive: notification.motive,
//                 description: notification.description,
//                 attendant_id: notification.attendant_id,
//                 attendant_name: attendant_name,
//                 attendant_profile_image: attendant_profile_image,


//                 origin: notification.origin,
//                 status: notification.status,
//                 viewed: notification.viewed,
//                 blocked: notification.blocked,
//                 stopped: notification.stopped,

//                 last_message: notification.last_message,

//                 data_time: notification.data_time,
//                 data_time_closed: notification.data_time_closed, // Usar valores corretos se disponíveis
//                 data_time_stopped: notification.data_time_stopped, // Usar valores corretos se disponíveis
//                 data_time_return: notification.data_time_return // Usar valores corretos se disponíveis
//             };

//             formattedData.push(formattedNotification);
//         }

//         return res.status(200).json(formattedData);

//     } catch (error) {
//         console.error('Erro detectado: ', error, 'Rota: ', req.url);
//         return res.status(300).json({ error: 'Erro ao processar a solicitação' });
//     }
// });

// router.get(version + '/conversation/all/:status', async (req, res) => {
//     try {
//         const { authorization } = req.headers;
//         const { sector_id, status } = req.params;
// ;

//         const conversationResult = await db.SELECT(tables.conversation.schema, { [tables.conversation.columns.sector_id]: sector_id, [tables.conversation.columns.status]: status })
//         if (conversationResult.error) {
//             console.error(conversationResult.error);
//             return res.status(400).json(conversationResult.error);
//         };

//         if (!conversationResult || conversationResult.length === 0) {
//             return res.status(204).json({ error: 'Nenhuma conversa encontrada' });
//         };

//         const formattedData = [];

//         for (const notification of conversationResult) {
//             const user_id = notification.user_id;

//             const contactQuery = `SELECT up.*, u.* FROM "${SCHEMA}".contacts_permissions AS up JOIN "${SCHEMA}".contacts AS u ON up.user_id = u.id WHERE up.user_id = $1 AND up.disabled = $2;`;
//             const contactValues = [user_id, false];
//             const contactResult = await pool.query(contactQuery, contactValues);

//             if (!contactResult || contactResult.rows.length === 0) {
//                 return res.status(404).json({ error: 'Detalhes do usuário não encontrados' });
//             };

//             const formattedNotification = {
//                 id: contactResult.rows[0].user_id,
//                 sur_name: contactResult.rows[0].sur_name,
//                 phone_number: contactResult.rows[0].phone_number,
//                 profile_image: contactResult.rows[0].profile_image,

//                 conversation_id: notification.id,
//                 motive: notification.motive,
//                 description: notification.description,
//                 attendant_id: notification.attendant_id,

//                 origin: notification.origin,
//                 status: notification.status,
//                 viewed: notification.viewed,
//                 blocked: notification.blocked,
//                 stopped: notification.stopped,

//                 last_message: notification.last_message,
//                 session_id: notification.session_id,

//                 data_time: notification.data_time,
//                 data_time_closed: notification.data_time,
//                 data_time_stopped: notification.data_time,
//                 data_time_return: notification.data_time,
//             };

//             formattedData.push(formattedNotification);
//         };

//         return res.status(200).json(formattedData);

//     } catch (error) {
//         console.error('Erro detectado: ', error, 'Rota: ', req.url);
//         return res.status(400).json({ error: 'Erro ao processar a solicitação' });
//     }
// });

// // router.get(version + '/conversation/contact/:contact_id', async (req, res) => {
// //     try {
// //         const { authorization } = req.headers;
// //         const { sector_id, contact_id } = req.params
// // ;

// //         const conversationResult = await db.SELECT(tables.conversation.schema, { [tables.conversation.columns.sector_id]: sector_id, [tables.conversation.columns.user_id]: contact_id })
// //         if (conversationResult.error) {
// //             console.error(conversationResult.error);
// //             return res.status(400).json(conversationResult.error);
// //         };

// //         if (!conversationResult || conversationResult.length === 0) {
// //             return res.status(200).json('Nenhuma notificação encontrada');
// //         };

// //         const formattedData = [];

// //         for (const notification of conversationResult) {

// //             let formattedSenderData = {};

// //             if (notification.user_id === 0) {
// //                 formattedSenderData = sistema
// //             } else {
// //                 const user_id = notification.user_id;

// //                 const contactQuery = `SELECT up.*, u.* FROM "${SCHEMA}".contacts_permissions AS up JOIN "${SCHEMA}".contacts AS u ON up.user_id = u.id WHERE up.user_id = $1 AND up.disabled = $2;`;
// //                 const contactValues = [user_id, false];
// //                 const contactResult = await pool.query(contactQuery, contactValues);

// //                 if (!contactResult || contactResult.length === 0) {
// //                     return res.status(404).json({ error: 'Detalhes do usuário não encontrados' });
// //                 };

// //                 formattedSenderData = {
// //                     id: contactResult.rows[0].id,
// //                     sur_name: contactResult.rows[0].sur_name,
// //                     phone_number: contactResult.rows[0].phone_number,
// //                     profile_image: contactResult.rows[0].profile_image,
// //                 };
// //             };

// //             formattedData.push({
// //                 ...formattedSenderData,
// //                 conversation_id: notification.id,
// //                 motive: notification.motive,
// //                 description: notification.description,
// //                 attendant_id: notification.attendant_id,

// //                 origin: notification.origin,
// //                 status: notification.status,
// //                 viewed: notification.viewed,
// //                 blocked: notification.blocked,
// //                 stopped: notification.stopped,

// //                 last_message: notification.last_message,

// //                 data_time: notification.data_time,
// //                 data_time_closed: notification.data_time,
// //                 data_time_stopped: notification.data_time,
// //                 data_time_return: notification.data_time,
// //             });

// //         };

// //         return res.status(200).json(formattedData);

// //     } catch (error) {
// //         console.error('Erro detectado: ', error, 'Rota: ', req.url);
// //         return res.status(400).json({ error: 'Erro ao processar a solicitação' });
// //     }
// // });

// //POST 

// // router.post(version + '/conversation', async (req, res) => {
// //     try {
// //         const { authorization } = req.headers;
// //         const { sector_id } = req.params
// //         const { attendant_id, status } = req.body;
// // ;

// //         const conversationResult = await db.SELECT(tables.conversation.schema, { [tables.conversation.columns.sector_id]: sector_id, [tables.conversation.columns.status]: status, [tables.conversation.columns.attendant_id]: attendant_id })
// //         if (conversationResult.error) {
// //             console.error(conversationResult.error);
// //             return res.status(400).json(conversationResult.error);
// //         };

// //         if (!conversationResult || conversationResult.length === 0) {
// //             return res.status(200).json('Nenhuma notificação encontrada');
// //         };

// //         const formattedData = [];

// //         for (const notification of conversationResult) {

// //             let formattedSenderData = {};

// //             if (notification.user_id === 0) {
// //                 formattedSenderData = sistema
// //             } else {
// //                 const user_id = notification.user_id;

// //                 const contactQuery = `SELECT up.*, u.* FROM "${SCHEMA}".contacts_permissions AS up JOIN "${SCHEMA}".contacts AS u ON up.user_id = u.id WHERE up.user_id = $1 AND up.disabled = $2;`;
// //                 const contactValues = [user_id, false];
// //                 const contactResult = await pool.query(contactQuery, contactValues);

// //                 if (!contactResult || contactResult.length === 0) {
// //                     return res.status(404).json({ error: 'Detalhes do usuário não encontrados' });
// //                 };

// //                 formattedSenderData = {
// //                     id: contactResult.rows[0].id,
// //                     sur_name: contactResult.rows[0].sur_name,
// //                     phone_number: contactResult.rows[0].phone_number,
// //                     profile_image: contactResult.rows[0].profile_image,
// //                 };
// //             };

// //             formattedData.push({
// //                 ...formattedSenderData,
// //                 conversation_id: notification.id,
// //                 motive: notification.motive,
// //                 description: notification.description,
// //                 attendant_id: notification.attendant_id,

// //                 origin: notification.origin,
// //                 status: notification.status,
// //                 viewed: notification.viewed,
// //                 blocked: notification.blocked,
// //                 stopped: notification.stopped,

// //                 last_message: notification.last_message,

// //                 data_time: notification.data_time,
// //                 data_time_closed: notification.data_time,
// //                 data_time_stopped: notification.data_time,
// //                 data_time_return: notification.data_time,
// //             });

// //         };

// //         return res.status(200).json(formattedData);

// //     } catch (error) {
// //         console.error('Erro detectado: ', error, 'Rota: ', req.url);
// //         return res.status(400).json({ error: 'Erro ao processar a solicitação' });
// //     }
// // });

// router.post(version + '/conversation/create', async (req, res) => {
//     try {
//         const { authorization } = req.headers;
//         const { sector_id } = req.params;
//         const { user_id, status = false, origin = "WhatsApp", attendant_id = 0, motive = "Não Cadastrado", description = "Não Cadastrado" } = req.body;
// ;

//         const conversationResult = await db.INSERT(tables.conversation.schema,
//             {
//                 [tables.conversation.columns.sector_id]: Number(sector_id),
//                 [tables.conversation.columns.user_id]: user_id,
//                 [tables.conversation.columns.status]: status,
//                 [tables.conversation.columns.attendant_id]: attendant_id,
//                 [tables.conversation.columns.origin]: origin,
//                 [tables.conversation.columns.motive]: motive,
//                 [tables.conversation.columns.description]: description,

//             })
//         if (conversationResult.error) {
//             console.error(conversationResult.error);
//             return res.status(400).json(conversationResult.error);
//         };


//         return res.status(200).json(conversationResult);

//     } catch (error) {
//         console.error('Erro detectado: ', error, 'Rota: ', req.url);
//         return res.status(400).json({ error: 'Erro ao processar a solicitação' });
//     }
// });

// //PUT

// router.put(version + '/conversation/attendant', async (req, res) => {
//     try {
//         const { authorization } = req.headers;
//         // const { sector_id } = req.params;
//         const { sector_id, conversation_id, attendant_id } = req.body;
// ;

//         const conversationResult = await db.SELECT(tables.conversation.schema,
//             {
//                 [tables.conversation.columns.id]: conversation_id
//             })
//         if (conversationResult.error) {
//             console.error(conversationResult.error);
//             return res.status(400).json(conversationResult.error);
//         };

//         if (!conversationResult || conversationResult.length === 0) {
//             return res.status(400).json('Chamado não encontrado');
//         };

//         const userResult = await db.SELECT(tables.users.schema,
//             {
//                 [tables.users.columns.id]: attendant_id
//             })
//         if (userResult.error) {
//             console.error(userResult.error);
//             return res.status(400).json(userResult.error);
//         };

//         if (!userResult || userResult.length === 0) {
//             return res.status(400).json('Usuário não encontrado');
//         };

//         const updateConversationResult = await db.UPDATE(tables.conversation.schema,
//             {
//                 [tables.conversation.columns.attendant_id]: attendant_id
//             },
//             {
//                 [tables.conversation.columns.id]: conversation_id
//             })
//         if (updateConversationResult.error) {
//             console.error(updateConversationResult.error);
//             return res.status(400).json(updateConversationResult.error);
//         };


//         return res.status(200).json('Alterado parâmetro');

//     } catch (error) {
//         console.error('Erro detectado: ', error, 'Rota: ', req.url);
//         return res.status(400).json({ error: 'Erro ao processar a solicitação' });
//     }
// });

// router.put(version + '/conversation/return', async (req, res) => {
//     try {
//         const { authorization } = req.headers;
//         const { sector_id } = req.params;
//         const { conversation_id, attendant_id } = req.body;
// ;

//         const conversationResult = await db.SELECT(tables.conversation.schema,
//             {
//                 [tables.conversation.columns.id]: conversation_id
//             })
//         if (conversationResult.error) {
//             console.error(conversationResult.error);
//             return res.status(400).json(conversationResult.error);
//         };

//         if (!conversationResult || conversationResult.length === 0) {
//             return res.status(400).json('Chamado não encontrado');
//         };

//         const updateConversationResult = await db.UPDATE(tables.conversation.schema,
//             {
//                 [tables.conversation.columns.attendant_id]: attendant_id
//             },
//             {
//                 [tables.conversation.columns.id]: conversation_id
//             })
//         if (updateConversationResult.error) {
//             console.error(updateConversationResult.error);
//             return res.status(400).json(updateConversationResult.error);
//         };

//         io.emit('notify', sector_id, conversation_id);
//         io.emit('whatsappConversation', sector_id);

//         return res.status(200).json('Alterado parâmetro');

//     } catch (error) {
//         return res.status(400).json({ error: 'Erro ao processar a solicitação' });
//     }
// });

// router.put(version + '/conversation/closed', async (req, res) => {
//     try {
//         const { authorization } = req.headers;
//         const { sector_id } = req.params;
//         const { conversation_id, status, attendant_id, motive, description } = req.body;


//         const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
//         const data_time_closed = new Date(currentTimestampInSeconds * 1000).toISOString();

//         const updateConversationResult = await db.UPDATE(tables.conversation.schema,
//             {
//                 [tables.conversation.columns.status]: status,
//                 [tables.conversation.columns.attendant_id]: attendant_id,
//                 [tables.conversation.columns.motive]: motive,
//                 [tables.conversation.columns.description]: description,
//                 [tables.conversation.columns.data_time_closed]: data_time_closed,
//                 [tables.conversation.columns.viewed]: true,

//             },
//             {
//                 [tables.conversation.columns.id]: conversation_id,
//             })
//         if (updateConversationResult.error) {
//             console.error(updateConversationResult.error);
//             return res.status(400).json(updateConversationResult.error);
//         };

//         const scheduleResult = await db.SELECT(tables.scheduled_messages.schema,
//             {
//                 [tables.scheduled_messages.columns.type_scheduled]: 'close_ticket',
//                 [tables.scheduled_messages.columns.sector_id]: sector_id,
//             })
//         if (scheduleResult.error) {
//             console.error(scheduleResult.error);
//             return res.status(400).json(scheduleResult.error);
//         };


//         return res.status(200).json('Finalizado o atendimento');
//     } catch (error) {
//         console.error('Erro detectado: ', error, 'Rota: ', req.url);
//         return res.status(400).json({ error: 'Erro ao processar a solicitação' });
//     }
// });

// router.put(version + '/conversation/view', async (req, res) => {
//     try {
//         const { authorization } = req.headers;
//         const { sector_id } = req.params;
//         const { conversation_id } = req.body;

//         const viewed = true;
//         const blocked = false;
//         const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
//         const data_time_viewed = new Date(currentTimestampInSeconds * 1000).toISOString();
// ;

//         const scheduleResult = await db.SELECT(tables.scheduled_messages.schema,
//             {
//                 [tables.scheduled_messages.columns.type_scheduled]: 'init_ticket',
//                 [tables.scheduled_messages.columns.sector_id]: sector_id,
//             })
//         if (scheduleResult.error) {
//             console.error(scheduleResult.error);
//             return res.status(400).json(scheduleResult.error);
//         };

//         const updateConversationResult = await db.UPDATE(tables.conversation.schema,
//             {
//                 [tables.conversation.columns.blocked]: blocked,
//                 [tables.conversation.columns.viewed]: viewed,
//                 [tables.conversation.columns.data_time_viewed]: data_time_viewed,
//             },
//             {
//                 [tables.conversation.columns.id]: conversation_id,
//             })
//         if (updateConversationResult.error) {
//             console.error(updateConversationResult.error);
//             return res.status(400).json(updateConversationResult.error);
//         };


//         io.emit("distribute", {
//             sector_id: sector_id
//         });

//         return res.status(200).json('Atualizado chamado');
//     } catch (error) {
//         console.error('Erro detectado: ', error, 'Rota: ', req.url);
//         return res.status(400).json({ error: 'Erro ao processar a solicitação' });
//     }
// });

// router.put(version + '/conversation/update', async (req, res) => {
//     try {
//         const { authorization } = req.headers;
//         const { sector_id } = req.params;
//         const { conversation_id, status, attendant_id, motive, description } = req.body;

//         const currentTimestampInSeconds = Math.floor(Date.now() / 1000); // Obter o timestamp em segundos
//         const data_time_closed = new Date(currentTimestampInSeconds * 1000).toISOString(); // Extrair a parte do tempo da data e hora ISO


//         const conversationResult = await db.UPDATE(tables.conversation.schema,
//             {
//                 [tables.conversation.columns.status]: status,
//                 [tables.conversation.columns.attendant_id]: attendant_id,
//                 [tables.conversation.columns.motive]: motive,
//                 [tables.conversation.columns.description]: description,
//                 [tables.conversation.columns.data_time_closed]: data_time_closed,
//             },
//             {
//                 [tables.conversation.columns.id]: conversation_id,
//             })
//         if (conversationResult.error) {
//             console.error(conversationResult.error);
//             return res.status(400).json(conversationResult.error);
//         };


//         return res.status(200).json(conversationResult);
//     } catch (error) {
//         console.error('Erro detectado: ', error, 'Rota: ', req.url);
//         return res.status(400).json({ error: 'Erro ao processar a solicitação' });
//     }
// });

// router.put(version + '/conversation/stopped', async (req, res) => {
//     try {
//         const { authorization } = req.headers;
//         const { sector_id } = req.params;
//         const { conversation_id, stopped } = req.body;


//         const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
//         const data_time = new Date(currentTimestampInSeconds * 1000).toISOString();

//         let type_date;

//         if (stopped === true) {
//             type_date = 'data_time_stopped'
//         } else {
//             type_date = 'data_time_return'
//         };

//         const conversationResult = await db.UPDATE(tables.conversation.schema,
//             {
//                 [tables.conversation.columns.stopped]: stopped,
//                 type_date: data_time,
//             },
//             {
//                 [tables.conversation.columns.id]: conversation_id,
//                 [tables.conversation.columns.sector_id]: sector_id,
//             })
//         if (conversationResult.error) {
//             console.error(conversationResult.error);
//             return res.status(400).json(conversationResult.error);
//         };

//         return res.status(200).json(stopped);

//     } catch (error) {
//         console.error('Erro detectado: ', error, 'Rota: ', req.url);
//         return res.status(400).json({ error: 'Erro ao processar a solicitação' });
//     }
// });


export default router;
