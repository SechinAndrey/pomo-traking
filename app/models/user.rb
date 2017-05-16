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

  def get_statistics statistics_args
    statistics = Hash.new
    culc_periods_statistics
    statistics_args.each { |arg|
      culc_archive_statistics arg
      @archive_statistics[:pomo_count] += @period_statistics[:pomo_count]
      @archive_statistics[:work_minutes] += @period_statistics[:work_minutes]
      @archive_statistics[:short_break_count] += @period_statistics[:short_break_count]
      statistics[arg] = @archive_statistics
    }
    statistics
  end

  private
  def create_defaults
    self.create_duration_settings
  end

  def culc_periods_statistics
    @period_statistics = Hash.new
    @period_statistics.default = 0

    user = User.eager_load(projects: {pomo_cycle: :periods})
           .where('users.id = ? and periods.ended = ?', self.id, true).last

    unless user.nil?
      user.projects.each{ |project|
        project.pomo_cycle.periods.each{ |period|
          case period.periods_type
            when 'pomo'
              @period_statistics[:pomo_count] += 1
              @period_statistics[:work_minutes] += period.duration
            when 'short break'
              @period_statistics[:short_break_count] += 1
          end
        }
      }
    end
  end

  def culc_archive_statistics statistics_type
    date = DateTime.now
    @archive_statistics = Hash.new
    @archive_statistics.default = 0

    case statistics_type
      when 'all_time'
        user = User.eager_load(projects: :statistics)
                   .where('users.id = ?', self.id).last
      when 'last_month'
        user = User.eager_load(projects: :statistics)
                   .where('users.id = ? AND statistics.created_at BETWEEN ? AND ?',
                    self.id, date.beginning_of_month, date.end_of_month).last
      when 'last_week'
        user = User.eager_load(projects: :statistics)
                   .where('users.id = ? AND statistics.created_at BETWEEN ? AND ?',
                    self.id, date.beginning_of_week, date.end_of_week).last
    end

    unless user.nil?
      user.projects.each{ |project|
        project.statistics.each{ |statistic|
          @archive_statistics[:pomo_count] += 4
          @archive_statistics[:short_break_count] += 3
          @archive_statistics[:long_break_count] += 1
          @archive_statistics[:pomo_cycle_count] += 1
          @archive_statistics[:work_minutes] += statistic.work_minutes
        }
      }
    end
  end
end