import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  unique,
  uuid,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

const createdAt = timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
const updatedAt = timestamp('updated_at', { withTimezone: true }).notNull().$onUpdate(() => new Date());

export const proficiencyLevelEnum = pgEnum('proficiency_level', ['beginner', 'intermediate', 'advanced']);
export const sessionStatusEnum = pgEnum('session_status', ['scheduled', 'completed', 'cancelled']);
export const materialTypeEnum = pgEnum('material_type', ['file', 'link']);

/**
 * Users Table
 * Stores a local copy of user data from Clerk.
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
 * Sessions Table
 * Any authenticated user can create a session.
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

/**
 * Bookings Table
 * Connects users to the sessions they have booked.
 */
export const BookingsTable = pgTable('bookings', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull().references(() => UsersTable.id, { onDelete: 'cascade' }),
    sessionId: uuid('session_id').notNull().references(() => SessionsTable.id, { onDelete: 'cascade' }),
    createdAt,
  }, (table) => ({
    uniqueBooking: unique('unique_booking_idx').on(table.userId, table.sessionId),
  })
);

/**
 * Course Materials Table
 * Materials associated with a session.
 */
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
 * Relations
 * ============================================================================
 */

export const usersRelations = relations(UsersTable, ({ many }) => ({
  bookings: many(BookingsTable),
  createdSessions: many(SessionsTable, { relationName: 'CreatedSessions' }),
}));

export const sessionsRelations = relations(SessionsTable, ({ one, many }) => ({
  creator: one(UsersTable, {
    fields: [SessionsTable.creatorId],
    references: [UsersTable.id],
    relationName: 'CreatedSessions',
  }),
  participants: many(BookingsTable),
  materials: many(CourseMaterialsTable),
}));

export const bookingsRelations = relations(BookingsTable, ({ one }) => ({
  user: one(UsersTable, { fields: [BookingsTable.userId], references: [UsersTable.id] }),
  session: one(SessionsTable, { fields: [BookingsTable.sessionId], references: [SessionsTable.id] }),
}));

export const courseMaterialsRelations = relations(CourseMaterialsTable, ({ one }) => ({
    session: one(SessionsTable, {
        fields: [CourseMaterialsTable.sessionId],
        references: [SessionsTable.id],
    }),
}));

// --- Type Exports ---
export type InsertUser = typeof UsersTable.$inferInsert;
export type SelectUser = typeof UsersTable.$inferSelect;
export type InsertSession = typeof SessionsTable.$inferInsert;
export type SelectSession = typeof SessionsTable.$inferSelect;
export type InsertBooking = typeof BookingsTable.$inferInsert;
export type SelectBooking = typeof BookingsTable.$inferSelect;
export type InsertCourseMaterial = typeof CourseMaterialsTable.$inferInsert;
export type SelectCourseMaterial = typeof CourseMaterialsTable.$inferSelect;
