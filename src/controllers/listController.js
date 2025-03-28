import { Op } from 'sequelize';
import { models } from '../models/index.js';

export async function getUserLists(req, res) {
    if (!req.authenticatedUser) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const whereClause = {
            [Op.or]: [
                { userId: req.authenticatedUser.id },
                {
                    collaboratorsEmails: {
                        [Op.like]: `%${req.authenticatedUser.email}%`,
                    },
                },
            ],
        };

        const userLists = await models.List.findAll({
            where: whereClause,
            include: [
                {
                    model: models.UserLists,
                    as: 'UserLists',
                    where: {
                        userId: req.authenticatedUser.id,
                    },
                    attributes: ['fixed'],
                },
            ],
        });

        res.json(userLists);
    } catch (error) {
        console.error('Erro ao buscar listas:', error);
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
        const userList = await models.List.findOne({
            where: {
                id: listId,
                [Op.or]: [
                    { userId: req.authenticatedUser.id },
                    {
                        collaboratorsEmails: {
                            [Op.like]: `%${req.authenticatedUser.email}%`,
                        },
                    },
                ],
            },
            include: {
                model: models.UserLists,
                as: 'UserLists',
                where: {
                    userId: req.authenticatedUser.id,
                },
                attributes: ['fixed'],
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
    const {
        title,
        daily = false,
        collaboratorsEmails = '',
        fixed = false,
    } = req.body;

    if (!req.authenticatedUser) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const newList = await models.List.create({
            title,
            daily,
            collaboratorsEmails,
            userId: req.authenticatedUser.id,
        });

        await models.UserLists.create({
            userId: req.authenticatedUser.id,
            listId: newList.id,
            fixed: fixed,
        });

        res.status(201).json({
            list: newList,
            fixed: fixed,
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
        const list = await models.List.findByPk(listId);

        if (!list) {
            return res.status(404).json({
                error: `Lista com ID ${listId} não encontrada.`,
            });
        }

        const isOwner = list.userId === req.authenticatedUser.id;
        const isCollaborator = list.collaboratorsEmails
            ?.split(',')
            .map((email) => email.trim())
            .includes(req.authenticatedUser.email);

        if (isOwner) {
            await models.List.update(
                {
                    title: title ?? list.title,
                    collaboratorsEmails: collaboratorsEmails,
                },
                { where: { id: listId } },
            );
        }

        if (typeof fixed !== 'undefined') {
            const userList = await models.UserLists.findOne({
                where: { userId: req.authenticatedUser.id, listId: listId },
            });

            if (userList) {
                await userList.update({ fixed });
            } else {
                await models.UserLists.create({
                    userId: req.authenticatedUser.id,
                    listId: listId,
                    fixed: fixed,
                });
            }
        }

        const updatedList = await models.List.findOne({
            where: { id: listId },
            include: [
                {
                    model: models.UserLists,
                    as: 'UserLists',
                    where: { userId: req.authenticatedUser.id },
                    required: false,
                },
            ],
        });

        return res.json({
            list: updatedList,
            fixed: fixed,
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
        const list = await models.List.findByPk(listId);

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
            await models.List.destroy({ where: { id: listId } });

            return res.status(200).json({
                message: `Lista ${listTitle} deletada com sucesso.`,
            });
        }

        if (isCollaborator) {
            const updatedCollaborators = collaboratorsEmails
                .filter((email) => email !== req.authenticatedUser.email)
                .join(',');

            await models.List.update(
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
