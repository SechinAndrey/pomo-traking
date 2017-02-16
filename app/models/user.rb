class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  has_one :avatar, :dependent => :destroy
  has_many :projects, :dependent => :destroy

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :email, :username, :pomo_time, :short_break_time, :long_break_time, presence: true
  validates :email, length: { maximum: 320 }
  validates :username, length: { maximum: 100 }
  validates :pomo_time, :short_break_time, :long_break_time, numericality: {
      only_integer: true,
      greater_than_or_equal_to: 1,
      less_than_or_equal_to: 100
  }

  def pomo_started?
    self.current_project_status == 'started'
  end

  def pomo_paused?
    self.current_project_status == 'paused'
  end

end