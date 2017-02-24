require 'counter'

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  has_one :avatar, :dependent => :destroy
  has_many :projects, :dependent => :destroy
  has_one :duration_settings, as: :durationable

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :email, :username, presence: true
  validates :email, length: { maximum: 320 }
  validates :username, length: { maximum: 100 }

  def counter
    @counter ||= Counter.new self
  end

  def pomo_started?
    self.current_project_status == 'started'
  end

  def pomo_paused?
    self.current_project_status == 'paused'
  end

end