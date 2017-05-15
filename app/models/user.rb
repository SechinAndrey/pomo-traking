class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  after_create :create_defaults

  has_one :avatar, :dependent => :destroy
  has_many :projects, :dependent => :destroy
  has_one :duration_settings, as: :durationable

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :email, :username, presence: true
  validates :email, length: { maximum: 320 }
  validates :username, length: { maximum: 100 }

  def current_project
    self.current_project_id.nil? ? nil : self.projects.where(id: self.current_project_id).last
  end

  def get_statistics statistics_type
    statistics = {
        pomo_count: 0,
        short_break_count: 0,
        long_break_count: 0,
        pomo_cycle_count: 0,
        work_minutes: 0
    }

    case statistics_type
      when 'all_time'
        user = User.eager_load(projects: :statistics)
        .where('users.id = ?', self.id).last
      when 'last_month'
        user = User.eager_load(projects: :statistics)
        .where('users.id = ? AND statistics.created_at BETWEEN ? AND ?', self.id, 1.month.ago, Time.now).last
      when 'last_week'
        user = User.eager_load(projects: :statistics)
        .where('users.id = ? AND statistics.created_at BETWEEN ? AND ?', self.id, 1.week.ago, Time.now).last
    end

    unless user.nil?
      user.projects.each{ |project|
        project.statistics.each{ |statistic|
          statistics[:pomo_count] += 4
          statistics[:short_break_count] += 3
          statistics[:long_break_count] += 1
          statistics[:pomo_cycle_count] += 1
          statistics[:work_minutes] += statistic.work_minutes
        }
      }
    end


    user = User.eager_load(projects: {pomo_cycle: :periods})
    .where('users.id = 3 and periods.ended = ?', true).last

    unless user.nil?
      user.projects.each{ |project|
        project.pomo_cycle.periods.each{ |period|
          case period.periods_type
            when 'pomo'
              statistics[:pomo_count] += 1
              statistics[:work_minutes] += period.duration
            when 'short break'
              statistics[:short_break_count] += 1
          end
        }
      }
    end

    statistics
  end

  private
  def create_defaults
    self.create_duration_settings
  end
end