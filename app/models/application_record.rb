class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def serialize
    options = {
        include: '**'
    }
    ActiveModelSerializers::SerializableResource.new(self, options).as_json
  end
end
