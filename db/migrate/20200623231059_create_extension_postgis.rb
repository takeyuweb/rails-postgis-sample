class CreateExtensionPostgis < ActiveRecord::Migration[6.0]
  def up
    enable_extension 'postgis' unless extension_enabled?('postgis')
  end

  def down
    disable_extension 'postgis' if extension_enabled?('postgis')
  end
end
