# Ruby on Rails + PostGIS

![browser](https://user-images.githubusercontent.com/60980/85485004-dfd9bc80-b602-11ea-9217-884bb41d285b.png)

## Try it

```bash
$ docker-compose run app bundle exec rails db:setup
$ docker-compose up
```

http://localhost:3000

## Sample

### 東京駅（緯度:35.681236 経度:139.767125）から半径1km以内を検索し近い順で並べる

```ruby
lat = 35.681236
lng = 139.767125
distance = 1000.0

places = Place.
  where("ST_DWithin(geom, ST_GeographyFromText('SRID=4326;POINT(#{lng} #{lat})'), #{distance})").
  select("places.*, ST_Distance(geom, ST_GeographyFromText('SRID=4326;POINT(#{lng} #{lat})')) AS distance").
  order(distance: :asc)
```

#### SQL

```sql
SELECT places.*, ST_Distance(geom, ST_GeographyFromText('SRID=4326;POINT(139.767125 35.681236)')) AS distance 
FROM "places"
WHERE (ST_DWithin(geom, ST_GeographyFromText('SRID=4326;POINT(139.767125 35.681236)'), 1000.0))
ORDER BY "distance" ASC
```

#### EXPLAIN ANALYZE

```
irb(main):038:0> Place.count
   (31.5ms)  SELECT COUNT(*) FROM "places"
=> 1000000
irb(main):039:0> puts Place.connection.select_all(<<SQL)
irb(main):040:1" EXPLAIN ANALYZE SELECT places.*, ST_Distance(geom, ST_GeographyFromText('SRID=4326;POINT(139.767125 35.681236)')) AS distance FROM "places" WHERE (ST_DWithin(geom, ST_GeographyFromText('SRID=4326;POINT(139.767125 35.681236)'), 1000.0)) ORDER BY "distance" ASC
irb(main):041:1" SQL
   (3.9ms)  EXPLAIN ANALYZE SELECT places.*, ST_Distance(geom, ST_GeographyFromText('SRID=4326;POINT(139.767125 35.681236)')) AS distance FROM "places" WHERE (ST_DWithin(geom, ST_GeographyFromText('SRID=4326;POINT(139.767125 35.681236)'), 1000.0)) ORDER BY "distance" ASC

{"QUERY PLAN"=>"Sort  (cost=8.94..8.95 rows=1 width=64) (actual time=3.132..3.153 rows=316 loops=1)"}
{"QUERY PLAN"=>"  Sort Key: (_st_distance(geom, '0101000020E6100000355EBA498C786140CE6DC2BD32D74140'::geography, '0'::double precision, true))"}
{"QUERY PLAN"=>"  Sort Method: quicksort  Memory: 69kB"}
{"QUERY PLAN"=>"  ->  Index Scan using index_places_on_geom on places  (cost=0.29..8.93 rows=1 width=64) (actual time=0.209..3.016 rows=316 loops=1)"}
{"QUERY PLAN"=>"        Index Cond: (geom && '0101000020E6100000355EBA498C786140CE6DC2BD32D74140'::geography)"}
{"QUERY PLAN"=>"        Filter: (('0101000020E6100000355EBA498C786140CE6DC2BD32D74140'::geography && _st_expand(geom, '1000'::double precision)) AND _st_dwithin(geom, '0101000020E6100000355EBA498C786140CE6DC2BD32D74140'::geography, '1000'::double precision, true))"}
{"QUERY PLAN"=>"        Rows Removed by Filter: 205"}
{"QUERY PLAN"=>"Planning Time: 0.173 ms"}
{"QUERY PLAN"=>"Execution Time: 3.183 ms"}
=> nil
```
