class CreatePlaces < ActiveRecord::Migration[6.0]
  def change
    create_table :places do |t|
      t.st_point :geom, geographic: true
      t.index :geom, using: :gist

      t.timestamps
    end
  end
end
