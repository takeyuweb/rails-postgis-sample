class PlacesController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json do
        lat = params[:lat].to_f
        lng = params[:lng].to_f
        distance = params[:distance].to_f # meters

        places = Place.
          where("ST_DWithin(geom, ST_GeographyFromText('SRID=4326;POINT(:lng :lat)'), :distance)", lat: lat, lng: lng, distance: distance).
          select("*, ST_Distance(geom, ST_GeographyFromText('SRID=4326;POINT(#{lng} #{lat})')) AS distance")
        render json: places.to_json(only: [:id], methods: [:lat, :lng, :distance])
      end
    end
  end
end
