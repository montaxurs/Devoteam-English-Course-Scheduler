import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  unique,
  uuid,
  index,
  time,
  date, // Add 'date' to imports
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

const createdAt = timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
const updatedAt = timestamp('updated_at', { withTimezone: true }).notNull().$onUpdate(() => new Date());

// --- ENGLISH COURSE ENUMS ---
export const proficiencyLevelEnum = pgEnum('proficiency_level', ['beginner', 'intermediate', 'advanced']);
export const sessionStatusEnum = pgEnum('session_status', ['scheduled', 'completed', 'cancelled']);
export const materialTypeEnum = pgEnum('material_type', ['file', 'link']);

// --- AI COURSE ENUMS ---
export const aiSessionDayEnum = pgEnum('ai_session_day', ['Tuesday', 'Friday']); 
export const aiSessionStatusEnum = pgEnum('ai_session_status', ['scheduled', 'coming_soon', 'completed', 'cancelled']);


/**
 * ============================================================================
 * SHARED TABLES
 * ============================================================================
 */

export const UsersTable = pgTable('users', {
  id: text('id').primaryKey(), // Clerk User ID
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  createdAt,
  updatedAt,
});


/**
 * ============================================================================
 * ENGLISH COURSE TABLES
 * ============================================================================
 */

export const SessionsTable = pgTable('sessions', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description'),
    proficiencyLevel: proficiencyLevelEnum('proficiency_level').notNull(),
    startTime: timestamp('start_time', { withTimezone: true }).notNull(),
    endTime: timestamp('end_time', { withTimezone: true }).notNull(),
    capacity: integer('capacity').notNull().default(10),
    status: sessionStatusEnum('status').notNull().default('scheduled'),
    creatorId: text('creator_id').notNull().references(() => UsersTable.id, { onDelete: 'cascade' }),
    createdAt,
    updatedAt,
  }, (table) => ({
    creatorIdIndex: index('sessions_creator_id_idx').on(table.creatorId),
  })
);

export const BookingsTable = pgTable('bookings', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull().references(() => UsersTable.id, { onDelete: 'cascade' }),
    sessionId: uuid('session_id').notNull().references(() => SessionsTable.id, { onDelete: 'cascade' }),
    createdAt,
  }, (table) => ({
    uniqueBooking: unique('unique_booking_idx').on(table.userId, table.sessionId),
  })
);

export const CourseMaterialsTable = pgTable('course_materials', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    type: materialTypeEnum('type').notNull(),
    url: text('url').notNull(),
    sessionId: uuid('session_id').notNull().references(() => SessionsTable.id, { onDelete: 'cascade' }),
    createdAt,
}, (table) => ({
    sessionIdIndex: index('materials_session_id_idx').on(table.sessionId),
}));


/**
 * ============================================================================
 * AI COURSE TABLES (UPDATED)
 * ============================================================================
 */

export const AiSessionsTable = pgTable('ai_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  // UPDATE: Add a dedicated column for the specific date of the session
  sessionDate: date('session_date').notNull(),
  dayOfWeek: aiSessionDayEnum('day_of_week').notNull(),
  startTime: time('start_time').notNull(), // e.g., '16:00:00'
  durationInMinutes: integer('duration_in_minutes').notNull().default(90),
  capacity: integer('capacity').notNull().default(10),
  minCapacity: integer('min_capacity').notNull().default(6),
  status: aiSessionStatusEnum('status').notNull().default('scheduled'),
  creatorId: text('creator_id').notNull().references(() => UsersTable.id, { onDelete: 'cascade' }),
  createdAt,
  updatedAt,
}, (table) => ({
  creatorIdIndex: index('ai_sessions_creator_id_idx').on(table.creatorId),
}));


// ... (The rest of the file remains the same)

// NEW: Bookings for AI sessions
export const AiBookingsTable = pgTable('ai_bookings', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull().references(() => UsersTable.id, { onDelete: 'cascade' }),
    aiSessionId: uuid('ai_session_id').notNull().references(() => AiSessionsTable.id, { onDelete: 'cascade' }),
    createdAt,
  }, (table) => ({
    uniqueBooking: unique('ai_unique_booking_idx').on(table.userId, table.aiSessionId),
  })
);

