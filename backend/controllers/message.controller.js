import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id

        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId]
            }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        Promise.all([newMessage.save(), conversation.save()])

        res.status(201).json({ newMessage })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getMessages = async (req, res) => {
    try {
        const senderId = req.user._id
        const { id: userToChatId } = req.params
        const conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, userToChatId]
            }
        }).populate('messages')

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' })
        }

        res.status(200).json(conversation.messages)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}