import database from '../config/db.js';

export async function getUserLists(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const [userLists] = await database.query(
            `SELECT * FROM tbLists 
             WHERE user_id = ? OR FIND_IN_SET(?, collaborators_emails) > 0`,
            [req.user.id, req.user.email],
        );

        res.json(userLists);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar listas.' });
    }
}

export async function getUserListById(req, res) {
    const { listId } = req.params;

    if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const [listData] = await database.query(
            `SELECT * FROM tbLists 
             WHERE id = ? AND (user_id = ? OR FIND_IN_SET(?, collaborators_emails) > 0)`,
            [listId, req.user.id, req.user.email],
        );

        if (listData.length === 0) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }

        res.json(listData[0]);
    } catch (error) {
        res.status(500).json({
            error: `Erro ao buscar a lista ${listId}.`,
        });
    }
}

export async function createUserList(req, res) {
    const { title, daily, collaboratorsEmails = '' } = req.body;

    if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const [insertResult] = await database.query(
            'INSERT INTO tbLists (title, daily, collaborators_emails, user_id) VALUES (?, ?, ?, ?)',
            [title, daily, collaboratorsEmails, req.user.id],
        );

        res.status(201).json({
            id: insertResult.insertId,
            title,
            daily,
            collaboratorsEmails,
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar lista.' });
    }
}

export async function updateUserList(req, res) {
    const { listId } = req.params;
    const { title, fixed, daily, collaboratorsEmails = '' } = req.body;

    if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const [existingList] = await database.query(
            'SELECT * FROM tbLists WHERE id = ?',
            [listId],
        );

        if (existingList.length === 0) {
            return res.status(404).json({ error: 'Lista não encontrada.' });
        }

        const listDetails = existingList[0];
        const isOwner = listDetails.user_id === req.user.id;
        const isCollaborator = listDetails.collaborators_emails
            ?.split(',')
            .map((email) => email.trim())
            .includes(req.user.email);

        if (isOwner) {
            const updatedList = {
                title: title || listDetails.title,
                daily: daily !== undefined ? daily : listDetails.daily,
                collaboratorsEmails: collaboratorsEmails || '',
            };

            await database.query(
                'UPDATE tbLists SET title = ?, daily = ?, collaborators_emails = ? WHERE id = ?',
                [
                    updatedList.title,
                    updatedList.daily,
                    updatedList.collaboratorsEmails,
                    listId,
                ],
            );

            return res.json({
                message: `A lista '${updatedList.title}' foi atualizada com sucesso.`,
                list: updatedList,
            });
        }

        if (isCollaborator && fixed !== undefined) {
            const [existingUserList] = await database.query(
                'SELECT * FROM tbUserLists WHERE user_id = ? AND list_id = ?',
                [req.user.id, listId],
            );

            if (existingUserList.length === 0) {
                await database.query(
                    'INSERT INTO tbUserLists (user_id, list_id, fixed) VALUES (?, ?, ?)',
                    [req.user.id, listId, fixed],
                );
            } else {
                await database.query(
                    'UPDATE tbUserLists SET fixed = ? WHERE user_id = ? AND list_id = ?',
                    [fixed, req.user.id, listId],
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
        });
    }
}

export async function deleteUserList(req, res) {
    const { listId } = req.params;

    try {
        const [listData] = await database.query(
            'SELECT * FROM tbLists WHERE id = ?',
            [listId],
        );

        if (listData.length === 0) {
            return res.status(404).json({ error: 'Lista não encontrada.' });
        }

        const listTitle = listData[0].title;
        const listOwnerId = listData[0].user_id;
        const collaboratorsEmails = listData[0].collaborators_emails
            ? listData[0].collaborators_emails
                  .split(',')
                  .map((email) => email.trim())
            : [];

        const isOwner = req.user && req.user.id === listOwnerId;
        const isCollaborator =
            req.user && collaboratorsEmails.includes(req.user.email);

        if (isOwner) {
            await database.query('DELETE FROM tbLists WHERE id = ?', [listId]);
            return res.status(200).json({
                message: `Lista ${listTitle} deletada com sucesso.`,
            });
        }

        if (isCollaborator) {
            const updatedCollaborators = collaboratorsEmails
                .filter((email) => email !== req.user.email)
                .join(',');

            await database.query(
                'UPDATE tbLists SET collaborators_emails = ? WHERE id = ?',
                [updatedCollaborators, listId],
            );

            return res.status(200).json({
                message: `Você foi removido da lista ${listTitle}.`,
            });
        }

        return res.status(403).json({ error: 'Acesso negado.' });
    } catch (error) {
        res.status(500).json({
            error: `Erro ao deletar a lista ${listTitle}.`,
        });
    }
}
