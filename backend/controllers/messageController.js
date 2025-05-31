const { Conversation, Message } = require("../models/Message")
const User = require("../models/User")
const { Profile } = require("../models/Profile")
const Post = require("../models/Post")
const fs = require("fs")
const path = require("path")

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "public/uploads/messages")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// CRITICAL: Send message with images function
exports.sendMessageWithImages = async (req, res) => {
  try {
    console.log("=== SEND MESSAGE WITH IMAGES START ===")
    console.log("Request body:", req.body)
    console.log("Files:", req.files)
    console.log("User:", req.user)

    const { conversationId, content } = req.body
    const senderId = req.user._id
    const images = req.files || []

    console.log("Parsed data:", { conversationId, content, senderId, imageCount: images.length })

    // Validate input
    if (!conversationId) {
      console.log("ERROR: No conversation ID provided")
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      })
    }

    if (!content && images.length === 0) {
      console.log("ERROR: No content or images provided")
      return res.status(400).json({
        success: false,
        message: "Message content or images are required",
      })
    }

    // Check if the conversation exists and the user is a participant
    console.log("Finding conversation...")
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: senderId,
    })

    if (!conversation) {
      console.log("ERROR: Conversation not found")
      return res.status(404).json({
        success: false,
        message: "Conversation not found or you are not a participant",
      })
    }

    console.log("Conversation found:", conversation._id)

    // Check if the conversation is blocked
    if (conversation.isBlocked) {
      const isBlockedByCurrentUser = conversation.blockedBy.toString() === senderId.toString()

      if (isBlockedByCurrentUser) {
        console.log("ERROR: User blocked this conversation")
        return res.status(403).json({
          success: false,
          message: "You've blocked this conversation. Unblock to send messages.",
        })
      } else {
        console.log("ERROR: User is blocked by other participant")
        return res.status(403).json({
          success: false,
          message: "You cannot message this user as they have blocked you.",
        })
      }
    }

    // Process uploaded images
    const imagePaths = images.map((file) => `/uploads/messages/${file.filename}`)
    console.log("Image paths:", imagePaths)

    // Create and save the message
    console.log("Creating message...")
    const message = new Message({
      conversationId: conversation._id,
      sender: senderId,
      content: content || (images.length > 0 ? `Sent ${images.length} image(s)` : ""),
      images: imagePaths,
      delivered: false,
    })

    await message.save()
    console.log("Message saved:", message._id)

    // Update the conversation with the last message
    conversation.lastMessage = message._id
    conversation.lastMessageText = content || `📷 Sent ${images.length} image(s)`
    conversation.lastMessageDate = new Date()

    // If the conversation was archived by the sender, unarchive it
    if (
      conversation.isArchived &&
      conversation.archivedBy &&
      conversation.archivedBy.toString() === senderId.toString()
    ) {
      conversation.isArchived = false
      conversation.archivedBy = undefined
    }

    await conversation.save()
    console.log("Conversation updated")

    // Populate sender info for the response
    const populatedMessage = await Message.findById(message._id).populate({
      path: "sender",
      select: "_id name email",
    })

    // Get sender profile photo
    const senderProfile = await Profile.findOne({ userId: senderId }).select("profilePhoto")

    // Format message with profile photo
    const formattedMessage = {
      ...populatedMessage.toObject(),
      sender: {
        ...populatedMessage.sender.toObject(),
        profilePhotoUrl: senderProfile?.profilePhoto
          ? `/uploads/profile/${senderProfile.profilePhoto.split("/").pop()}`
          : "/default-profile.jpg",
      },
    }

    console.log("=== SEND MESSAGE WITH IMAGES SUCCESS ===")

    res.status(201).json({
      success: true,
      message: formattedMessage,
      conversation: conversation,
    })
  } catch (error) {
    console.error("=== SEND MESSAGE WITH IMAGES ERROR ===")
    console.error("Error details:", error)
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
      error: error.message,
    })
  }
}

