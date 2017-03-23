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

  private
  def create_defaults
    self.create_duration_settings
  end
end