import { Op } from 'sequelize';
import List from '../models/list.js';
import UserLists from '../models/usersLists.js';

export async function getUserLists(req, res) {
    if (!req.authenticatedUser) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const userLists = await List.findAll({
            where: {
                [Op.or]: [
                    { userId: req.authenticatedUser.id },
                    {
                        collaboratorsEmails: {
                            [Op.like]: `%${req.authenticatedUser.email}%`,
                        },
                    },
                ],
            },
        });

        res.json(userLists);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar listas.',
            details: error.message,
        });
    }
}

export async function getUserListById(req, res) {
    const { listId } = req.params;

    if (!req.authenticatedUser) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const userList = await List.findOne({
            where: {
                id: listId,
                [Op.or]: [
                    { user_id: req.authenticatedUser.id },
                    {
                        collaboratorsEmails: {
                            [Op.like]: `%${req.authenticatedUser.email}%`,
                        },
                    },
                ],
            },
        });

        if (!userList) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }

        res.json(userList);
    } catch (error) {
        res.status(500).json({
            error: `Erro ao buscar a lista ${listId}.`,
            details: error.message,
        });
    }
}

export async function createUserList(req, res) {
    const { title, daily, collaboratorsEmails = '' } = req.body;

    if (!req.authenticatedUser) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const newList = await List.create({
            title,
            daily,
            collaboratorsEmails,
            userId: req.authenticatedUser.id,
        });

        res.status(201).json({
            id: newList.id,
            title: newList.title,
            daily: newList.daily,
            collaboratorsEmails: newList.collaboratorsEmails,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao criar lista.',
            details: error.message,
        });
    }
}

export async function updateUserList(req, res) {
    const { listId } = req.params;
    const { title, fixed, collaboratorsEmails = '' } = req.body;

    if (!req.authenticatedUser) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const list = await List.findOne({ where: { id: listId } });

        if (!list) {
            return res.status(404).json({
                error: `Lista com ID ${listId} não encontrada.`,
            });
        }

        const listDetails = list;
        const isOwner = listDetails.userId === req.authenticatedUser.id;
        const isCollaborator = listDetails.collaborators_emails
            ?.split(',')
            .map((email) => email.trim())
            .includes(req.authenticatedUser.email);

        if (isOwner) {
            await List.update(
                {
                    title: title ?? list.title,
                    collaborators_emails: collaboratorsEmails,
                },
                { where: { id: listId } },
            );

            const updatedList = await List.findOne({ where: { id: listId } });

            return res.json({
                message: `A lista '${updatedList.title}' foi atualizada com sucesso.`,
                list: updatedList,
            });
        }

        if (isCollaborator && fixed !== undefined) {
            const userListAssociation = await UserLists.findOne({
                where: { userId: req.authenticatedUser.id, listId: listId },
            });

            if (!userListAssociation) {
                await UserLists.create({
                    userId: req.authenticatedUser.id,
                    listId: listId,
                    fixed: fixed,
                });
            } else {
                await UserLists.update(
                    { fixed: fixed },
                    {
                        where: {
                            listId: listId,
                            userId: req.authenticatedUser.id,
                        },
                    },
                );
            }

            return res.json(fixed);
        }

        return res.status(403).json({
            error: `Você não tem permissão para atualizar a lista ${listDetails.title}.`,
        });
    } catch (error) {
        res.status(500).json({
            error: `Erro ao atualizar a lista ${title || `ID: ${listId}`}.`,
            details: error.message,
        });
    }
}

export async function deleteUserList(req, res) {
    const { listId } = req.params;

    try {
        const list = await List.findOne({ where: { id: listId } });

        if (!list) {
            return res.status(404).json({
                error: `Lista com ID ${listId} não encontrada.`,
            });
        }

        const listTitle = list.title;
        const listOwnerId = list.userId;
        const collaboratorsEmails = list.collaboratorsEmails
            ? list.collaboratorsEmails.split(',').map((email) => email.trim())
            : [];

        const isOwner =
            req.authenticatedUser && req.authenticatedUser.id === listOwnerId;
        const isCollaborator =
            req.authenticatedUser &&
            collaboratorsEmails.includes(req.authenticatedUser.email);

        if (isOwner) {
            await List.destroy({ where: { id: listId } });

            return res.status(200).json({
                message: `Lista ${listTitle} deletada com sucesso.`,
            });
        }

        if (isCollaborator) {
            const updatedCollaborators = collaboratorsEmails
                .filter((email) => email !== req.authenticatedUser.email)
                .join(',');

            await List.update(
                { collaboratorsEmails: updatedCollaborators },
                { where: { id: listId } },
            );

            return res.status(200).json({
                message: `Você foi removido da lista ${listTitle}.`,
            });
        }

        return res.status(403).json({ error: 'Acesso negado.' });
    } catch (error) {
        res.status(500).json({
            error: `Erro ao deletar a lista ${listTitle}.`,
            details: error.message,
        });
    }
}
