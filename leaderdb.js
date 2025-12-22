// leaderboard_schema.js
db.createCollection("leaderboards", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["gameId", "name", "createdAt"],
      properties: {
        gameId: { bsonType: "string" },
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        type: { 
          bsonType: "string", 
          enum: ["daily", "weekly", "monthly", "all_time", "seasonal"] 
        },
        season: { bsonType: "string" },
        startDate: { bsonType: "date" },
        endDate: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        isActive: { bsonType: "bool" },
        settings: {
          bsonType: "object",
          properties: {
            maxEntries: { bsonType: "int", minimum: 1 },
            allowNegative: { bsonType: "bool" },
            scoreDecay: { bsonType: "bool" },
            decayRate: { bsonType: "double", minimum: 0 }
          }
        }
      }
    }
  }
});

db.createCollection("leaderboard_entries", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["leaderboardId", "userId", "score", "updatedAt"],
      properties: {
        leaderboardId: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        username: { bsonType: "string" },
        avatar: { bsonType: "string" },
        score: { bsonType: "double" },
        metadata: { bsonType: "object" },
        rank: { bsonType: "int", minimum: 1 },
        previousRank: { bsonType: "int" },
        streak: { bsonType: "int", minimum: 0 },
        timesInTop: { bsonType: "int", minimum: 0 },
        lastPlayed: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        isBot: { bsonType: "bool" }
      }
    }
  }
});

db.createCollection("score_history", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["entryId", "oldScore", "newScore", "change", "timestamp", "reason"],
      properties: {
        entryId: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        leaderboardId: { bsonType: "objectId" },
        oldScore: { bsonType: "double" },
        newScore: { bsonType: "double" },
        change: { bsonType: "double" },
        timestamp: { bsonType: "date" },
        reason: { 
          bsonType: "string",
          enum: ["game_win", "bonus", "penalty", "decay", "manual", "reset"] 
        },
        gameId: { bsonType: "string" },
        sessionId: { bsonType: "string" }
      }
    }
  }
});

// Create indexes
db.leaderboards.createIndex({ gameId: 1, type: 1, isActive: 1 });
db.leaderboards.createIndex({ startDate: 1, endDate: 1 });

db.leaderboard_entries.createIndex({ leaderboardId: 1, score: -1 });
db.leaderboard_entries.createIndex({ leaderboardId: 1, userId: 1 }, { unique: true });
db.leaderboard_entries.createIndex({ leaderboardId: 1, rank: 1 });
db.leaderboard_entries.createIndex({ userId: 1 });
db.leaderboard_entries.createIndex({ updatedAt: 1 });

db.score_history.createIndex({ entryId: 1, timestamp: -1 });
db.score_history.createIndex({ userId: 1, leaderboardId: 1, timestamp: -1 });
