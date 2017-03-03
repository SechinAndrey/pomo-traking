module ApplicationCable
  class Connection < ActionCable::Connection::Base

    identified_by :current_user

    def connect
      ap 'CONNECT CONNECT CONNECT'
      ap'-----------------'
      ap "cookies.signed['user.id'] - #{cookies.signed['user.id']}"
      ap'-----------------'
      self.current_user = find_verified_user
      logger.add_tags 'ActionCable', current_user.username
    end

    def disconnect
      ap 'DISCONNECT DISCONNECT DISCONNECT'
    end

    protected
    def find_verified_user
      if verified_user = User.find_by(id: cookies.signed['user.id'])
        verified_user
      else
        reject_unauthorized_connection
      end
    end

  end
end
