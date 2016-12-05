class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  has_one :avatar, :dependent => :destroy
  has_many :projects, :dependent => :destroy

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def pomo_started?
    self.current_project_status == 'started'
  end

  def pomo_paused?
    self.current_project_status == 'paused'
  end

end
