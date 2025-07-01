import {defineSchema, defineTable} from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        name:v.string(),
        email:v.string(),
        tokenIdentifier:v.string(),
        avatarUrl:v.optional(v.string())
    }).index("by_token", ["tokenIdentifier"])
})