// NEW: Materials for AI sessions
export const AiCourseMaterialsTable = pgTable('ai_course_materials', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    type: materialTypeEnum('type').notNull(),
    url: text('url').notNull(),
    aiSessionId: uuid('ai_session_id').notNull().references(() => AiSessionsTable.id, { onDelete: 'cascade' }),
    createdAt,
}, (table) => ({
    sessionIdIndex: index('ai_materials_session_id_idx').on(table.aiSessionId),
}));

/**
 * ============================================================================
 * Relations
 * ============================================================================
 */
export const usersRelations = relations(UsersTable, ({ many }) => ({
  // English
  bookings: many(BookingsTable),
  createdSessions: many(SessionsTable, { relationName: 'CreatedEnglishSessions' }),
  // AI
  aiBookings: many(AiBookingsTable),
  createdAiSessions: many(AiSessionsTable, { relationName: 'CreatedAiSessions' }),
}));
// --- English Relations ---
export const sessionsRelations = relations(SessionsTable, ({ one, many }) => ({
  creator: one(UsersTable, { fields: [SessionsTable.creatorId], references: [UsersTable.id], relationName: 'CreatedEnglishSessions' }),
  participants: many(BookingsTable),
  materials: many(CourseMaterialsTable),
}));
export const bookingsRelations = relations(BookingsTable, ({ one }) => ({
  user: one(UsersTable, { fields: [BookingsTable.userId], references: [UsersTable.id] }),
  session: one(SessionsTable, { fields: [BookingsTable.sessionId], references: [SessionsTable.id] }),
}));
export const courseMaterialsRelations = relations(CourseMaterialsTable, ({ one }) => ({
  session: one(SessionsTable, { fields: [CourseMaterialsTable.sessionId], references: [SessionsTable.id] }),
}));
// --- AI Relations (NEW) ---
export const aiSessionsRelations = relations(AiSessionsTable, ({ one, many }) => ({
  creator: one(UsersTable, { fields: [AiSessionsTable.creatorId], references: [UsersTable.id], relationName: 'CreatedAiSessions' }),
  participants: many(AiBookingsTable),
  materials: many(AiCourseMaterialsTable),
}));
export const aiBookingsRelations = relations(AiBookingsTable, ({ one }) => ({
  user: one(UsersTable, { fields: [AiBookingsTable.userId], references: [UsersTable.id] }),
  session: one(AiSessionsTable, { fields: [AiBookingsTable.aiSessionId], references: [AiSessionsTable.id] }),
}));
export const aiCourseMaterialsRelations = relations(AiCourseMaterialsTable, ({ one }) => ({
  session: one(AiSessionsTable, { fields: [AiCourseMaterialsTable.aiSessionId], references: [AiSessionsTable.id] }),
}));
/**
 * ============================================================================
 * Type Exports
 * ============================================================================
 */
// English Types
export type InsertUser = typeof UsersTable.$inferInsert;
export type SelectUser = typeof UsersTable.$inferSelect;
export type InsertSession = typeof SessionsTable.$inferInsert;
export type SelectSession = typeof SessionsTable.$inferSelect;
export type InsertBooking = typeof BookingsTable.$inferInsert;
export type SelectBooking = typeof BookingsTable.$inferSelect;
export type InsertCourseMaterial = typeof CourseMaterialsTable.$inferInsert;
export type SelectCourseMaterial = typeof CourseMaterialsTable.$inferSelect;
// AI Types (NEW)
export type InsertAiSession = typeof AiSessionsTable.$inferInsert;
export type SelectAiSession = typeof AiSessionsTable.$inferSelect;
export type InsertAiBooking = typeof AiBookingsTable.$inferInsert;
export type SelectAiBooking = typeof AiBookingsTable.$inferSelect;
export type InsertAiCourseMaterial = typeof AiCourseMaterialsTable.$inferInsert;
export type SelectAiCourseMaterial = typeof AiCourseMaterialsTable.$inferSelect;
