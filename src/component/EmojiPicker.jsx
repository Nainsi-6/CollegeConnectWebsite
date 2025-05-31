"use client"

import { useState } from "react"

const EmojiPicker = ({ onEmojiSelect, isOpen, onClose }) => {
  const emojiCategories = {
    "Smileys & People": [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤨",
      "🧐",
      "🤓",
      "😎",
      "🤩",
      "🥳",
      "😏",
      "😒",
      "😞",
      "😔",
      "😟",
      "😕",
      "🙁",
      "☹️",
      "😣",
      "😖",
      "😫",
      "😩",
      "🥺",
      "😢",
      "😭",
      "😤",
      "😠",
      "😡",
      "🤬",
    ],
    Activities: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🥏",
      "🎱",
      "🪀",
      "🏓",
      "🏸",
      "🏒",
      "🏑",
      "🥍",
      "🏏",
      "🪃",
      "🥅",
      "⛳",
      "🪁",
      "🏹",
      "🎣",
      "🤿",
      "🥊",
      "🥋",
      "🎽",
      "🛹",
      "🛷",
      "⛸️",
    ],
    Objects: [
      "⌚",
      "📱",
      "📲",
      "💻",
      "⌨️",
      "🖥️",
      "🖨️",
      "🖱️",
      "🖲️",
      "🕹️",
      "🗜️",
      "💽",
      "💾",
      "💿",
      "📀",
      "📼",
      "📷",
      "📸",
      "📹",
      "🎥",
      "📽️",
      "🎞️",
      "📞",
      "☎️",
      "📟",
      "📠",
      "📺",
      "📻",
      "🎙️",
      "🎚️",
    ],
    Nature: [
      "🌱",
      "🌿",
      "☘️",
      "🍀",
      "🎋",
      "🍃",
      "🌾",
      "🌵",
      "🌲",
      "🌳",
      "🌴",
      "🌸",
      "🌺",
      "🌻",
      "🌷",
      "🌹",
      "🥀",
      "🌼",
      "🌙",
      "⭐",
      "🌟",
      "✨",
      "⚡",
      "☄️",
      "💫",
      "🌈",
      "☀️",
      "🌤️",
      "⛅",
      "🌦️",
    ],
    Food: [
      "🍎",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🫐",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🥦",
      "🥬",
      "🥒",
      "🌶️",
      "🫑",
      "🌽",
      "🥕",
      "🫒",
      "🧄",
      "🧅",
      "🥔",
      "🍠",
    ],
  }

  const [activeCategory, setActiveCategory] = useState("Smileys & People")

  if (!isOpen) return null

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 w-80">
      <div className="p-3">
        {/* Category tabs */}
        <div className="flex space-x-1 mb-3 overflow-x-auto">
          {Object.keys(emojiCategories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-2 py-1 text-xs rounded whitespace-nowrap transition-colors ${
                activeCategory === category ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Emoji grid */}
        <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
          {emojiCategories[activeCategory].map((emoji, index) => (
            <button
              key={index}
              onClick={() => {
                onEmojiSelect(emoji)
                onClose()
              }}
              className="p-2 text-lg hover:bg-gray-700 rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Close button */}
        <div className="flex justify-end mt-2">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmojiPicker
