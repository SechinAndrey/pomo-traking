# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170301135355) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "avatars", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "avatar"
    t.integer  "user_id"
  end

  create_table "duration_settings", force: :cascade do |t|
    t.integer  "pomo_duration"
    t.integer  "short_break_duration"
    t.integer  "long_break_duration"
    t.integer  "durationable_id"
    t.string   "durationable_type"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.index ["durationable_id", "durationable_type"], name: "index_duration_settings", using: :btree
  end

  create_table "periods", force: :cascade do |t|
    t.integer  "pomo_cycle_id"
    t.string   "periods_type"
    t.bigint   "end_time"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.bigint   "pause_time"
    t.integer  "duration"
    t.boolean  "ended",         default: false
  end

  create_table "pomo_cycles", force: :cascade do |t|
    t.integer  "project_id"
    t.boolean  "ended",      default: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "projects", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "status"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "username"
    t.integer  "current_project_id"
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

end