// Get all conversations for the current user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id
    console.log("Getting conversations for user:", userId)

    // Find all conversations where the current user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "participants",
        select: "_id name email role",
        match: { _id: { $ne: userId } }, // Only populate other participants
      })
      .populate({
        path: "lastMessage",
        select: "content createdAt",
      })
      .sort({ updatedAt: -1 })

    console.log("Found conversations:", conversations.length)

    // Get profiles for the participants
    const participantIds = conversations.flatMap((conv) => {
      return conv.participants.filter((p) => p && p._id).map((p) => p._id)
    })

    let profiles = []
    if (participantIds.length > 0) {
      profiles = await Profile.find({ userId: { $in: participantIds } }).select("userId profilePhoto")
    }

    // Calculate unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conversation) => {
        const conversationObj = conversation.toObject()

        // Count unread messages
        const unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          sender: { $ne: userId },
          read: false,
          isDeleted: { $ne: true },
        })

        // Format participants with profile photos
        const formattedParticipants = conversationObj.participants
          .filter((p) => p && p._id) // Filter out any null participants
          .map((participant) => {
            const profile = profiles.find(
              (p) => p && p.userId && participant._id && p.userId.toString() === participant._id.toString(),
            )

            return {
              ...participant,
              profilePhotoUrl: profile?.profilePhoto
                ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
                : "/default-profile.jpg",
            }
          })

        return {
          ...conversationObj,
          participants: formattedParticipants,
          unreadCount,
        }
      }),
    )

    res.status(200).json({
      success: true,
      conversations: conversationsWithUnread,
    })
  } catch (error) {
    console.error("Error getting conversations:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get messages for a specific conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params
    const userId = req.user._id

    // Check if the conversation exists and the user is a participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or you are not a participant",
      })
    }

    // Get messages for the conversation that are not deleted
    const messages = await Message.find({
      conversationId,
      isDeleted: { $ne: true },
    })
      .populate({
        path: "sender",
        select: "_id name email",
      })
      .sort({ createdAt: 1 })

    // Get profiles for the senders
    const senderIds = messages.map((message) => message.sender._id)
    const profiles = await Profile.find({ userId: { $in: senderIds } }).select("userId profilePhoto")

    // Format messages with profile photos and handle forwarded posts
    const formattedMessages = messages.map((message) => {
      const messageObj = message.toObject()
      const profile = profiles.find((p) => p.userId.toString() === message.sender._id.toString())

      return {
        ...messageObj,
        sender: {
          ...messageObj.sender,
          profilePhotoUrl: profile?.profilePhoto
            ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
            : "/default-profile.jpg",
        },
      }
    })

    // Mark unread messages as read
    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: userId },
        read: false,
      },
      { read: true },
    )

    res.status(200).json({
      success: true,
      messages: formattedMessages,
    })
  } catch (error) {
    console.error("Error getting messages:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Enhanced sendMessage function (for text-only messages)
exports.sendMessage = async (req, res) => {
  try {
    console.log("=== SEND TEXT MESSAGE START ===")
    const { recipientId, content, conversationId, forwardedPost } = req.body
    const senderId = req.user._id

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      })
    }

    let conversation

    // If conversationId is provided, use it
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        participants: senderId,
      })

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found or you are not a participant",
        })
      }

      // Check if the conversation is blocked
      if (conversation.isBlocked) {
        const isBlockedByCurrentUser = conversation.blockedBy.toString() === senderId.toString()

        if (isBlockedByCurrentUser) {
          return res.status(403).json({
            success: false,
            message: "You've blocked this conversation. Unblock to send messages.",
          })
        } else {
          return res.status(403).json({
            success: false,
            message: "You cannot message this user as they have blocked you.",
          })
        }
      }
    } else if (recipientId) {
      // Check if recipient exists
      const recipient = await User.findById(recipientId)
      if (!recipient) {
        return res.status(404).json({
          success: false,
          message: "Recipient not found",
        })
      }

      // Check if a conversation already exists between these users
      conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
      })

      // Check if the conversation exists and is blocked
      if (conversation && conversation.isBlocked) {
        const isBlockedByCurrentUser = conversation.blockedBy.toString() === senderId.toString()

        if (isBlockedByCurrentUser) {
          return res.status(403).json({
            success: false,
            message: "You've blocked this conversation. Unblock to send messages.",
          })
        } else {
          return res.status(403).json({
            success: false,
            message: "You cannot message this user as they have blocked you.",
          })
        }
      }

      // If no conversation exists, create a new one
      if (!conversation) {
        conversation = new Conversation({
          participants: [senderId, recipientId],
        })
        await conversation.save()
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Either conversationId or recipientId is required",
      })
    }

    // Enhanced forwarded post handling with working links
    let enhancedForwardedPost = null
    if (forwardedPost) {
      // Verify the post exists
      const post = await Post.findById(forwardedPost.postId)
      if (post) {
        enhancedForwardedPost = {
          ...forwardedPost,
          postLink: forwardedPost.postLink || `${req.protocol}://${req.get("host")}/post/${post._id}`,
          isClickable: true,
          verified: true,
        }
      }
    }

    // Create and save the message
    const message = new Message({
      conversationId: conversation._id,
      sender: senderId,
      content,
      delivered: false,
      forwardedPost: enhancedForwardedPost,
    })

    await message.save()

    // Update the conversation with the last message
    conversation.lastMessage = message._id
    conversation.lastMessageText = forwardedPost ? "📌 Forwarded a post" : content
    conversation.lastMessageDate = new Date()

    // If the conversation was archived by the sender, unarchive it
    if (
      conversation.isArchived &&
      conversation.archivedBy &&
      conversation.archivedBy.toString() === senderId.toString()
    ) {
      conversation.isArchived = false
      conversation.archivedBy = undefined
    }

    await conversation.save()

    // Populate sender info for the response
    const populatedMessage = await Message.findById(message._id).populate({
      path: "sender",
      select: "_id name email",
    })

    // Get sender profile photo
    const senderProfile = await Profile.findOne({ userId: senderId }).select("profilePhoto")

    // Format message with profile photo
    const formattedMessage = {
      ...populatedMessage.toObject(),
      sender: {
        ...populatedMessage.sender.toObject(),
        profilePhotoUrl: senderProfile?.profilePhoto
          ? `/uploads/profile/${senderProfile.profilePhoto.split("/").pop()}`
          : "/default-profile.jpg",
      },
    }

    console.log("=== SEND TEXT MESSAGE SUCCESS ===")

    res.status(201).json({
      success: true,
      message: formattedMessage,
      conversation: conversation,
    })
  } catch (error) {
    console.error("Error sending message:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Forward a post in message with working links
exports.forwardPost = async (req, res) => {
  try {
    const { conversationId, postId } = req.body
    const senderId = req.user._id

    if (!conversationId || !postId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID and Post ID are required",
      })
    }

    // Check if the conversation exists and the user is a participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: senderId,
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or you are not a participant",
      })
    }

    // Check if the conversation is blocked
    if (conversation.isBlocked) {
      const isBlockedByCurrentUser = conversation.blockedBy.toString() === senderId.toString()

      if (isBlockedByCurrentUser) {
        return res.status(403).json({
          success: false,
          message: "You've blocked this conversation. Unblock to send messages.",
        })
      } else {
        return res.status(403).json({
          success: false,
          message: "You cannot message this user as they have blocked you.",
        })
      }
    }

    // Get the post details
    const post = await Post.findById(postId).populate("userId", "name")

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Create the post link
    const postLink = `${req.protocol}://${req.get("host")}/post/${post._id}`

    // Create the forwarded message content with working link
    const forwardedContent = `📌 Forwarded Post:\n\n${post.content || ""}\n\n${
      post.images && post.images.length > 0 ? `🖼️ ${post.images.length} image(s) attached\n\n` : ""
    }👤 Originally posted by: ${post.userId?.name || "Unknown User"}\n\n🔗 View original post: ${postLink}`

    // Create and save the message
    const message = new Message({
      conversationId: conversation._id,
      sender: senderId,
      content: forwardedContent,
      delivered: false,
      forwardedPost: {
        postId: post._id,
        originalContent: post.content,
        images: post.images,
        author: post.userId?.name || "Unknown User",
        postLink: postLink,
        createdAt: post.createdAt,
        isClickable: true,
        verified: true,
      },
    })

    await message.save()

    // Update the conversation with the last message
    conversation.lastMessage = message._id
    conversation.lastMessageText = "📌 Forwarded a post"
    conversation.lastMessageDate = new Date()

    // If the conversation was archived by the sender, unarchive it
    if (
      conversation.isArchived &&
      conversation.archivedBy &&
      conversation.archivedBy.toString() === senderId.toString()
    ) {
      conversation.isArchived = false
      conversation.archivedBy = undefined
    }

    await conversation.save()

    // Populate sender info for the response
    const populatedMessage = await Message.findById(message._id).populate({
      path: "sender",
      select: "_id name email",
    })

    // Get sender profile photo
    const senderProfile = await Profile.findOne({ userId: senderId }).select("profilePhoto")

    // Format message with profile photo
    const formattedMessage = {
      ...populatedMessage.toObject(),
      sender: {
        ...populatedMessage.sender.toObject(),
        profilePhotoUrl: senderProfile?.profilePhoto
          ? `/uploads/profile/${senderProfile.profilePhoto.split("/").pop()}`
          : "/default-profile.jpg",
      },
    }

    res.status(201).json({
      success: true,
      message: formattedMessage,
      conversation: conversation,
    })
  } catch (error) {
    console.error("Error forwarding post:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get unread message count for all conversations
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id

    // Get all conversations for the user
    const conversations = await Conversation.find({
      participants: userId,
      isBlocked: { $ne: true },
    })

    let totalUnread = 0
    const conversationUpdates = []

    for (const conversation of conversations) {
      const unreadCount = await Message.countDocuments({
        conversationId: conversation._id,
        sender: { $ne: userId },
        read: false,
        isDeleted: { $ne: true },
      })

      if (unreadCount > 0) {
        totalUnread += unreadCount
        conversationUpdates.push({
          conversationId: conversation._id,
          unreadCount,
        })
      }
    }

    res.status(200).json({
      success: true,
      totalUnread,
      conversationUpdates,
    })
  } catch (error) {
    console.error("Error getting unread count:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get archived conversations
exports.getArchivedConversations = async (req, res) => {
  try {
    const userId = req.user._id

    // Find all conversations where the current user is a participant and that are archived by this user
    const conversations = await Conversation.find({
      participants: userId,
      isArchived: true,
      archivedBy: userId,
    })
      .populate({
        path: "participants",
        select: "_id name email role",
        match: { _id: { $ne: userId } }, // Only populate other participants
      })
      .populate({
        path: "lastMessage",
        select: "content createdAt",
      })
      .sort({ updatedAt: -1 })

    // Get profiles for the participants
    const participantIds = []
    conversations.forEach((conv) => {
      conv.participants.forEach((p) => {
        if (p && p._id) {
          participantIds.push(p._id)
        }
      })
    })

    let profiles = []
    if (participantIds.length > 0) {
      profiles = await Profile.find({
        userId: { $in: participantIds },
      }).select("userId profilePhoto")
    }

    // Format conversations with profile photos
    const formattedConversations = conversations.map((conversation) => {
      const conversationObj = conversation.toObject()

      // Format participants with profile photos
      const formattedParticipants = conversationObj.participants
        .filter((p) => p && p._id) // Filter out any null participants
        .map((participant) => {
          const profile = profiles.find(
            (p) => p && p.userId && participant._id && p.userId.toString() === participant._id.toString(),
          )

          return {
            ...participant,
            profilePhotoUrl:
              profile && profile.profilePhoto
                ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
                : "/default-profile.jpg",
          }
        })

      return {
        ...conversationObj,
        participants: formattedParticipants,
      }
    })

    res.status(200).json({
      success: true,
      conversations: formattedConversations,
    })
  } catch (error) {
    console.error("Error getting archived conversations:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get blocked conversations
exports.getBlockedConversations = async (req, res) => {
  try {
    const userId = req.user._id

    // Find all conversations where the current user is a participant and that are blocked by this user
    const conversations = await Conversation.find({
      participants: userId,
      isBlocked: true,
      blockedBy: userId,
    })
      .populate({
        path: "participants",
        select: "_id name email role",
        match: { _id: { $ne: userId } }, // Only populate other participants
      })
      .populate({
        path: "lastMessage",
        select: "content createdAt",
      })
      .sort({ updatedAt: -1 })

    // Get profiles for the participants
    const participantIds = []
    conversations.forEach((conv) => {
      conv.participants.forEach((p) => {
        if (p && p._id) {
          participantIds.push(p._id)
        }
      })
    })

    let profiles = []
    if (participantIds.length > 0) {
      profiles = await Profile.find({
        userId: { $in: participantIds },
      }).select("userId profilePhoto")
    }

    // Format conversations with profile photos
    const formattedConversations = conversations.map((conversation) => {
      const conversationObj = conversation.toObject()

      // Format participants with profile photos
      const formattedParticipants = conversationObj.participants
        .filter((p) => p && p._id) // Filter out any null participants
        .map((participant) => {
          const profile = profiles.find(
            (p) => p && p.userId && participant._id && p.userId.toString() === participant._id.toString(),
          )

          return {
            ...participant,
            profilePhotoUrl:
              profile && profile.profilePhoto
                ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
                : "/default-profile.jpg",
          }
        })

      return {
        ...conversationObj,
        participants: formattedParticipants,
      }
    })

    res.status(200).json({
      success: true,
      conversations: formattedConversations,
    })
  } catch (error) {
    console.error("Error getting blocked conversations:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params
    const userId = req.user._id

    // Find the message
    const message = await Message.findById(messageId)

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      })
    }

    // Check if the user is the sender of the message
    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages",
      })
    }

    // Mark the message as deleted
    message.isDeleted = true
    await message.save()

    // If this was the last message in the conversation, update the conversation
    const conversation = await Conversation.findById(message.conversationId)
    if (conversation && conversation.lastMessage && conversation.lastMessage.toString() === messageId) {
      // Find the new last message that is not deleted
      const newLastMessage = await Message.findOne({
        conversationId: conversation._id,
        isDeleted: { $ne: true },
      }).sort({ createdAt: -1 })

      if (newLastMessage) {
        conversation.lastMessage = newLastMessage._id
        conversation.lastMessageText = newLastMessage.content
        conversation.lastMessageDate = newLastMessage.createdAt
        await conversation.save()
      }
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting message:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Report a message
exports.reportMessage = async (req, res) => {
  try {
    const { messageId } = req.params
    const userId = req.user._id
    const { reason } = req.body

    // Find the message
    const message = await Message.findById(messageId)

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      })
    }

    // Check if the user is not the sender of the message
    if (message.sender.toString() === userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot report your own messages",
      })
    }

    // Mark the message as reported
    message.isReported = true
    message.reportedBy = userId
    message.reportReason = reason || "Inappropriate content"
    await message.save()

    res.status(200).json({
      success: true,
      message: "Message reported successfully",
    })
  } catch (error) {
    console.error("Error reporting message:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Archive a conversation
exports.archiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params
    const userId = req.user._id

    // Find the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or you are not a participant",
      })
    }

    // Mark the conversation as archived
    conversation.isArchived = true
    conversation.archivedBy = userId
    await conversation.save()

    res.status(200).json({
      success: true,
      message: "Conversation archived successfully",
    })
  } catch (error) {
    console.error("Error archiving conversation:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Unarchive a conversation
exports.unarchiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params
    const userId = req.user._id

    // Find the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
      isArchived: true,
      archivedBy: userId,
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or not archived by you",
      })
    }

    // Mark the conversation as not archived
    conversation.isArchived = false
    conversation.archivedBy = undefined
    await conversation.save()

    res.status(200).json({
      success: true,
      message: "Conversation unarchived successfully",
    })
  } catch (error) {
    console.error("Error unarchiving conversation:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Block a conversation
exports.blockConversation = async (req, res) => {
  try {
    const { conversationId } = req.params
    const userId = req.user._id

    // Find the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or you are not a participant",
      })
    }

    // Mark the conversation as blocked
    conversation.isBlocked = true
    conversation.blockedBy = userId
    await conversation.save()

    res.status(200).json({
      success: true,
      message: "Conversation blocked successfully",
    })
  } catch (error) {
    console.error("Error blocking conversation:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Unblock a conversation
exports.unblockConversation = async (req, res) => {
  try {
    const { conversationId } = req.params
    const userId = req.user._id

    // Find the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
      isBlocked: true,
      blockedBy: userId,
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or not blocked by you",
      })
    }

    // Mark the conversation as not blocked
    conversation.isBlocked = false
    conversation.blockedBy = undefined
    await conversation.save()

    res.status(200).json({
      success: true,
      message: "Conversation unblocked successfully",
    })
  } catch (error) {
    console.error("Error unblocking conversation:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Mark messages as delivered
exports.markAsDelivered = async (req, res) => {
  try {
    const { conversationId } = req.params
    const userId = req.user._id

    // Find the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or you are not a participant",
      })
    }

    // Mark all undelivered messages from other participants as delivered
    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: userId },
        delivered: false,
      },
      { delivered: true },
    )

    res.status(200).json({
      success: true,
      message: "Messages marked as delivered",
    })
  } catch (error) {
    console.error("Error marking messages as delivered:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Delete a conversation and all its messages
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params
    const userId = req.user._id

    // Check if the conversation exists and the user is a participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or you are not a participant",
      })
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversationId })

    // Delete the conversation
    await Conversation.deleteOne({ _id: conversationId })

    res.status(200).json({
      success: true,
      message: "Conversation and all messages permanently deleted",
    })
  } catch (error) {
    console.error("Error deleting conversation:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get unread messages count for a conversation
exports.getUnreadMessages = async (req, res) => {
  try {
    const { conversationId } = req.params
    const userId = req.user._id

    // Check if the conversation exists and the user is a participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or you are not a participant",
      })
    }

    // Count unread messages
    const unreadCount = await Message.countDocuments({
      conversationId,
      sender: { $ne: userId },
      read: false,
      isDeleted: { $ne: true },
    })

    // Get the latest unread message
    const latestMessage = await Message.findOne({
      conversationId,
      sender: { $ne: userId },
      read: false,
      isDeleted: { $ne: true },
    })
      .populate({
        path: "sender",
        select: "_id name email",
      })
      .sort({ createdAt: -1 })

    // Get sender profile photo if there's a latest message
    let formattedLatestMessage = null
    if (latestMessage) {
      const senderProfile = await Profile.findOne({ userId: latestMessage.sender._id }).select("profilePhoto")

      formattedLatestMessage = {
        ...latestMessage.toObject(),
        sender: {
          ...latestMessage.sender.toObject(),
          profilePhotoUrl: senderProfile?.profilePhoto
            ? `/uploads/profile/${senderProfile.profilePhoto.split("/").pop()}`
            : "/default-profile.jpg",
        },
      }
    }

    res.status(200).json({
      success: true,
      hasUnread: unreadCount > 0,
      unreadCount,
      latestMessage: formattedLatestMessage,
    })
  } catch (error) {
    console.error("Error getting unread messages:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}




