class Place < ApplicationRecord
  def lat
    self.geom.y.to_f
  end

  def lng
    self.geom.x.to_f
  end
end
