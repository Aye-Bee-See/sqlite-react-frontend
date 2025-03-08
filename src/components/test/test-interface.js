import prisonNetworkService from '../../services/prison-network-service';
import prisonerNetworkService from '../../services/prisoner-network-service';
import ruleNetworkService from '../../services/rule-network-service';
import userNetworkService from '../../services/user-network-service';
import loginNetworkService from '../../services/login-network-service';
import chatNetworkService from '../../services/chat-network-service';
import messageNetworkService from '../../services/messaging-network-service';
import chapterNetworkService from '../../services/chapter-network-service';

export async function runTests(token) {
	const results = {
		createUser: null,
		getToken: null,
		createPrison: null,
		createPrisoner: null,
		createRule: null,
		getUsers: null,
		getPrisons: null,
		getPrisoners: null,
		getRules: null,
		getUser: null,
		getPrison: null,
		getPrisoner: null,
		getRule: null,
		updatePrison: null,
		updatePrisoner: null,
		updateUser: null,
		updateRule: null,
		deletePrison: null,
		deletePrisoner: null,
		deleteRule: null,
		deleteUser: null,
		createChat: null,
		createMessage: null,
		getChats: null,
		getMessages: null,
		updateChat: null,
		updateMessage: null,
		deleteChat: null,
		deleteMessage: null,
		createChapter: null,
		getChapters: null,
		getChapter: null,
		updateChapter: null,
		deleteChapter: null
	};

	try {
		// Create user
		const userParams = {
			username: 'testuser',
			name: 'test user',
			email: 'testuser@testuser.biz',
			password: 'password',
			role: 'user'
		};
		const newUser = await loginNetworkService.register(userParams);
		console.log(newUser);
		results.createUser = true;

		// Get token
		const loginResponse = await loginNetworkService.login(userParams.username, userParams.password);
		const userToken = loginResponse.data.data.token.token;
		results.getToken = true;

		// Create prison
		const prisonParams = { prisonName: 'Test Prison', address: { street: 'Test Prison Street' } };
		const newPrison = await prisonNetworkService.addOne(prisonParams, userToken);
		results.createPrison = true;

		// Create prisoner
		const prisonerParams = {
			birthName: 'Test Prisoner',
			chosenName: 'Test Prisoner Chosen Name',
			inmateID: '123',
			prison: 1,
			releaseDate: '2029-04-05T23:24:24.819Z',
			bio: 'Test Bio'
		};
		const newPrisoner = await prisonerNetworkService.addOne(prisonerParams, userToken);
		results.createPrisoner = true;

		// Create rule
		const ruleParams = { title: 'Test rule', description: 'Test Rule description' };
		const newRule = await ruleNetworkService.addOne(ruleParams, userToken);
		results.createRule = true;

		// Create chat
		const chatParams = { user: newUser.data.data.id, prisoner: newPrisoner.data.data.id };
		const newChat = await chatNetworkService.addOne(chatParams, userToken);
		results.createChat = true;

		// Create message from user
		const userMessageParams = {
			chat: newChat.data.data.id,
			messageText: 'Hello from user',
			sender: 'user',
			user: newUser.data.data.id,
			prisoner: newPrisoner.data.data.id
		};
		const newUserMessage = await messageNetworkService.addOne(userMessageParams, userToken);
		results.createMessage = true;

		// Create message from prisoner
		const prisonerMessageParams = {
			chat: newChat.data.data.id,
			messageText: 'Hello from prisoner',
			sender: 'prisoner',
			prisoner: newPrisoner.data.data.id,
			user: newUser.data.data.id
		};
		const newPrisonerMessage = await messageNetworkService.addOne(prisonerMessageParams, userToken);
		results.createMessage = true;

		// Create chapter
		const chapterParams = { name: 'Test Chapter', location: { street: 'Test Chapter Street' } };
		const newChapter = await chapterNetworkService.addOne(chapterParams, userToken);
		results.createChapter = true;

		// Get users
		const users = await userNetworkService.getAll(userToken);
		results.getUsers = users.data.data.some((p) => p.username === 'testuser');

		// Get prisons
		const prisons = await prisonNetworkService.getAll(userToken);
		results.getPrisons = prisons.data.data.some((p) => p.prisonName === 'Test Prison');

		// Get prisoners
		const prisoners = await prisonerNetworkService.getAll(userToken);
		results.getPrisoners = prisoners.data.data.some((p) => p.birthName === 'Test Prisoner');

		// Get rules
		const rules = await ruleNetworkService.getAll(userToken);
		results.getRules = rules.data.data.some((r) => r.title === 'Test rule');

		// Get chats
		const chats = await chatNetworkService.getChatsByUserOrPrisoner(
			newUser.data.data.id,
			null,
			userToken
		);
		results.getChats = chats.data.data.some((c) => c.id === newChat.data.data.id);

		// Get messages
		const messages = await messageNetworkService.getMessagesByChat(newChat.data.data.id, userToken);
		results.getMessages =
			messages.data.data.some((m) => m.messageText === 'Hello from user') &&
			messages.data.data.some((m) => m.messageText === 'Hello from prisoner');

		// Get chapters
		const chapters = await chapterNetworkService.getAll(userToken);
		results.getChapters = chapters.data.data.some((c) => c.name === 'Test Chapter');

		// Get user
		const user = await userNetworkService.getOne(newUser.data.data.id, userToken);
		results.getUser = user.data.data.name === newUser.data.data.name;

		// Get prison
		const prison = await prisonNetworkService.getOne(newPrison.data.data.id, userToken);
		results.getPrison = prison.data.data.prisonName === newPrison.data.data.prisonName;

		// Get prisoner
		const prisoner = await prisonerNetworkService.getOne(newPrisoner.data.data.id, userToken);
		results.getPrisoner = prisoner.data.data.birthName === newPrisoner.data.data.birthName;

		// Get rule
		const rule = await ruleNetworkService.getOne(newRule.data.data.id, userToken);
		results.getRule = rule.data.data.title === newRule.data.data.title;

		// Get chapter
		const chapter = await chapterNetworkService.getOne(newChapter.data.data.id, userToken);
		results.getChapter = chapter.data.data.name === newChapter.data.data.name;

		// Update prison
		const updatedPrisonParams = { id: newPrison.data.data.id, name: 'Updated Test Prison' };
		await prisonNetworkService.updateOne(updatedPrisonParams, userToken);
		results.updatePrison = true;

		// Update prisoner
		const updatedPrisonerParams = { id: newPrisoner.data.data.id, name: 'Updated Test Prisoner' };
		await prisonerNetworkService.updateOne(updatedPrisonerParams, userToken);
		results.updatePrisoner = true;

		// Update user
		const updatedUserParams = {
			id: newUser.data.data.id,
			username: 'updatedtestuser',
			password: 'newpassword'
		};
		await userNetworkService.updateOne(updatedUserParams, userToken);
		results.updateUser = true;

		// Update rule
		const updatedRuleParams = { id: newRule.data.data.id, description: 'Updated Test Rule' };
		await ruleNetworkService.updateOne(updatedRuleParams, userToken);
		results.updateRule = true;

		// Update chat
		const updatedChatParams = { id: newChat.data.data.id, user: newUser.data.data.id, prisoner: 1 };
		await chatNetworkService.updateOne(updatedChatParams, userToken);
		results.updateChat = true;

		// Update message
		const updatedMessageParams = {
			id: newUserMessage.data.data.id,
			user: newUser.data.data.id,
			prisoner: newPrisoner.data.data.id,
			messageText: 'Updated message from user'
		};
		await messageNetworkService.updateOne(updatedMessageParams, userToken);
		results.updateMessage = true;

		// Update chapter
		const updatedChapterParams = { id: newChapter.data.data.id, name: 'Updated Test Chapter' };
		await chapterNetworkService.updateOne(updatedChapterParams, userToken);
		results.updateChapter = true;

		// Delete prison
		await prisonNetworkService.deleteOne(newPrison.data.data.id, userToken);
		results.deletePrison = true;

		// Delete prisoner
		await prisonerNetworkService.deleteOne(newPrisoner.data.data.id, userToken);
		results.deletePrisoner = true;

		// Delete rule
		await ruleNetworkService.deleteOne(newRule.data.data.id, userToken);
		results.deleteRule = true;

		// Delete chat
		await chatNetworkService.deleteOne(newChat.data.data.id, userToken);
		results.deleteChat = true;

		// Delete message
		await messageNetworkService.deleteOne(newUserMessage.data.data.id, userToken);
		results.deleteMessage = true;

		// Delete chapter
		await chapterNetworkService.deleteOne(newChapter.data.data.id, userToken);
		results.deleteChapter = true;

		// Delete user
		await userNetworkService.deleteOne(newUser.data.data.id, userToken);
		console.log(newUser.data.data);
		results.deleteUser = true;
	} catch (error) {
		console.error(error);
		const failedTask = error.config.url.split('/').pop().split('?')[0];
		results[failedTask] = error.response?.data?.error || false;
	}

	return results;
}
