const Task = require('../models/task.model.js');
const User = require('../models/user.model');
const { getAllUsers } = require('./user.controller.js');

const getTasks = async (userId=null) => {
    const querySearch = {}
    if (userId) {
        querySearch.user = userId
    }
    const tasksQuery = Task.find(querySearch).select("user compromise state dueDate")

    tasksQuery.populate({
        path: 'user',
        select: 'name lastname'
    })

    tasksQuery.populate({
        path: 'compromise',
        select: 'content references enum'
    })

    const tasks = await tasksQuery.exec()

    const grupedTasks = {
        new: [],
        doing: [],
        paused: [],
        testing: [],
        ended: []
    }

    tasks.forEach(task => {
        if(task.state == 0) {
            grupedTasks.new.push(task)
        }
        else if(task.state == 1) {
            grupedTasks.doing.push(task)
        }
        else if(task.state == 2) {
            grupedTasks.paused.push(task)
        }
        else if(task.state == 3) {
            grupedTasks.testing.push(task)
        }
        else {
            grupedTasks.ended.push(task)
        }
    })

    return grupedTasks
}

const updateTaskState = async (taskId, newState) => {
    await Task.findByIdAndUpdate(taskId, {
        state: newState
    }).exec()
}

const getAllMembers = async () => {
    const users = User.find({password: {$exists: true}}).select("name lastname").exec()

    return users
}

module.exports = async (io, socket) => {

    socket.on('getTasks', async () => {
        const tasks = await getTasks()
        socket.emit('tasks', tasks)
    })

    socket.on('updateTaskState', async (taskId, newState) => {
        await updateTaskState(taskId, newState)
        const tasks = await getTasks()
        socket.broadcast.emit('tasks', tasks)
    })

    socket.on('getMembers', async () => {
        const members = await getAllMembers()
        socket.emit('members', members)
    })

    socket.on('assignUser', async (taskId, userId) => {
        await Task.findByIdAndUpdate(taskId, {user: userId}).exec()
        const tasksUpdated = await getTasks()
        io.emit('tasks', tasksUpdated)
    })

    socket.on('assignDueDate', async (taskId, dueDate) => {
        await Task.findByIdAndUpdate(taskId, {dueDate: dueDate}).exec()
        const tasksUpdated = await getTasks()
        io.emit('tasks', tasksUpdated)
    })

    console.log(`Socket ${socket.id} has connected`);
}