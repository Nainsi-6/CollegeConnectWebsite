const Event = require("../models/Event");
const User = require("../models/User");
const UserPreference = require("../models/UserPreference");
const { Profile } = require("../models/Profile");
const natural = require("natural");
const { TfIdf } = natural;

// Get recommended events for a user
exports.getRecommendedEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user profile and preferences
    const user = await User.findById(userId);
    const userPreference = await UserPreference.findOne({ userId }) || { eventPreferences: { interests: [], categories: [] } };
    const userProfile = await Profile.findOne({ userId });
    
    // Extract user interests
    const userInterests = [
      ...(userProfile?.interests || []),
      ...(userPreference.eventPreferences?.interests || []),
      ...(userPreference.eventPreferences?.categories || [])
    ];
    
    // Build query based on user profile
    const query = { 
      date: { $gte: new Date() } // Only future events
    };
    
    // If user has specific interests, prioritize matching events
    if (userInterests.length > 0) {
      query.$or = [
        { category: { $in: userInterests } },
        { tags: { $in: userInterests } }
      ];
    }
    
    // Get events that match user profile
    let events = await Event.find(query)
      .sort({ date: 1 })
      .limit(20)
      .populate("organizer", "name email");
    
    // Use TF-IDF to rank events based on relevance to user interests
    if (userInterests.length > 0 && events.length > 0) {
      const tfidf = new TfIdf();
      
      // Add user profile as a document
      tfidf.addDocument(userInterests.join(' '));
      
      // Add each event as a document
      events.forEach((event, index) => {
        const eventText = `${event.title} ${event.description} ${event.category} ${event.tags.join(' ')}`;
        tfidf.addDocument(eventText);
      });
      
      // Calculate similarity scores
      const scores = events.map((_, index) => {
        let score = 0;
        tfidf.tfidfs(userInterests.join(' '), (i, measure) => {
          if (i === index + 1) { // +1 because user profile is the first document
            score = measure;
          }
        });
        return score;
      });
      
      // Sort events by relevance score
      events = events.map((event, index) => ({
        ...event.toObject(),
        relevanceScore: scores[index]
      })).sort((a, b) => b.relevanceScore - a.relevanceScore);
    }
    
    res.status(200).json({
      success: true,
      events: events.slice(0, 10) // Return top 10 most relevant events
    });
  } catch (error) {
    console.error("Error getting recommended events:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Track event view
exports.viewEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    
    // Increment view count
    const event = await Event.findByIdAndUpdate(
      eventId,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("organizer", "name email");
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }
    
    // Track user interaction for recommendation system
    await UserPreference.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          viewedEvents: { 
            eventId, 
            viewedAt: new Date() 
          } 
        } 
      },
      { upsert: true }
    );
    
    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    console.error("Error viewing event:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }
    
    // Check if user is already registered
    const isRegistered = await Event.findOne({
      _id: eventId,
      "attendees.userId": userId
    });
    
    if (isRegistered) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event"
      });
    }
    
    // Register user for the event
    await Event.findByIdAndUpdate(
      eventId,
      { 
        $push: { 
          attendees: { 
            userId, 
            registeredAt: new Date() 
          } 
        },
        $inc: { attendeeCount: 1 }
      }
    );
    
    // Track user registration for recommendation system
    await UserPreference.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          attendedEvents: { 
            eventId, 
            registeredAt: new Date() 
          } 
        } 
      },
      { upsert: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Successfully registered for the event"
    });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Update user event preferences
exports.updateEventPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const { categories, formats, interests } = req.body;
    
    const updatedPreferences = await UserPreference.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          eventPreferences: {
            categories: categories || [],
            formats: formats || [],
            interests: interests || []
          }
        } 
      },
      { upsert: true, new: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Event preferences updated successfully",
      preferences: updatedPreferences.eventPreferences
    });
  } catch (error) {
    console.error("Error updating event preferences:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};